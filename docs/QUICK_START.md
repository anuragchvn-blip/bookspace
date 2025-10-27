# Quick Start Guide - Backend Setup

## Prerequisites

- Node.js 18+ installed
- MetaMask wallet with Mumbai testnet configured
- Git installed

---

## Step 1: Install Dependencies

```powershell
npm install
```

This installs all required packages including:
- Next.js, React, TypeScript
- Wagmi, Viem (Ethereum/Polygon)
- Solana Web3.js
- Razorpay SDK
- Zod validation
- And 20+ other dependencies

---

## Step 2: Configure Environment

Your `.env.local` file is already created. Fill in the required values:

### 2.1 Deploy Smart Contracts

```powershell
# Compile contracts
npm run compile

# Deploy to Polygon Mumbai testnet
npm run deploy:polygon
```

Copy the addresses from the output:
```
✅ BookmarkRegistry deployed to: 0x1234...
✅ DirectMessageRegistry deployed to: 0x5678...
```

Add to `.env.local`:
```env
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=0x1234...
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=0x5678...
```

### 2.2 Get Pinata Credentials (Required)

1. Go to https://app.pinata.cloud/
2. Sign up for free account
3. Go to API Keys → Create Key
4. Copy the JWT token

Add to `.env.local`:
```env
NEXT_PUBLIC_PINATA_JWT=eyJhbGc...
```

### 2.3 Get Razorpay Credentials (Optional)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up (no KYC needed for test mode)
3. Go to Settings → API Keys → Generate Test Key

Add to `.env.local`:
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### 2.4 Export MetaMask Private Key

1. Open MetaMask
2. Click account menu → Account Details
3. Click "Export Private Key"
4. Enter password and copy

Add to `.env.local`:
```env
PRIVATE_KEY=0xabc123...
```

⚠️ **NEVER commit this file to git!**

### 2.5 Generate Internal API Key

Run in PowerShell:
```powershell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

Add to `.env.local`:
```env
INTERNAL_API_KEY=your-generated-key
```

---

## Step 3: Start Development Server

```powershell
npm run dev
```

Server starts at: http://localhost:3000

---

## Step 4: Verify Setup

### 4.1 Check Health Endpoint

Open: http://localhost:3000/api/health

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "blockchain": {
      "status": "connected",
      "blockNumber": 12345678
    },
    "environment": {
      "configured": {
        "polygon": {
          "rpcUrl": true,
          "bookmarkRegistry": true,
          "dmRegistry": true
        },
        "ipfs": {
          "pinataJwt": true
        }
      }
    }
  }
}
```

✅ If you see this, your backend is configured correctly!

### 4.2 Test Frontend

Open: http://localhost:3000

You should see:
- Landing page with "Connect Wallet" button
- No console errors
- Wallet connection prompt when clicking button

---

## Step 5: Fund Test Wallet

### Get Mumbai MATIC

1. Go to https://faucet.polygon.technology/
2. Select Mumbai network
3. Enter your wallet address
4. Click "Submit"
5. Wait 1-2 minutes

You should receive 0.5 MATIC for testing.

### Get Devnet SOL (Optional)

Run in terminal:
```powershell
solana airdrop 2 YOUR_SOLANA_ADDRESS --url devnet
```

Or use: https://faucet.solana.com/

---

## Step 6: Test Features

### 6.1 Create a Bookmark

1. Connect MetaMask wallet
2. Go to "Create" page
3. Fill in bookmark details
4. Click "Create Bookmark"
5. Confirm transaction in MetaMask

### 6.2 Test Razorpay Payment (Optional)

If configured, try:
1. Create a premium space
2. Set access price
3. Use PaymentSelector component
4. Select "Razorpay" payment method
5. Use test card: 4111 1111 1111 1111

---

## Common Issues & Solutions

### "Cannot find module 'next/server'"

Solution:
```powershell
npm install
```

Make sure all dependencies are installed.

---

### "Contract address not configured"

Solution:
1. Run `npm run deploy:polygon`
2. Copy addresses to `.env.local`
3. Restart dev server

---

### "Blockchain status: disconnected"

