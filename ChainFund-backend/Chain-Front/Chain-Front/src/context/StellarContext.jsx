import { createContext, useContext, useState, useEffect } from "react";
import {
  Horizon,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  Memo,
} from "@stellar/stellar-sdk";
import {
  isConnected as checkFreighterConnection,
  signTransaction,
  requestAccess,
} from "@stellar/freighter-api";
import toast from "react-hot-toast";

const StellarContext = createContext();

export const useStellar = () => {
  const context = useContext(StellarContext);
  if (!context) {
    throw new Error("useStellar must be used within StellarProvider");
  }
  return context;
};

// Storage keys for persistence
const STORAGE_KEYS = {
  WALLET_CONNECTED: 'stellar_wallet_connected',
  PUBLIC_KEY: 'stellar_public_key',
  NETWORK: 'stellar_network',
};

export const StellarProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEY);
    return saved || null;
  });
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';
  });
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.NETWORK) || "TESTNET";
  });
  const [loading, setLoading] = useState(false);
  const [xlmPrice, setXlmPrice] = useState(null);

  const server =
    network === "TESTNET"
      ? new Horizon.Server("https://horizon-testnet.stellar.org")
      : new Horizon.Server("https://horizon.stellar.org");

  const networkPassphrase =
    network === "TESTNET" ? Networks.TESTNET : Networks.PUBLIC;

  // Persist wallet state to localStorage
  useEffect(() => {
    if (publicKey) {
      localStorage.setItem(STORAGE_KEYS.PUBLIC_KEY, publicKey);
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'false');
    }
  }, [publicKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NETWORK, network);
  }, [network]);

  useEffect(() => {
    checkConnection();
    fetchXlmPrice();
  }, []);

  useEffect(() => {
    if (publicKey) {
      loadAccountBalance();
    }
  }, [publicKey, network]);

  const fetchXlmPrice = async () => {
    // Use default price for development to avoid CORS issues
    const DEFAULT_XLM_PRICE = 0.12;

    try {
      // Try fetching from CoinGecko directly first
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd",
        { signal: AbortSignal.timeout(3000) }
      );
      if (response.ok) {
        const data = await response.json();
        if (data.stellar?.usd) {
          setXlmPrice(data.stellar.usd);
          return;
        }
      }
    } catch {
      // Silently continue to fallback
    }

    // If direct API fails, use default price (CORS issues in dev are expected)
    setXlmPrice(DEFAULT_XLM_PRICE);
  };

  const checkConnection = async () => {
    try {
      const connected = await checkFreighterConnection();

      console.log("🔄 Auto-connect check:", connected);

      // Check if we have a saved public key and try to reconnect
      const savedPublicKey = localStorage.getItem(STORAGE_KEYS.PUBLIC_KEY);

      if (connected && savedPublicKey) {
        if (window.freighterApi && window.freighterApi.getPublicKey) {
          try {
            const address = await window.freighterApi.getPublicKey();

            if (address && typeof address === 'string') {
              setPublicKey(address);
              setIsConnected(true);
              console.log("✅ Wallet auto-reconnected:", address);
            }
          } catch (err) {
            console.log("ℹ No previous authorization found, clearing saved state");
            localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
            localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'false');
            setPublicKey(null);
            setIsConnected(false);
          }
        }
      } else if (!connected && savedPublicKey) {
        // Freighter not available but we have saved state - clear it
        console.log("ℹ Freighter not available, clearing saved wallet state");
        localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
        localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'false');
        setPublicKey(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.log("ℹ Auto-connect not available - user needs to connect manually");
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);

      console.log("=== 🚀 WALLET CONNECTION START ===");

      // Method 1: Check if Freighter API is available
      const hasFreighterAPI = typeof window.freighterApi !== 'undefined';
      console.log("✅ Step 1a: window.freighterApi exists:", hasFreighterAPI);

      // Method 2: Check using isConnected function
      let connected = false;
      try {
        connected = await checkFreighterConnection();
        console.log("✅ Step 1b: checkFreighterConnection result:", connected);
      } catch (err) {
        console.log("ℹ️  checkFreighterConnection not available, using fallback");
      }

      // Method 3: Direct check for Freighter extension
      const hasFreighterExtension = hasFreighterAPI || connected;

      console.log("✅ Step 1c: Final Freighter check:", hasFreighterExtension);

      if (!hasFreighterExtension) {
        console.error("❌ Freighter not detected!");
        toast.error(
          "Freighter wallet not found. Please install it or make sure it's enabled.",
          { duration: 4000 }
        );

        // Ask user if they want to install
        const shouldInstall = window.confirm(
          "Freighter wallet extension is not installed. Would you like to install it now?"
        );

        if (shouldInstall) {
          window.open("https://www.freighter.app/", "_blank");
        }
        return;
      }

      console.log("🔄 Step 2: Requesting wallet access...");

      // Try to request access
      let walletAddress;
      try {
        walletAddress = await requestAccess();
      } catch (accessError) {
        console.error("❌ Access request failed:", accessError);

        // Check if it's a user rejection
        if (accessError.message?.includes("User declined") ||
          accessError.message?.includes("rejected")) {
          toast.error("Connection request was declined");
          return;
        }

        // Try alternative method using window.freighterApi
        if (window.freighterApi && window.freighterApi.getPublicKey) {
          try {
            walletAddress = await window.freighterApi.getPublicKey();
            console.log("✅ Got address via alternative method");
          } catch (altError) {
            console.error("❌ Alternative method also failed:", altError);
            toast.error("Failed to connect to Freighter. Please try again.");
            return;
          }
        } else {
          throw accessError;
        }
      }

      console.log("📦 Step 3: Result:", walletAddress);
      console.log("📦 Step 3: Type:", typeof walletAddress);

      if (!walletAddress || typeof walletAddress !== 'string') {
        console.error("❌ Invalid address received!");
        toast.error("Could not retrieve wallet address. Please try again.");
        return;
      }

      if (!walletAddress.startsWith('G')) {
        console.error("❌ Invalid Stellar address format!");
        toast.error("Invalid wallet address format. Please try again.");
        return;
      }

      console.log("✅ Step 4: Valid address retrieved:", walletAddress);

      setPublicKey(walletAddress);
      setIsConnected(true);

      toast.success(
        `Wallet connected: ${walletAddress.substring(0, 4)}...${walletAddress.substring(
          walletAddress.length - 4
        )}`
      );

      console.log("=== ✅ WALLET CONNECTION COMPLETE ===");

      return walletAddress;
    } catch (error) {
      console.error("=== 💥 EXCEPTION in connectWallet ===");
      console.error("💥 Error:", error);
      console.error("💥 Message:", error.message);

      const errorMessage = error?.message?.toLowerCase() || "";

      if (
        errorMessage.includes("user declined") ||
        errorMessage.includes("rejected") ||
        errorMessage.includes("denied")
      ) {
        toast.error("Connection request was declined");
      } else if (errorMessage.includes("locked")) {
        toast.error("Please unlock your Freighter wallet and try again");
      } else {
        toast.error(`Failed to connect wallet: ${error.message || "Unknown error"}`);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.PUBLIC_KEY);
    localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'false');

    setPublicKey(null);
    setIsConnected(false);
    setBalance(null);
    toast.success("Wallet disconnected");
  };

  const loadAccountBalance = async () => {
    if (!publicKey) return;

    try {
      const account = await server.loadAccount(publicKey);
      const xlmBalance = account.balances.find(
        (b) => b.asset_type === "native"
      );

      const balances = account.balances.map((balance) => {
        if (balance.asset_type === "native") {
          return {
            asset: "XLM",
            balance: balance.balance,
            limit: null,
          };
        } else {
          return {
            asset: `${balance.asset_code}:${balance.asset_issuer}`,
            balance: balance.balance,
            limit: balance.limit,
          };
        }
      });

      setBalance({
        xlm: xlmBalance?.balance || "0",
        all: balances,
      });
    } catch (error) {
      console.error("Error loading balance:", error);
      if (error.response?.status === 404) {
        toast.error("Account not funded. Please fund your account first.");
      }
    }
  };

  const sendPayment = async ({
    destination,
    amount,
    asset = "native",
    memo = "payment done",
    assetCode = null,
    assetIssuer = null,
  }) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);

      const sourceAccount = await server.loadAccount(publicKey);

      let transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      });

      if (memo) {
        transaction = transaction.addMemo(Memo.text(memo));
      }

      const payment =
        asset === "native"
          ? Operation.payment({
            destination: destination,
            asset: Asset.native(),
            amount: amount.toString(),
          })
          : Operation.payment({
            destination: destination,
            asset: new Asset(assetCode, assetIssuer),
            amount: amount.toString(),
          });

      transaction = transaction.addOperation(payment).setTimeout(180).build();

      const xdr = transaction.toXDR();
      const signedXdr = await signTransaction(xdr, {
        network: network,
        networkPassphrase: networkPassphrase,
      });

      const transactionResult = await server.submitTransaction(
        TransactionBuilder.fromXDR(signedXdr, networkPassphrase)
      );

      toast.success("Payment sent successfully!");
      await loadAccountBalance();

      return transactionResult;
    } catch (error) {
      console.error("Error sending payment:", error);
      toast.error(`Payment failed: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTrustline = async (
    assetCode,
    assetIssuer,
    limit = "100000000"
  ) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      throw new Error("Wallet not connected");
    }

    try {
      setLoading(true);

      const sourceAccount = await server.loadAccount(publicKey);

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: networkPassphrase,
      })
        .addOperation(
          Operation.changeTrust({
            asset: new Asset(assetCode, assetIssuer),
            limit: limit,
          })
        )
        .setTimeout(180)
        .build();

      const xdr = transaction.toXDR();
      const signedXdr = await signTransaction(xdr, {
        network: network,
        networkPassphrase: networkPassphrase,
      });

      const transactionResult = await server.submitTransaction(
        TransactionBuilder.fromXDR(signedXdr, networkPassphrase)
      );

      toast.success("Trustline created successfully!");
      await loadAccountBalance();

      return transactionResult;
    } catch (error) {
      console.error("Error creating trustline:", error);
      toast.error(`Failed to create trustline: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const switchNetwork = (newNetwork) => {
    setNetwork(newNetwork);
    toast.success(`Switched to ${newNetwork}`);
    if (publicKey) {
      loadAccountBalance();
    }
  };

  const value = {
    publicKey,
    isConnected,
    balance,
    network,
    loading,
    xlmPrice,
    connectWallet,
    disconnectWallet,
    sendPayment,
    createTrustline,
    loadAccountBalance,
    switchNetwork,
    fetchXlmPrice,
    server,
    networkPassphrase,
  };

  return (
    <StellarContext.Provider value={value}>{children}</StellarContext.Provider>
  );
};