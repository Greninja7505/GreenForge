# Freighter Wallet Setup Guide

## Installation Steps

1. **Install Freighter Extension**

   - Chrome/Brave: [Chrome Web Store](https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk)
   - Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/freighter/)
   - Edge: Available on Chrome Web Store

2. **Setup Freighter**

   - Click the Freighter extension icon
   - Create a new wallet or import existing one
   - **Important**: Save your recovery phrase securely!
   - Set a strong password
   - Make sure your wallet is **unlocked**

3. **Get Test XLM (for Testnet)**
   - Copy your Stellar address from Freighter
   - Visit [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
   - Paste your address and click "Get test network lumens"
   - Wait a few seconds for the transaction to complete

## Connecting to Your DApp

1. Make sure Freighter extension is **installed** and **unlocked**
2. Click "Connect Wallet" button in the navigation bar
3. Freighter popup will appear asking for permission
4. Click "Approve" to grant access
5. Your wallet address will display in the navbar

## Troubleshooting

### "Freighter wallet not detected"

- ✅ Verify Freighter extension is installed
- ✅ Refresh the page after installing Freighter
- ✅ Try restarting your browser

### "Failed to connect wallet. Make sure Freighter is unlocked"

- ✅ Click the Freighter extension icon
- ✅ Enter your password to unlock the wallet
- ✅ Try connecting again

### "Connection request was declined"

- ✅ You clicked "Reject" in the Freighter popup
- ✅ Click "Connect Wallet" again and approve the request

### "Account not funded"

- ✅ Your Stellar account needs at least 1 XLM to be active
- ✅ For testnet: Use Friendbot (see step 3 above)
- ✅ For mainnet: Purchase XLM and send to your address

### Extension installed but not detected

- ✅ Make sure you're using a supported browser (Chrome, Firefox, Brave, Edge)
- ✅ Disable other Stellar wallet extensions (conflicts)
- ✅ Clear browser cache and reload
- ✅ Check browser console for errors (F12 → Console tab)

## Network Selection

- **TESTNET** (default): For testing with fake XLM
- **PUBLIC**: For real transactions with real XLM

You can switch networks in the app settings (future feature).

## Important Notes

⚠️ **NEVER share your recovery phrase or private keys with anyone!**

⚠️ **Always verify transaction details before approving in Freighter**

⚠️ **Start with TESTNET to learn the platform safely**

## Developer Console Logs

Open browser console (F12) to see connection status:

- "Freighter extension not detected" - Extension not installed
- "Wallet auto-connected: [address]" - Previously connected wallet restored
- "No existing connection found" - Need to manually connect

## Additional Resources

- [Freighter Documentation](https://docs.freighter.app/)
- [Stellar Documentation](https://developers.stellar.org/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Stellar Expert Explorer](https://stellar.expert/)
