import { motion } from "framer-motion";
import { useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStellar } from "../context/StellarContext";
import { useEVM } from "../context/EVMContext";
import {
  Wallet,
  ChevronDown,
  Info,
  CheckCircle,
  AlertCircle,
  Heart,
  Zap,
  ArrowRight,
  Lock,
  Sparkles,
  DollarSign,
  Gift,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { getProjectBySlug } from "../data/projects";
import TokenRewardModal from '../components/TokenRewardModal';
import TransactionDetailsModal from '../components/TransactionDetailsModal';
import { validateDonationForm, sanitizeString } from "../utils/validation";
import ContractService from "../services/ContractService";
import AIHelper from "../components/AIHelper";

const Donate = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    publicKey,
    isConnected,
    connectWallet,
    sendPayment,
    balance,
    loading,
    xlmPrice,
    network
  } = useStellar();

  // EVM wallet (Ethereum/Polygon)
  const {
    address: evmAddress,
    isConnected: evmConnected,
    connect: connectEVM,
    sendTransaction: sendEVMTransaction,
    balance: evmBalance,
    loading: evmLoading,
    prices: evmPrices,
    getNativeCurrency,
    chainId,
    switchChain,
    shortAddress: evmShortAddress
  } = useEVM();

  // Handle gig payment data if coming from HireGig page
  useEffect(() => {
    if (location.state?.amount) {
      setDonationAmount(location.state.amount.toString());
      if (location.state.requirements) {
        setMemo(location.state.requirements.slice(0, 20)); // Truncate to 20 chars
      }
    }
  }, [location.state]);

  const [donationAmount, setDonationAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("XLM");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [givethDonation, setGivethDonation] = useState(10);
  const [memo, setMemo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  // Format address helper function
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get project data dynamically
  const project = getProjectBySlug(slug);

  // If project not found, redirect to projects page
  if (!project) {
    return <Navigate to="/projects/all" replace />;
  }

  // Multi-chain assets
  const assets = [
    { code: "XLM", name: "Stellar Lumens", icon: Sparkles, chain: "stellar", color: "#000000" },
    { code: "ETH", name: "Ethereum", icon: Layers, chain: "ethereum", color: "#627EEA" },
    { code: "MATIC", name: "Polygon", icon: Layers, chain: "polygon", color: "#8247E5" },
    { code: "USDC", name: "USD Coin", icon: DollarSign, chain: "stellar", color: "#2775CA" },
    { code: "GIV", name: "Giveth Token", icon: Gift, chain: "stellar", color: "#5326EC" },
  ];

  // Get the selected asset info
  const selectedAssetInfo = assets.find(a => a.code === selectedAsset);
  const isEVMChain = selectedAssetInfo?.chain === "ethereum" || selectedAssetInfo?.chain === "polygon";

  // Check if correct wallet is connected for selected chain
  const isCorrectWalletConnected = () => {
    if (isEVMChain) return evmConnected;
    return isConnected;
  };

  // Get current price for selected asset
  const getCurrentPrice = () => {
    switch (selectedAsset) {
      case "XLM": return xlmPrice || 0.12;
      case "ETH": return evmPrices?.eth || 2000;
      case "MATIC": return evmPrices?.matic || 0.8;
      default: return 1;
    }
  };

  // Calculate crypto amount from USD
  const getCryptoAmount = (usdAmount) => {
    const price = getCurrentPrice();
    return price > 0 ? usdAmount / price : 0;
  };

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleDonate = async () => {
    try {
      // Check if correct wallet is connected
      if (!isCorrectWalletConnected()) {
        if (isEVMChain) {
          toast.error("Please connect your MetaMask wallet for " + selectedAsset);
          await connectEVM();
        } else {
          toast.error("Please connect your Stellar wallet first");
          await connectWallet();
        }
        return;
      }

      // Validate donation form
      const validation = validateDonationForm({ 
        amount: parseFloat(donationAmount),
        message: memo
      });
      
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0];
        toast.error(firstError);
        return;
      }

      // Get the project info
      const project = getProjectBySlug(slug);
      if (!project) {
        toast.error("Project not found");
        return;
      }

      setIsProcessing(true);

      // Convert USD to crypto using current price
      const usdAmount = parseFloat(donationAmount);
      const givethUsdAmount = (usdAmount * givethDonation) / 100;
      const totalUsdAmount = usdAmount + givethUsdAmount;
      const cryptoAmount = getCryptoAmount(totalUsdAmount);

      console.log("=== MULTI-CHAIN DONATION ===");
      console.log("Chain:", selectedAssetInfo?.chain);
      console.log("Currency:", selectedAsset);
      console.log("USD Amount:", usdAmount);
      console.log("Platform fee:", givethUsdAmount);
      console.log("Total USD:", totalUsdAmount);
      console.log("Crypto Amount:", cryptoAmount, selectedAsset);

      // Check balance based on chain
      if (isEVMChain) {
        if (evmBalance && cryptoAmount > parseFloat(evmBalance)) {
          toast.error(`Insufficient ${selectedAsset} balance`);
          setIsProcessing(false);
          return;
        }

        // Send EVM transaction
        const recipientAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f1E7B5"; // Demo address
        toast.loading(`Sending ${cryptoAmount.toFixed(6)} ${selectedAsset}...`, { id: 'evm-tx' });
        
        const txHash = await sendEVMTransaction(recipientAddress, cryptoAmount.toString());
        toast.dismiss('evm-tx');
        
        if (txHash) {
          toast.success(`Donation successful! TX: ${txHash.slice(0, 10)}...`);
          setTransactionDetails({
            hash: txHash,
            amount: cryptoAmount,
            currency: selectedAsset,
            usdValue: totalUsdAmount,
            chain: selectedAssetInfo?.chain,
          });
          setShowTransactionModal(true);
        }
        setIsProcessing(false);
        return;
      }

      // Original Stellar logic
      const xlmAmount = xlmPrice ? totalUsdAmount / xlmPrice : totalUsdAmount;

      if (balance && xlmAmount > parseFloat(balance.xlm)) {
        toast.error("Insufficient XLM balance");
        setIsProcessing(false);
        return;
      }

      // Sanitize memo
      let memoText = sanitizeString(memo.trim());
      if (!memoText) {
        memoText = isAnonymous ? "Anonymous" : `Donate ${project.id || ''}`;
      }
      memoText = memoText.slice(0, 20);

      // Try to donate through escrow contract first
      let escrowResult = null;
      try {
        toast.loading("Sending to escrow...", { id: 'escrow' });
        escrowResult = await ContractService.donate(
          project.id || 1,
          xlmAmount,
          publicKey
        );
        toast.dismiss('escrow');
      } catch (escrowError) {
        console.log('Escrow contract skipped (testnet mode):', escrowError.message);
        toast.dismiss('escrow');
        // Fall back to direct payment for demo
      }

      // FIXED: Send to project creator's Stellar address, not donor's address
      let destinationAddress = project.creator?.stellarAddress || project.stellarAddress;

      // Validate Stellar address format (must be 56 characters starting with G)
      const isValidStellarAddress = (address) => {
        return address && 
               address.startsWith('G') && 
               address.length === 56 && 
               /^G[A-Z2-7]{55}$/.test(address);
      };

      // For testnet demo: if project address is invalid or unfunded, 
      // we'll send a small amount to self and simulate the donation
      const isDemoMode = network === "TESTNET";
      let usingDemoMode = false;

      if (!isValidStellarAddress(destinationAddress)) {
        console.warn(`Invalid project address: ${destinationAddress}`);
        if (isDemoMode) {
          // For testnet demo, send to self (will succeed) and simulate donation to project
          destinationAddress = publicKey;
          usingDemoMode = true;
          toast("Demo mode: Simulating donation to project", { icon: 'ℹ️' });
        } else {
          toast.error("This project doesn't have a valid Stellar address configured. Please contact the project creator.");
          return;
        }
      }

      console.log(`Sending ${xlmAmount} XLM to: ${destinationAddress}${usingDemoMode ? ' (demo mode)' : ''}`);

      // Execute the payment transaction
      let transactionResult;
      try {
        transactionResult = await sendPayment({
          destination: destinationAddress,
          amount: xlmAmount.toFixed(7),
          asset: "native",
          memo: memoText,
        });
      } catch (paymentError) {
        // If payment fails due to destination not existing, retry with self in demo mode
        if (isDemoMode && paymentError.message?.includes('destination')) {
          console.warn('Destination account not funded, using demo mode');
          destinationAddress = publicKey;
          usingDemoMode = true;
          toast("Demo mode: Project address not funded, simulating donation", { icon: 'ℹ️' });
          
          transactionResult = await sendPayment({
            destination: destinationAddress,
            amount: xlmAmount.toFixed(7),
            asset: "native",
            memo: memoText,
          });
        } else {
          throw paymentError;
        }
      }

      console.log("Payment successful:", transactionResult);

      // Set transaction details for modal
      setTransactionDetails({
        hash: escrowResult?.hash || transactionResult?.hash || 'pending',
        ledger: transactionResult?.ledger,
        testnet: network === "TESTNET",
        escrow: !!escrowResult
      });

      // Show the transaction details modal
      setShowTransactionModal(true);

      // Set up reward data
      setRewardData({
        projectId: project.id,
        amount: xlmAmount,
      });

      // Show the reward modal
      setModalOpen(true);

      toast.success("Donation successful! Thank you for your support!");
    } catch (error) {
      console.error("Donation error:", error);
      toast.error(error.message || "Failed to process donation");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = donationAmount
    ? (parseFloat(donationAmount) * (1 + givethDonation / 100)).toFixed(2)
    : "0.00";

  const totalXlmAmount =
    xlmPrice && donationAmount
      ? (
          (parseFloat(donationAmount) * (1 + givethDonation / 100)) /
          xlmPrice
        ).toFixed(4)
      : "0.0000";

  const balanceInUsd =
    balance && xlmPrice
      ? (parseFloat(balance.xlm) * xlmPrice).toFixed(2)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>

            <h1
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.02em",
                lineHeight: "1.1",
              }}
              className="text-white mb-4 tracking-tight"
            >
              SUPPORT{" "}
              <span style={{ fontWeight: "400" }}>
                {project.title.toUpperCase()}
              </span>
            </h1>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "1rem",
                letterSpacing: "0.02em",
              }}
              className="text-gray-400"
            >
              Your donation helps make a real difference
            </p>
            
            {/* Testing Warning Banner */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 text-yellow-400 text-sm">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">TESTING MODE: Donation will be sent to your own wallet</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 lg:grid-cols-3 gap-8">
            <div className="xl:col-span-3 lg:col-span-2 space-y-6">
              {/* Multi-Chain Wallet Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Connections
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stellar Wallet */}
                  <div className={`p-4 rounded-xl border-2 ${isConnected ? 'border-green-500/50 bg-green-500/10' : 'border-dark-700'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Stellar (XLM)
                      </span>
                      {isConnected ? (
                        <span className="text-xs text-green-400">Connected</span>
                      ) : (
                        <span className="text-xs text-gray-500">Not connected</span>
                      )}
                    </div>
                    {isConnected ? (
                      <div>
                        <p className="text-xs text-gray-400 truncate">{formatAddress(publicKey)}</p>
                        <p className="text-sm text-white font-semibold mt-1">
                          {balance ? `${parseFloat(balance.xlm).toFixed(2)} XLM` : '...'}
                        </p>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={connectWallet}
                        className="w-full mt-2 py-2 px-3 bg-black border border-white/30 rounded-lg text-white text-sm hover:bg-white/10"
                      >
                        Connect Freighter
                      </motion.button>
                    )}
                  </div>

                  {/* EVM Wallet (MetaMask) */}
                  <div className={`p-4 rounded-xl border-2 ${evmConnected ? 'border-purple-500/50 bg-purple-500/10' : 'border-dark-700'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        <Layers className="w-4 h-4" /> EVM (ETH/MATIC)
                      </span>
                      {evmConnected ? (
                        <span className="text-xs text-purple-400">Connected</span>
                      ) : (
                        <span className="text-xs text-gray-500">Not connected</span>
                      )}
                    </div>
                    {evmConnected ? (
                      <div>
                        <p className="text-xs text-gray-400 truncate">{evmShortAddress}</p>
                        <p className="text-sm text-white font-semibold mt-1">
                          {evmBalance ? `${parseFloat(evmBalance).toFixed(4)} ${getNativeCurrency()}` : '...'}
                        </p>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={connectEVM}
                        className="w-full mt-2 py-2 px-3 bg-purple-600 border border-purple-500/30 rounded-lg text-white text-sm hover:bg-purple-700"
                      >
                        Connect MetaMask
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Show warning if selected chain wallet not connected */}
                {isEVMChain && !evmConnected && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Connect MetaMask to donate with {selectedAsset}
                    </p>
                  </div>
                )}
                {!isEVMChain && !isConnected && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Connect Freighter wallet to donate with {selectedAsset}
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Select Blockchain & Asset
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {assets.map((asset) => (
                    <motion.button
                      key={asset.code}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAsset(asset.code)}
                      className={`p-4 rounded-xl border-2 transition-all relative ${
                        selectedAsset === asset.code
                          ? "border-gray-500 bg-gray-500/10"
                          : "border-dark-700 hover:border-gray-500/50"
                      }`}
                      style={selectedAsset === asset.code ? { borderColor: asset.color } : {}}
                    >
                      {/* Chain indicator badge */}
                      <div className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-dark-800 border border-dark-600 text-gray-400">
                        {asset.chain === 'stellar' ? '⭐' : asset.chain === 'ethereum' ? '💎' : '🔷'}
                      </div>
                      <asset.icon className="w-8 h-8 mx-auto mb-2" style={{ color: asset.color }} />
                      <div className="font-semibold text-white text-sm">
                        {asset.code}
                      </div>
                      <div className="text-xs text-gray-400">{asset.name}</div>
                    </motion.button>
                  ))}
                </div>
                
                {/* Show estimated crypto amount */}
                {donationAmount && parseFloat(donationAmount) > 0 && (
                  <div className="mt-4 p-3 bg-dark-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">
                      ${donationAmount} USD ≈{" "}
                      <span className="text-white font-semibold">
                        {getCryptoAmount(parseFloat(donationAmount)).toFixed(selectedAsset === 'ETH' ? 6 : 2)} {selectedAsset}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Rate: 1 {selectedAsset} = ${getCurrentPrice().toFixed(2)} USD
                    </p>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Donation Amount
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {quickAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`py-3 rounded-xl border-2 font-semibold transition-all ${
                        donationAmount === amount.toString()
                          ? "border-gray-500 bg-gray-500/10 text-white"
                          : "border-dark-700 text-gray-400 hover:border-gray-500/50"
                      }`}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="input pl-10 text-2xl font-bold"
                    min="0"
                    step="0.01"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card space-y-4"
              >
                <h3 className="text-lg font-semibold text-white">
                  Additional Options
                </h3>

                <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">
                      Recurring Donation
                    </div>
                    <div className="text-sm text-gray-400">
                      Make this a monthly donation
                    </div>
                  </div>
                  <button
                    onClick={() => setIsRecurring(!isRecurring)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      isRecurring ? "bg-gray-600" : "bg-dark-700"
                    }`}
                  >
                    <motion.div
                      animate={{ x: isRecurring ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-white mb-1">
                      Anonymous Donation
                    </div>
                    <div className="text-sm text-gray-400">
                      Hide your identity from the public
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      isAnonymous ? "bg-gray-600" : "bg-dark-700"
                    }`}
                  >
                    <motion.div
                      animate={{ x: isAnonymous ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full"
                    />
                  </button>
                </div>

                <div className="p-4 bg-dark-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-white">
                      Support Stellar Giveth
                    </div>
                    <span className="text-white font-semibold">
                      {givethDonation}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="5"
                    value={givethDonation}
                    onChange={(e) =>
                      setGivethDonation(parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400 mt-2">
                    Add {givethDonation}% to support platform operations
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message (Optional - Max 20 chars)
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Add a message"
                    className="input"
                    maxLength="20"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {memo.length}/20 characters (kept short for safety)
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="xl:col-span-2 lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card sticky top-24"
              >
                <h3 className="text-xl font-semibold mb-6 text-white">
                  Donation Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Project Donation</span>
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        ${donationAmount || "0.00"}
                      </div>
                      {xlmPrice && donationAmount && (
                        <div className="text-xs text-gray-500">
                          ≈ {(parseFloat(donationAmount) / xlmPrice).toFixed(4)}{" "}
                          XLM
                        </div>
                      )}
                    </div>
                  </div>

                  {givethDonation > 0 && (
                    <div className="flex justify-between text-gray-400">
                      <span>Platform Support ({givethDonation}%)</span>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          $
                          {donationAmount
                            ? (
                                (parseFloat(donationAmount) * givethDonation) /
                                100
                              ).toFixed(2)
                            : "0.00"}
                        </div>
                        {xlmPrice && donationAmount && (
                          <div className="text-xs text-gray-500">
                            ≈{" "}
                            {(
                              (parseFloat(donationAmount) * givethDonation) /
                              100 /
                              xlmPrice
                            ).toFixed(4)}{" "}
                            XLM
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-dark-700">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-white">
                        Total
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">
                          ${totalAmount}
                        </div>
                        {xlmPrice && (
                          <div className="text-sm text-gray-400 mt-1">
                            ≈ {totalXlmAmount} XLM
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {xlmPrice && (
                    <div className="pt-4 border-t border-dark-700/50">
                      <div className="text-xs text-gray-500 text-center">
                        Current XLM Price: ${xlmPrice.toFixed(4)} USD
                      </div>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDonate}
                  disabled={!isConnected || isProcessing || !donationAmount}
                  className="btn-primary w-full mb-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Complete Donation</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                <div className="flex items-start space-x-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <Lock className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <span className="text-white font-semibold">
                      Secure & Transparent:
                    </span>{" "}
                    All transactions are processed on the Stellar blockchain
                  </div>
                </div>

                {/* AI Donation Advisor */}
                <div className="mt-6">
                  <AIHelper
                    context="DONATION_ADVISOR"
                    title="Donation Guide"
                    placeholder="Ask about donating..."
                    compact={true}
                    suggestions={[
                      "Is this project safe to donate?",
                      "How do milestones work?",
                      "What rewards do I get?",
                    ]}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* TokenRewardModal integration */}
      <TokenRewardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rewardData={rewardData}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        transaction={transactionDetails}
      />
    </motion.div>
  );
};

export default Donate;
