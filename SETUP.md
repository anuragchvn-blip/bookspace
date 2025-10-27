# BookSpace - Complete Setup Guide

This guide will walk you through setting up the BookSpace decentralized bookmarking platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **MetaMask Browser Extension** - [Install](https://metamask.io/)
4. **Phantom Wallet** - [Install](https://phantom.app/)
5. **Code Editor** - VS Code recommended

## 🔧 Step 1: Initial Setup

### 1.1 Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Wagmi, RainbowKit (Polygon/Ethereum)
- Solana Web3.js, Wallet Adapter
- Hardhat (Smart contract development)
- And many more...

### 1.2 Verify Installation

```powershell
npm run build
```

If successful, you should see a `.next` folder created.

## 🌐 Step 2: Get Testnet Tokens

### 2.1 Polygon Mumbai Testnet MATIC

1. Add Mumbai network to MetaMask:
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Currency: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com`

2. Get free MATIC:
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Enter your wallet address
   - Complete CAPTCHA
   - Receive 0.5 MATIC

### 2.2 Solana Devnet SOL

1. Install Phantom wallet and switch to Devnet:
   - Open Phantom → Settings → Developer Settings
   - Change Network to `Devnet`

2. Get free SOL:
   - Visit [Solana Faucet](https://faucet.solana.com/)
   - Or run: `solana airdrop 2 <YOUR_WALLET_ADDRESS>`

## 🔑 Step 3: Get API Keys

### 3.1 Pinata (IPFS)

1. Sign up at [Pinata.cloud](https://pinata.cloud/)
2. Navigate to API Keys
3. Create new key with:
   - Name: `BookSpace`
   - Admin privileges
4. Save:
   - API Key
   - API Secret
   - JWT Token

### 3.2 WalletConnect (Optional but Recommended)

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID

## ⚙️ Step 4: Configure Environment

### 4.1 Create Environment File

```powershell
cp .env.example .env
```

### 4.2 Edit `.env` File

Open `.env` in your editor and fill in:

```env
# Polygon Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_POLYGON_CHAIN_ID=80001

# Contract Addresses (Leave empty for now - will fill after deployment)
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=

# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_TIP_PROGRAM_ID=

# Pinata/IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Deployment (Get from MetaMask -> Account Details -> Export Private Key)
# ⚠️ NEVER COMMIT THIS FILE TO GIT ⚠️
PRIVATE_KEY=your_private_key_without_0x_prefix
```

## 📝 Step 5: Deploy Smart Contracts

### 5.1 Compile Contracts

```powershell
npm run compile
```

You should see:
```
Compiled 2 Solidity files successfully
```

### 5.2 Deploy to Polygon Mumbai

```powershell
npm run deploy:polygon
```

Expected output:
```
Deploying contracts with account: 0x...
Account balance: 500000000000000000

1. Deploying BookmarkRegistry...
BookmarkRegistry deployed to: 0xABC123...

2. Deploying DirectMessageRegistry...
DirectMessageRegistry deployed to: 0xDEF456...

✅ Deployment completed!
```

### 5.3 Update Environment Variables

Copy the deployed addresses to your `.env`:

```env
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=0xABC123...
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=0xDEF456...
```

### 5.4 Verify Contracts (Optional)

```powershell
npx hardhat verify --network mumbai <BOOKMARK_REGISTRY_ADDRESS>
npx hardhat verify --network mumbai <DM_REGISTRY_ADDRESS>
```

## 🚀 Step 6: Run the Application

### 6.1 Start Development Server

```powershell
npm run dev
```

### 6.2 Open in Browser

Visit [http://localhost:3000](http://localhost:3000)

You should see the BookSpace homepage!

## 🎮 Step 7: Test the Application

### 7.1 Connect Wallets

1. Click "Connect Wallet" in the header
2. Connect MetaMask (Polygon)
3. Connect Phantom (Solana)

### 7.2 Create Your First Space

1. Click "Get Started" or navigate to `/create?type=space`
2. Fill in:
   - Space Name: "My First Space"
   - Description: "Testing BookSpace"
   - Access Type: Public (Free)
3. Click "Create Space"
4. Approve transaction in MetaMask
5. Wait for confirmation

### 7.3 Add a Bookmark

1. Navigate to `/create?type=bookmark`
2. Fill in:
   - URL: `https://ethereum.org`
   - Title: "Ethereum Documentation"
   - Description: "Official Ethereum docs"
   - Tags: `ethereum, docs, web3`
   - Space: Select your space
3. Click "Create Bookmark"
4. Approve transaction in MetaMask

### 7.4 Test Direct Messaging

1. Go to `/messages` (if implemented in your routes)
2. Enter another wallet address
3. Click "Unlock DM Access" (costs 1 POL)
4. Approve payment
5. Send encrypted messages

### 7.5 Send a Tip

1. Find a bookmark or user profile
2. Click "Tip SOL"
3. Enter amount (e.g., 0.01 SOL)
4. Add message (optional)
5. Approve in Phantom wallet

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors

**Solution:**
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### Issue: Transaction fails on Polygon

**Causes:**
1. Insufficient MATIC balance
2. Gas price too low
3. Network congestion

**Solution:**
- Get more MATIC from faucet
- Increase gas limit in MetaMask
- Wait and retry

### Issue: Wallet won't connect

**Solution:**
1. Refresh the page
2. Clear browser cache
3. Disconnect wallet from site and reconnect
4. Try different browser

### Issue: IPFS upload fails

**Solution:**
1. Check Pinata API keys in `.env`
2. Verify JWT token is valid
3. Check file size limits
4. Review Pinata dashboard for errors

## 🔒 Security Best Practices

### ⚠️ NEVER commit these to Git:
- `.env` file
- Private keys
- API secrets
- Wallet seed phrases

### ✅ Always:
- Use `.env.example` for templates
- Keep `.env` in `.gitignore`
- Use environment variables in production
- Test on testnets first

## 📊 Monitoring Your Deployment

### View Transactions

**Polygon Mumbai:**
- Visit: `https://mumbai.polygonscan.com/address/<YOUR_CONTRACT_ADDRESS>`
- See all transactions, events, and contract calls

**Solana Devnet:**
- Visit: `https://explorer.solana.com/?cluster=devnet`
- Search for your wallet address

### Check IPFS Uploads

- Visit Pinata dashboard: `https://app.pinata.cloud/`
- View all pinned files and usage

## 🎯 Next Steps

1. **Customize Design**: Edit Tailwind classes in components
2. **Add Features**: Implement search, filtering, analytics
3. **Deploy to Production**:
   - Frontend: Vercel or Netlify
   - Contracts: Polygon Mainnet
4. **Domain Name**: Point custom domain to deployment
5. **Marketing**: Share on Twitter, Discord, Reddit

## 📚 Additional Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [Solana Documentation](https://docs.solana.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages carefully
3. Search existing GitHub issues
4. Join our Discord community
5. Create a new GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots

## 🎉 Success!

If you've made it this far, congratulations! You now have a fully functional decentralized bookmarking platform running locally.

**What you've accomplished:**
- ✅ Set up a Next.js + TypeScript project
- ✅ Deployed smart contracts to Polygon Mumbai
- ✅ Integrated Solana for micropayments
- ✅ Connected IPFS for decentralized storage
- ✅ Created a multi-chain Web3 application

**Ready to ship to production?** Check out the deployment guide in the main README!

---

**Happy Building! 🚀**
