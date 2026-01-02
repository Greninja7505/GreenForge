# Stellar Wallet Integration Guide

## 🌟 Overview

This platform integrates with **Stellar blockchain** using the **Freighter wallet** browser extension. Users can connect their Stellar wallets to create projects, make donations, and interact with the decentralized crowdfunding ecosystem.

---

## 📋 Table of Contents

1. [What is Stellar?](#what-is-stellar)
2. [What is Freighter Wallet?](#what-is-freighter-wallet)
3. [Installing Freighter](#installing-freighter)
4. [How Wallet Integration Works](#how-wallet-integration-works)
5. [Technical Implementation](#technical-implementation)
6. [User Workflows](#user-workflows)
7. [Troubleshooting](#troubleshooting)

---

## 🌐 What is Stellar?

**Stellar** is a decentralized, open-source blockchain network designed for fast and low-cost financial transactions.

### Key Features:

- **Fast Transactions**: 3-5 second confirmation times
- **Low Fees**: Minimal transaction costs (fractions of a cent)
- **Asset Issuance**: Create custom tokens and assets
- **Decentralized Exchange**: Built-in DEX for asset trading
- **Global Reach**: Cross-border payments and remittances

### Why Stellar for Crowdfunding?

- **Transparency**: All transactions recorded on blockchain
- **Low Overhead**: Minimal fees mean more funds go to projects
- **Global Access**: Anyone with internet can participate
- **Smart Contracts**: Automated fund distribution via Soroban
- **Instant Settlement**: No waiting for bank transfers

---

## 💼 What is Freighter Wallet?

**Freighter** is the most popular browser extension wallet for the Stellar network. It's like MetaMask for Ethereum, but for Stellar.

### Features:

- 🔐 **Secure**: Private keys stored locally, never shared
- 🌍 **Multi-network**: Supports mainnet, testnet, and custom networks
- 💰 **Asset Management**: Store XLM and custom Stellar assets
- 🔗 **dApp Integration**: Connect to decentralized applications
- 📱 **Easy to Use**: Simple interface for beginners

### Official Links:

- Website: [https://freighter.app](https://freighter.app)
- Chrome Extension: [Chrome Web Store](https://chrome.google.com/webstore)
- Firefox Add-on: [Firefox Add-ons](https://addons.mozilla.org)
- GitHub: [https://github.com/stellar/freighter](https://github.com/stellar/freighter)

---

## 🚀 Installing Freighter

### Step 1: Install Browser Extension

#### For Chrome/Brave/Edge:

1. Visit [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Freighter"
3. Click "Add to Chrome"
4. Confirm installation
5. Pin extension to toolbar (optional but recommended)

#### For Firefox:

1. Visit [Firefox Add-ons](https://addons.mozilla.org)
2. Search for "Freighter"
3. Click "Add to Firefox"
4. Confirm installation

### Step 2: Create or Import Wallet

#### Option A: Create New Wallet

1. Click Freighter extension icon
2. Select "Create new wallet"
3. **Write down your 12-word recovery phrase** (NEVER share this!)
4. Confirm recovery phrase
5. Set a password for the extension
6. Your wallet is ready! 🎉

#### Option B: Import Existing Wallet

1. Click Freighter extension icon
2. Select "Import wallet"
3. Enter your 12-word recovery phrase
4. Set a password
5. Wallet imported! ✅

### Step 3: Get Test XLM (For Testing)

If using **Testnet** (for development/testing):

1. Copy your Stellar address (starts with `G...`)
2. Visit [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
3. Paste your address
4. Click "Get test XLM"
5. You'll receive 10,000 test XLM (not real money!)

For **Mainnet** (real transactions):

- Purchase XLM on an exchange (Coinbase, Kraken, Binance, etc.)
- Withdraw to your Freighter wallet address

---

## 🔗 How Wallet Integration Works

### Connection Flow

```
User Visits Site
    ↓
Clicks "Connect Wallet" Button
    ↓
Freighter Extension Opens
    ↓
User Approves Connection
    ↓
Wallet Address Retrieved
    ↓
User Profile Created/Loaded
    ↓
User Can Now:
  • Create Projects
  • Make Donations
  • Upvote/Downvote
  • View Profile
```

### What Happens When You Connect?

1. **Detection**: Platform checks if Freighter is installed
2. **Request**: Platform requests wallet public key
3. **User Approval**: You approve in Freighter popup
4. **Address Retrieved**: Platform receives your Stellar address (G...)
5. **Profile Check**: Platform checks if you have a profile
6. **Profile Setup**: If first time, you choose anonymous or create profile
7. **Ready**: You can now interact with the platform

### What Information is Shared?

✅ **Shared with Platform:**

- Public Stellar address (e.g., `GXXXXXXXXXXXXXXXXXXXXXX`)
- Network type (testnet or mainnet)

❌ **NEVER Shared:**

- Private key (secret key)
- Recovery phrase
- Password
- Personal information (unless you create a profile)

---

## 🛠️ Technical Implementation

### Tech Stack

```javascript
// Dependencies
"stellar-sdk": "^11.3.0"        // Stellar blockchain SDK
"@stellar/freighter-api": "^2.0.0"  // Freighter wallet integration
```

### StellarContext Provider

Located at: `src/context/StellarContext.jsx`

This is the core of the wallet integration.

#### Key Functions:

```javascript
// Connect to Freighter wallet
connectWallet()
  → Opens Freighter
  → Gets user approval
  → Retrieves public key
  → Sets connected state

// Disconnect wallet
disconnectWallet()
  → Clears wallet state
  → Resets connection

// Make donation transaction
makeDonation(destinationAddress, amount)
  → Creates Stellar transaction
  → Sends to Freighter for signing
  → Submits to blockchain
  → Returns transaction hash
```

#### State Variables:

```javascript
{
  publicKey: "GXXXX...",        // User's Stellar address
  isConnected: false,           // Wallet connection status
  loading: false,               // Loading state
  network: "TESTNET",          // Current network
  error: null                   // Error messages
}
```

### Example: Connect Wallet Button

```jsx
import { useStellar } from "../context/StellarContext";

function ConnectButton() {
  const { connectWallet, isConnected, publicKey } = useStellar();

  return (
    <button onClick={connectWallet}>
      {isConnected
        ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
        : "Connect Wallet"}
    </button>
  );
}
```

### Example: Make Donation

```jsx
import { useStellar } from "../context/StellarContext";

function DonateButton({ projectAddress, amount }) {
  const { makeDonation, isConnected } = useStellar();

  const handleDonate = async () => {
    if (!isConnected) {
      alert("Please connect wallet first");
      return;
    }

    try {
      const txHash = await makeDonation(projectAddress, amount);
      console.log("Donation successful!", txHash);
      // Show success message
    } catch (error) {
      console.error("Donation failed:", error);
      // Show error message
    }
  };

  return <button onClick={handleDonate}>Donate {amount} XLM</button>;
}
```

---

## 👤 User Workflows

### Workflow 1: First-Time User

```
1. User visits platform (no wallet connected)
2. Clicks "Connect Wallet" in navbar
3. Freighter popup appears
4. User approves connection
5. Profile setup modal appears
6. User chooses:
   → "Create Profile" (name, email, bio)
   → "Continue Anonymous" (no personal info)
7. User can now browse and interact with projects
```

### Workflow 2: Create a Project

```
1. User clicks "Create Project"
2. Platform checks wallet connection
3. If not connected → prompts to connect
4. If connected → shows project form
5. User fills project details:
   - Title
   - Description
   - Category (DeFi, NFT, etc.)
   - Funding goal
   - Milestones
   - Wallet address (auto-filled)
6. User submits form
7. Project created and added to platform
8. User redirected to new project page
```

### Workflow 3: Make a Donation

```
1. User finds project to support
2. Clicks "Fund Now" button
3. Platform checks wallet connection
4. If not connected → prompts to connect
5. If connected → redirects to donation page
6. User enters donation amount (XLM)
7. Clicks "Donate" button
8. Freighter popup appears
9. User reviews transaction:
   - Destination address
   - Amount
   - Fee
10. User approves in Freighter
11. Transaction submitted to Stellar network
12. Confirmation shown (3-5 seconds)
13. Donation recorded in:
    - User's donation history
    - Project's donation list
    - Blockchain (permanent record)
```

### Workflow 4: Upvote a Project

```
1. User views project details
2. Clicks upvote (ChevronUp) button
3. Vote count updates immediately
4. Vote saved to localStorage
5. (Future: Could require wallet signature for on-chain voting)
```

---

## 🔐 Security & Privacy

### What's Secure?

✅ **Private Keys**: Never leave Freighter, never shared with website
✅ **Recovery Phrase**: Stored only in Freighter, encrypted
✅ **Transactions**: Require explicit user approval in Freighter
✅ **Profile Data**: Stored locally in browser (localStorage)
✅ **Anonymous Mode**: No personal info required to use platform

### Best Practices:

1. **Never Share Your Recovery Phrase**: Anyone with it can access your funds
2. **Verify Transaction Details**: Always check address and amount in Freighter popup
3. **Use Testnet for Testing**: Don't risk real funds during development
4. **Bookmark Official Sites**: Avoid phishing sites
5. **Keep Extension Updated**: Install updates from official sources only

### Common Security Questions:

**Q: Can the website access my private keys?**
A: **No!** Private keys never leave Freighter. The website only receives your public address.

**Q: Can someone steal my funds by connecting to this site?**
A: **No!** Connecting your wallet only shares your public address. All transactions require your explicit approval in Freighter.

**Q: What if I lose my recovery phrase?**
A: **Your funds are lost forever.** Write it down on paper and store it securely. Never store it digitally.

**Q: Is this platform custodial?**
A: **No!** This is a non-custodial platform. You always control your funds. We never hold your assets.

---

## 🧪 Testing on Testnet

### Why Use Testnet?

- **Free**: Test XLM has no real value
- **Safe**: Can't lose real money
- **Fast**: Test features without risk
- **Realistic**: Works exactly like mainnet

### How to Switch to Testnet in Freighter:

1. Open Freighter extension
2. Click settings (gear icon)
3. Select "Network"
4. Choose "Testnet"
5. Click "Save"

### Get Test XLM:

```
1. Copy your Stellar address from Freighter
2. Visit: https://laboratory.stellar.org/#account-creator?network=test
3. Paste your address
4. Click "Get test XLM"
5. Receive 10,000 test XLM (instant!)
```

### Test Transaction Flow:

```javascript
// Example: Send test XLM
const testDonation = async () => {
  const recipientAddress = "GXXXXXXXXXXXXXX"; // Project address
  const amount = "100"; // 100 test XLM

  try {
    const txHash = await makeDonation(recipientAddress, amount);
    console.log("Test donation successful:", txHash);

    // View on testnet explorer:
    // https://stellar.expert/explorer/testnet/tx/{txHash}
  } catch (error) {
    console.error("Test donation failed:", error);
  }
};
```

---

## 🌍 Stellar Network Details

### Network Information:

| Network     | Purpose                 | Native Asset    | Explorer                                                         |
| ----------- | ----------------------- | --------------- | ---------------------------------------------------------------- |
| **Mainnet** | Production (real money) | XLM (Lumens)    | [StellarExpert](https://stellar.expert/explorer/public)          |
| **Testnet** | Development & testing   | Test XLM (fake) | [StellarExpert Testnet](https://stellar.expert/explorer/testnet) |

### Transaction Details:

- **Confirmation Time**: 3-5 seconds
- **Base Fee**: 0.00001 XLM (100 stroops)
- **Minimum Balance**: 1 XLM (to keep account active)
- **Memo Support**: Yes (add messages to transactions)
- **Asset Support**: XLM + custom Stellar assets

### Stellar Address Format:

```
Public Key (Address):  GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                       ↑ Always starts with 'G'
                       ↑ 56 characters long
                       ↑ Alphanumeric

Secret Key:            SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
                       ↑ Always starts with 'S'
                       ↑ NEVER share this!
```

---

## 🔧 API Reference

### StellarContext Hook

```javascript
import { useStellar } from "../context/StellarContext";

const {
  // State
  publicKey, // string | null - User's Stellar address
  isConnected, // boolean - Wallet connection status
  loading, // boolean - Loading state
  network, // string - 'TESTNET' or 'MAINNET'
  error, // string | null - Error message

  // Functions
  connectWallet, // () => Promise<void> - Connect Freighter
  disconnectWallet, // () => void - Disconnect wallet
  makeDonation, // (destination, amount) => Promise<string> - Send XLM
} = useStellar();
```

### Function Details:

#### connectWallet()

```javascript
// Connect to Freighter wallet
const handleConnect = async () => {
  try {
    await connectWallet();
    console.log("Wallet connected!");
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
};
```

#### makeDonation(destination, amount)

```javascript
// Make a donation
const handleDonation = async () => {
  const projectAddress = "GXXXXX...";
  const donationAmount = "100"; // XLM

  try {
    const txHash = await makeDonation(projectAddress, donationAmount);
    console.log("Donation successful!");
    console.log("Transaction hash:", txHash);

    // View on explorer:
    // https://stellar.expert/explorer/public/tx/{txHash}
  } catch (error) {
    console.error("Donation failed:", error.message);
  }
};
```

#### disconnectWallet()

```javascript
// Disconnect wallet
const handleDisconnect = () => {
  disconnectWallet();
  console.log("Wallet disconnected");
};
```

---

## 📊 Transaction Examples

### Example 1: Basic Donation

```javascript
import { useStellar } from "../context/StellarContext";

function DonatePage() {
  const { makeDonation, isConnected, publicKey } = useStellar();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      // Project wallet address
      const projectAddress = "GBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

      // Make donation
      const txHash = await makeDonation(projectAddress, amount);

      // Success!
      alert(`Donation successful! TX: ${txHash}`);

      // Record donation in user profile
      // (handled automatically by UserContext)

      // Reset form
      setAmount("");
    } catch (error) {
      console.error("Donation error:", error);
      alert(`Donation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount in XLM"
        min="1"
        step="0.01"
      />

      <button type="submit" disabled={loading || !isConnected}>
        {loading ? "Processing..." : `Donate ${amount || "0"} XLM`}
      </button>

      {!isConnected && <p>Connect your wallet to make a donation</p>}
    </form>
  );
}
```

### Example 2: Check Transaction Status

```javascript
// After getting transaction hash, check status
const checkTransaction = async (txHash) => {
  const explorerUrl = `https://stellar.expert/explorer/public/tx/${txHash}`;

  console.log("View transaction:", explorerUrl);

  // You can also use Stellar SDK to get transaction details
  const server = new StellarSdk.Server("https://horizon.stellar.org");

  try {
    const transaction = await server.transactions().transaction(txHash).call();

    console.log("Transaction details:", transaction);
    console.log("Status:", transaction.successful ? "Success" : "Failed");
    console.log("Created at:", transaction.created_at);
    console.log("Fee charged:", transaction.fee_charged);
  } catch (error) {
    console.error("Error fetching transaction:", error);
  }
};
```

---

## ❓ Troubleshooting

### Common Issues

#### Issue 1: "Freighter not detected"

**Problem**: Browser extension not installed or not enabled

**Solutions**:

1. Install Freighter from official store
2. Enable the extension in browser settings
3. Refresh the page
4. Try a different browser

#### Issue 2: "User declined access"

**Problem**: User clicked "Cancel" in Freighter popup

**Solutions**:

1. Click "Connect Wallet" again
2. Approve the connection in Freighter
3. Make sure you trust the website before connecting

#### Issue 3: "Transaction failed"

**Problem**: Various reasons (insufficient balance, network issues, etc.)

**Solutions**:

1. Check your XLM balance (minimum 1 XLM + fees)
2. Ensure you're on the correct network (testnet vs mainnet)
3. Try a smaller amount
4. Wait a few seconds and try again
5. Check Stellar network status: [status.stellar.org](https://status.stellar.org)

#### Issue 4: "Network mismatch"

**Problem**: Freighter is on different network than expected

**Solutions**:

1. Open Freighter settings
2. Switch to correct network (testnet or mainnet)
3. Refresh the page

#### Issue 5: "Insufficient balance"

**Problem**: Not enough XLM to cover transaction + fees

**Solutions**:

1. Check balance in Freighter
2. For testnet: Get free test XLM from Friendbot
3. For mainnet: Purchase XLM on exchange
4. Reduce donation amount

### Debug Mode

Enable console logging for wallet operations:

```javascript
// In StellarContext.jsx, add console logs:

const connectWallet = async () => {
  console.log("🔗 Attempting to connect wallet...");

  try {
    const publicKey = await getPublicKey();
    console.log("✅ Connected! Address:", publicKey);

    setPublicKey(publicKey);
    setIsConnected(true);
  } catch (error) {
    console.error("❌ Connection failed:", error);
    setError(error.message);
  }
};
```

### Getting Help

**Freighter Support**:

- Discord: [Stellar Discord](https://discord.gg/stellar)
- GitHub Issues: [github.com/stellar/freighter/issues](https://github.com/stellar/freighter/issues)

**Stellar Network**:

- Documentation: [developers.stellar.org](https://developers.stellar.org)
- Community: [Stellar Stack Exchange](https://stellar.stackexchange.com)

**Platform Issues**:

- Check browser console for errors
- Verify network connection
- Try incognito/private browsing mode
- Clear browser cache and localStorage

---

## 📚 Additional Resources

### Official Documentation

- **Stellar Docs**: [developers.stellar.org](https://developers.stellar.org)
- **Freighter Docs**: [freighter.app/docs](https://freighter.app/docs)
- **Stellar SDK Docs**: [stellar.github.io/js-stellar-sdk](https://stellar.github.io/js-stellar-sdk)

### Tools & Explorers

- **Stellar Laboratory**: [laboratory.stellar.org](https://laboratory.stellar.org)

  - Build and test transactions
  - View account details
  - Test network operations

- **StellarExpert**: [stellar.expert](https://stellar.expert)

  - Block explorer
  - View transactions
  - Track assets

- **Stellar Account Viewer**: [accountviewer.stellar.org](https://accountviewer.stellar.org)
  - View account balances
  - Transaction history
  - Asset management

### Learning Resources

- **Stellar Quest**: [quest.stellar.org](https://quest.stellar.org)

  - Interactive tutorials
  - Learn by doing
  - Earn certificates

- **Stellar YouTube**: [youtube.com/@StellarOrg](https://youtube.com/@StellarOrg)
  - Video tutorials
  - Developer guides
  - Community updates

### Example Projects

- **Freighter API Examples**: [github.com/stellar/freighter/tree/main/examples](https://github.com/stellar/freighter/tree/main/examples)
- **Stellar Demos**: [github.com/stellar/stellar-demo-wallet](https://github.com/stellar/stellar-demo-wallet)

---

## 🎯 Quick Reference

### Essential Commands

```javascript
// Connect wallet
await connectWallet();

// Get user address
const address = publicKey;

// Make donation
const txHash = await makeDonation(destinationAddress, amount);

// Disconnect
disconnectWallet();

// Check connection status
if (isConnected) {
  // User is connected
}
```

### Network URLs

```javascript
// Horizon servers (Stellar API)
const MAINNET = "https://horizon.stellar.org";
const TESTNET = "https://horizon-testnet.stellar.org";

// Friendbot (get test XLM)
const FRIENDBOT = "https://friendbot.stellar.org";
```

### Useful Snippets

**Format Address for Display**:

```javascript
const formatAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Example: "GXXXX...XXXX"
```

**Convert XLM to Stroops**:

```javascript
// 1 XLM = 10,000,000 stroops
const xlmToStroops = (xlm) => (parseFloat(xlm) * 10000000).toString();
const stroopsToXlm = (stroops) => (parseInt(stroops) / 10000000).toString();
```

**Check Minimum Balance**:

```javascript
// Stellar accounts need minimum 1 XLM to stay active
const MIN_BALANCE = 1; // XLM

const hasMinimumBalance = (balance) => {
  return parseFloat(balance) >= MIN_BALANCE;
};
```

---

## ✅ Checklist for Developers

### Setup Checklist

- [ ] Install Freighter extension
- [ ] Create test wallet (or import existing)
- [ ] Get test XLM from Friendbot
- [ ] Install platform dependencies (`npm install`)
- [ ] Configure Stellar SDK in project
- [ ] Test wallet connection
- [ ] Test donation transaction
- [ ] Verify transaction on explorer

### Pre-Launch Checklist

- [ ] Test all wallet connection flows
- [ ] Verify transaction signing works
- [ ] Handle all error cases gracefully
- [ ] Add loading states for async operations
- [ ] Test on multiple browsers
- [ ] Test with different wallet states (locked, unlocked, not installed)
- [ ] Security audit of wallet integration
- [ ] User testing with real wallets
- [ ] Documentation complete
- [ ] Support resources ready

---

## 🎉 Conclusion

You now have a complete understanding of how Stellar wallet integration works in this platform!

**Key Takeaways**:

✅ **Freighter** is the bridge between users and Stellar blockchain
✅ **Security** is paramount - private keys never leave Freighter
✅ **Transactions** require explicit user approval
✅ **Testnet** is perfect for development and testing
✅ **Integration** is handled through StellarContext
✅ **User Experience** is smooth and familiar

**Next Steps**:

1. Install Freighter if you haven't already
2. Get test XLM from Friendbot
3. Test the platform workflows
4. Explore the code in `src/context/StellarContext.jsx`
5. Build something amazing! 🚀

---

**Questions?** Check the troubleshooting section or reach out to the Stellar community!

**Happy Building!** 🌟