Solution:
1. Check `NEXT_PUBLIC_POLYGON_RPC_URL` in `.env.local`
2. Try alternative RPC:
   ```env
   NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/demo
   ```

---

### "Pinata upload failed"

Solution:
1. Verify `NEXT_PUBLIC_PINATA_JWT` is correct
2. Test authentication:
   ```powershell
   curl https://api.pinata.cloud/data/testAuthentication `
     -H "Authorization: Bearer YOUR_JWT"
   ```

---

### "Transaction failed"

Common reasons:
- Insufficient MATIC for gas
- Contract address wrong
- Network mismatch (ensure Mumbai testnet)

Solution:
1. Check wallet balance
2. Verify contract addresses in `.env.local`
3. Check MetaMask network

---

## Next Steps

### Explore the Codebase

**Smart Contracts:**
- `contracts/BookmarkRegistry.sol` - Main contract
- `contracts/DirectMessageRegistry.sol` - DM system

**Frontend:**
- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - User dashboard
- `src/app/create/page.tsx` - Create bookmark/space

**Backend API:**
- `src/app/api/health/route.ts` - Health check
- `src/app/api/razorpay/` - Payment processing
- `src/app/api/verify/` - Blockchain verification

**Hooks:**
- `src/hooks/useBookmarks.ts` - Bookmark operations
- `src/hooks/useSpaces.ts` - Space management
- `src/hooks/useDirectMessages.ts` - DM system
- `src/hooks/useRazorpay.ts` - Razorpay payments

**Components:**
- `src/components/PaymentSelector.tsx` - Multi-method payment
- `src/components/WalletConnect.tsx` - Wallet connection
- `src/components/BookmarkCard.tsx` - Display bookmark

### Read Documentation

- `docs/API.md` - Complete API reference
- `docs/ARCHITECTURE.md` - System architecture
- `docs/PAYMENT_INTEGRATION.md` - Payment guide
- `docs/ENV_SETUP.md` - Detailed env setup
- `docs/BACKEND_SUMMARY.md` - Backend overview

### Deploy to Production

When ready:
1. See `docs/ENV_SETUP.md` for production config
2. Deploy contracts to Polygon mainnet
3. Switch Razorpay to live mode
4. Deploy to Vercel
5. Configure domain and SSL

---

## Development Workflow

### Making Changes

1. **Edit code** in your IDE
2. **Save** - Hot reload updates automatically
3. **Test** in browser
4. **Check** for errors in terminal

### Before Committing

```powershell
# Check TypeScript errors
npm run build

# Run tests (if configured)
npm test

# Format code
npm run format
```

### Deploying Contracts

After changes to smart contracts:
```powershell
npm run compile
npm run deploy:polygon
# Update addresses in .env.local
```

---

## Useful Commands

```powershell
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Smart Contracts
npm run compile            # Compile contracts
npm run deploy:polygon     # Deploy to Mumbai
npm run verify             # Verify on Polygonscan

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode
npm run coverage           # Coverage report

# Code Quality
npm run lint               # Check linting
npm run format             # Format code
npm run type-check         # TypeScript check
```

---

## Getting Help

### Resources

- **GitHub Issues:** Report bugs or request features
- **Documentation:** Check `/docs` folder
- **API Reference:** `docs/API.md`
- **Architecture:** `docs/ARCHITECTURE.md`

### Debug Mode

Enable detailed logging:
```env
DEBUG=true
```

Check logs in:
- Browser console (F12)
- Terminal (server logs)
- Network tab (API requests)

---

## Success Checklist

After completing setup, you should have:

- ✅ All dependencies installed
- ✅ `.env.local` configured with all required values
- ✅ Smart contracts deployed to Mumbai
- ✅ Contract addresses in `.env.local`
- ✅ Pinata JWT configured
- ✅ Dev server running without errors
- ✅ `/api/health` endpoint returns "healthy"
- ✅ Test wallet funded with Mumbai MATIC
- ✅ Can connect MetaMask wallet
- ✅ Can create and view bookmarks

---

**Congratulations! Your BookSpace backend is ready for development!** 🎉

**Next:** Start building features or deploy to production.

---

**Last Updated:** 2024  
**Version:** 1.0.0
