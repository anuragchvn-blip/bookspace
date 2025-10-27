# Quick Start Guide

Get BookSpace up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MetaMask wallet with Mumbai testnet configured
- Phantom wallet (for Solana features)

## Installation

### 1. Clone and Install

```powershell
git clone <your-repo-url> bookspace
cd bookspace
npm install
```

### 2. Quick Setup

Run the interactive setup script:

```powershell
npm run setup
```

Or manually create `.env`:

```powershell
cp .env.example .env
```

Edit `.env` and add your Pinata API keys.

### 3. Get Testnet Tokens

**Polygon Mumbai MATIC:**
- Visit: https://faucet.polygon.technology/
- Enter your wallet address
- Receive 0.5 MATIC

**Solana Devnet SOL:**
- Visit: https://faucet.solana.com/
- Or use: `solana airdrop 2 <YOUR_ADDRESS>`

### 4. Deploy Contracts

```powershell
# Compile
npm run compile

# Deploy to Polygon Mumbai
npm run deploy:polygon
```

Copy the deployed addresses to your `.env` file.

### 5. Run the App

```powershell
npm run dev
```

Open http://localhost:3000 🎉

## First Steps

1. **Connect Wallets** - Click "Connect Wallet" and connect both MetaMask and Phantom
2. **Create a Space** - Go to Create → Space
3. **Add a Bookmark** - Go to Create → Bookmark
4. **Send a Tip** - Use the Tip button on any bookmark (Solana)
5. **Test DM** - Navigate to Messages and unlock DM with another address

## Troubleshooting

**Can't connect wallet?**
- Refresh page
- Clear browser cache
- Make sure you're on Mumbai testnet

**Transaction fails?**
- Check you have enough MATIC
- Increase gas limit
- Wait and retry

**Need help?**
- Read SETUP.md for detailed instructions
- Check README.md for full documentation
- Join our Discord community

## What's Next?

- Customize the UI (edit Tailwind classes)
- Add more features
- Deploy to production (Vercel + Polygon Mainnet)
- Share with the community!

---

**Built something cool? Share it with us! 🚀**
