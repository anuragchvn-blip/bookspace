# 🚀 POLYGON MAINNET DEPLOYMENT GUIDE

## ⚠️ IMPORTANT: You're now on MAINNET!

Your BookSpace app is configured for **Polygon Mainnet (Chain ID: 137)**. This means:
- ✅ Real MATIC tokens required
- ✅ All transactions are permanent
- ✅ Gas fees are real costs
- ✅ Smart contracts must be deployed to Mainnet

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. **Deploy Smart Contracts to Polygon Mainnet**

You mentioned contracts are already deployed. Make sure you have:
- ✅ BookmarkRegistry contract address on Polygon Mainnet
- ✅ DirectMessageRegistry contract address on Polygon Mainnet

**Update your `.env.local` file:**
```env
# Polygon Mainnet Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_CHAIN_ID=137

# Your Deployed Contract Addresses on Polygon Mainnet
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=0xYourActualMainnetAddress1
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=0xYourActualMainnetAddress2

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Pinata (IPFS)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# Solana (optional - for tips)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## 🔧 DEPLOYMENT STEPS

### Step 1: Deploy Contracts to Polygon Mainnet

If you haven't deployed yet, use Hardhat:

```powershell
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Update hardhat.config.js with Mainnet settings
```

**hardhat.config.js:**
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY], // Add your deployer wallet private key
      chainId: 137
    }
  }
};
```

**Deploy:**
```powershell
npx hardhat run scripts/deploy-polygon.ts --network polygon
```

**Save the contract addresses!**

---

### Step 2: Update Environment Variables

Create `.env.local` file:
```env
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=0xYourDeployedAddress1
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=0xYourDeployedAddress2
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=get_from_walletconnect.com
NEXT_PUBLIC_PINATA_JWT=get_from_pinata.cloud
```

---

### Step 3: Test Locally

```powershell
npm run dev
```

**Test these scenarios:**
1. Connect MetaMask to Polygon Mainnet
2. Make sure you have some MATIC in your wallet
3. Try creating a space (will cost gas!)
4. Try creating a bookmark (will cost gas!)
5. Verify on Polygonscan.com

---

## 💰 GAS COSTS ON MAINNET

**Expected costs:**
- Create Space: ~0.001 - 0.005 MATIC ($0.0007 - $0.0035)
- Create Bookmark: ~0.0008 - 0.003 MATIC ($0.0006 - $0.002)
- Join Space: ~0.0005 - 0.002 MATIC + space price
- Unlock DM: 1 MATIC + gas (~1.001 MATIC total)

**Tip:** Start with small amounts and test thoroughly!

---

## 🔍 VERIFYING CONTRACTS

After deployment, verify on Polygonscan:

```powershell
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```powershell
# BookmarkRegistry
npx hardhat verify --network polygon 0xYourAddress

# DirectMessageRegistry  
npx hardhat verify --network polygon 0xYourAddress <PLATFORM_OWNER_ADDRESS>
```

---

## 🧪 TESTING REAL-TIME FUNCTIONALITY

### Test Create Space:
1. Open http://localhost:3000/create?type=space
2. Connect wallet (Polygon Mainnet)
3. Fill form:
   - Name: "Test Space"
   - Description: "Testing mainnet"
   - Public: Yes
   - Price: 0 (for free space)
4. Click "Create Space"
5. Approve MetaMask transaction
6. Wait for confirmation
7. Check Polygonscan: https://polygonscan.com/tx/YOUR_TX_HASH

### Test Create Bookmark:
1. Go to http://localhost:3000/create?type=bookmark
2. Fill form:
   - URL: https://example.com
   - Title: "Test Bookmark"
   - Description: "Testing"
   - Tags: test, mainnet
   - Space ID: 1
3. Click "Create Bookmark"
4. Approve transaction
5. Verify on Polygonscan

---

## 🚨 TROUBLESHOOTING

### Issue: "Network mismatch"
**Solution:** Switch MetaMask to Polygon Mainnet (Chain ID: 137)

### Issue: "Contract not deployed"
**Solution:** Check contract addresses in `.env.local` are correct

### Issue: "Insufficient funds"
**Solution:** You need MATIC on Polygon Mainnet. Bridge from Ethereum or buy on exchange.

### Issue: "Transaction failed"
**Solution:** 
- Check gas settings in MetaMask
- Ensure contract has correct permissions
- Verify contract is deployed correctly

### Issue: "Can't read from contract"
**Solution:**
- Verify CONTRACT_ADDRESSES in `src/config/constants.ts`
- Check RPC URL is working: https://polygon-rpc.com
- Ensure you're connected to Polygon Mainnet (137)

---

## 📊 MONITORING

### Check Transaction Status:
```
https://polygonscan.com/tx/<YOUR_TX_HASH>
```

### Check Contract:
```
https://polygonscan.com/address/<YOUR_CONTRACT_ADDRESS>
```

### View Your Spaces/Bookmarks:
```
https://polygonscan.com/address/<YOUR_WALLET>#internaltx
```

---

## 🎯 REAL-TIME FEATURES ENABLED

Your app now uses:
- ✅ **Wagmi v2** - Real-time blockchain state
- ✅ **React Query** - Automatic refetching
- ✅ **WebSocket** - Live transaction updates
- ✅ **Optimistic Updates** - Instant UI feedback

**How it works:**
1. User submits transaction → Loading state
2. Transaction sent to Polygon → Pending
3. Transaction confirmed → UI auto-updates
4. Data refetched from contract → Fresh state

---

## 💡 BEST PRACTICES

1. **Always test on testnet first** (too late now, but for future updates)
2. **Start with small transactions** to verify everything works
3. **Monitor gas prices** - use https://polygonscan.com/gastracker
4. **Keep backups** of contract addresses and deployment info
5. **Use Polygonscan** to verify all transactions
6. **Enable transaction confirmations** in MetaMask

---

## 🔐 SECURITY REMINDERS

- ✅ Never share your private keys
- ✅ Double-check contract addresses before transactions
- ✅ Start with test amounts
- ✅ Verify transactions on Polygonscan
- ✅ Keep your `.env.local` file secure (in .gitignore)

---

## 📞 QUICK REFERENCE

**Polygon Mainnet:**
- Chain ID: `137`
- RPC: `https://polygon-rpc.com`
- Explorer: `https://polygonscan.com`
- Currency: `MATIC`

**Your Contracts:**
- BookmarkRegistry: `<ADD_YOUR_ADDRESS>`
- DirectMessageRegistry: `<ADD_YOUR_ADDRESS>`

---

## ✅ DEPLOYMENT COMPLETE!

You're now running on **Polygon Mainnet**! 

**Next Steps:**
1. ✅ Update `.env.local` with real contract addresses
2. ✅ Fund your wallet with MATIC
3. ✅ Test create space functionality
4. ✅ Test create bookmark functionality
5. ✅ Deploy to Vercel/production
6. ✅ Share with users!

**Need help?** Check the transaction hash on Polygonscan for errors.

🚀 **Happy Building!**
