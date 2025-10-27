# BookSpace - Decentralized Bookmarking & Learning Platform

![BookSpace](https://img.shields.io/badge/Web3-Polygon%20%2B%20Solana-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-MIT-green)

# BookSpace - Decentralized Bookmark Manager

A Web3 platform for creating and managing bookmark spaces on Polygon blockchain with IPFS storage.

**Status:** Live on Vercel 🚀

## 🌟 Features

### Core Functionality
- **📑 Blockchain Bookmarks**: Store bookmarks permanently on Polygon with IPFS integration for rich content
- **🗂️ Smart Spaces**: Create public or premium spaces to organize bookmarks
- **💰 Monetization**: Charge MATIC for access to premium spaces
- **💬 Paid Direct Messaging**: 1 POL payment unlocks unlimited DMs with another user (stored on-chain)
- **� User Profiles**: Custom usernames, bios, avatars (stored off-chain on IPFS - FREE to update!)
- **�🔍 Search & Filter**: Tag-based search and filtering system
- **📤 Export**: Export bookmarks as JSON/CSV

### Payment Options
- **Polygon (Primary)**: All smart contract interactions, DM unlock, space access - paid in MATIC
- **Solana (Alternative)**: Direct wallet-to-wallet payments for tips and optional features - paid in SOL
- **Razorpay (Fiat)**: UPI, Cards, Net Banking for users who prefer traditional payments - paid in INR

### Storage & Infrastructure
- **IPFS/Pinata**: Decentralized storage for rich content and encrypted messages
- **Polygon Mainnet**: Smart contracts deployment
- **Supabase** (Optional): Off-chain caching for better UX

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Wagmi** - Ethereum interactions
- **RainbowKit** - Wallet connection UI
- **Solana Wallet Adapter** - Solana wallet integration

### Blockchain
- **Polygon** - Primary blockchain for all features
  - BookmarkRegistry.sol - Bookmark and Space management
  - DirectMessageRegistry.sol - Paid DM system (1 POL unlock)
- **Solana** - Alternative payment method via RPC
  - Simple wallet-to-wallet transfers (no smart contracts)
  - Used for tips and optional features
- **Razorpay** - Fiat payment gateway
  - UPI, Credit/Debit Cards, Net Banking
  - Alternative to crypto payments
- **Solidity 0.8.20** - Smart contract language
- **Hardhat** - Ethereum development environment

### Storage
- **Pinata/IPFS** - Decentralized file storage
- **CryptoJS** - Message encryption

## 📁 Project Structure

```
bookspace/
├── contracts/                 # Solidity smart contracts
│   ├── BookmarkRegistry.sol  # Main bookmark & space contract
│   └── DirectMessageRegistry.sol # Paid DM system
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── page.tsx        # Homepage
│   │   ├── dashboard/      # User dashboard
│   │   ├── create/         # Create bookmark/space
│   │   ├── api/            # API routes
│   │   │   ├── razorpay/   # Razorpay payment APIs
│   │   │   └── metadata/   # URL metadata fetching
│   │   └── layout.tsx      # Root layout
│   ├── components/          # React components
│   │   ├── WalletConnect.tsx
│   │   ├── BookmarkCard.tsx
│   │   ├── SpaceCard.tsx
│   │   ├── TipButton.tsx
│   │   └── PaymentSelector.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useBookmarks.ts
│   │   ├── useDirectMessages.ts
│   │   ├── useSolanaTips.ts (Solana payments)
│   │   └── useRazorpay.ts (Fiat payments)
│   ├── lib/                # Utilities
│   │   ├── ipfs.ts        # IPFS upload/fetch
│   │   └── utils.ts       # Helper functions
│   ├── providers/          # Context providers
│   │   ├── PolygonProvider.tsx
│   │   └── SolanaProvider.tsx
│   ├── contracts/          # Contract ABIs
│   │   └── abis.ts
│   ├── config/             # Configuration
│   │   └── constants.ts
│   └── types/              # TypeScript types
│       └── index.ts
├── scripts/                # Deployment scripts
│   └── deploy-polygon.ts
├── hardhat.config.js       # Hardhat configuration
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask wallet
- Phantom/Solflare wallet (for Solana)
- Polygon Mumbai testnet MATIC ([faucet](https://faucet.polygon.technology/))
- Solana devnet SOL ([faucet](https://faucet.solana.com/))

### Installation

1. **Clone the repository**
```powershell
git clone https://github.com/yourusername/bookspace.git
cd bookspace
```

2. **Install dependencies**
```powershell
npm install
```

3. **Set up environment variables**
```powershell
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Polygon Configuration
NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_POLYGON_CHAIN_ID=80001

# Pinata/IPFS
NEXT_PUBLIC_PINATA_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_secret_key
NEXT_PUBLIC_PINATA_JWT=your_jwt_token
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Private key for deployment (NEVER COMMIT THIS)
PRIVATE_KEY=your_private_key_here
```

4. **Compile smart contracts**
```powershell
npm run compile
```

5. **Deploy to Polygon Mumbai**
```powershell
npm run deploy:polygon
```

Copy the deployed contract addresses to your `.env`:
```env
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=0x...
```

6. **Set up Razorpay** (Optional - for fiat payments)
   
   - Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
   - Get your API keys from Dashboard → Settings → API Keys
   - Add to `.env.local`:
   
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

7. **Run the development server**
```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## � Payment Methods Guide

### Method 1: Polygon (Primary - Recommended)
**Setup:**
1. Get Mumbai testnet MATIC from [Polygon Faucet](https://faucet.polygon.technology/)
2. Connect MetaMask wallet
3. Switch to Mumbai Testnet

**Use Cases:**
- Create bookmarks and spaces
- Join premium spaces
- Unlock DM access (1 POL)
- All smart contract interactions

**Costs:**
- Gas fees: ~0.001-0.01 MATIC per transaction
- Payments go directly to recipient's wallet
- No platform fees

---

### Method 2: Solana (Alternative)
**Setup:**
1. Get Devnet SOL from [Solana Faucet](https://faucet.solana.com/)
2. Connect Phantom or Solflare wallet
3. Use for optional features

**Use Cases:**
- Tipping creators
- Alternative payment for spaces (if owner accepts)
- Micro-transactions

**Costs:**
- Transaction fees: ~0.000005 SOL (negligible)
- Direct wallet-to-wallet transfers
- No smart contracts needed

---

### Method 3: Razorpay (Fiat Gateway)
**Setup:**
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Complete KYC verification
3. Enable payment methods (UPI, Cards, Net Banking)
4. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
5. Test with [test cards](https://razorpay.com/docs/payments/payments/test-card-details/)

**Use Cases:**
- Users without crypto wallets
- UPI payments (India)
- Credit/Debit cards
- Net Banking

**Costs:**
- 2% + ₹0 per transaction
- Chargebacks possible
- Settlement in 2-3 business days

---

### Payment Method Comparison

| Feature | Polygon | Solana | Razorpay |
|---------|---------|--------|----------|
| **Speed** | ~2 seconds | Instant | 2-5 seconds |
| **Transaction Cost** | 0.001-0.01 MATIC | 0.000005 SOL | 2% + ₹0 |
| **Reversible** | ❌ No | ❌ No | ✅ Yes (chargebacks) |
| **Requires Crypto** | ✅ Yes | ✅ Yes | ❌ No |
| **Smart Contracts** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Core features | Tips & micro-payments | Non-crypto users |
| **Network** | Mumbai Testnet | Devnet | Production Ready |
| **Payment Goes To** | Recipient wallet | Recipient wallet | Your Razorpay account |
| **Platform Fees** | 0% | 0% | 2% |

## �📝 Smart Contract Functions

### BookmarkRegistry

```solidity
// Bookmark Management
createBookmark(url, title, description, tags, spaceId, ipfsHash)
updateBookmark(bookmarkId, url, title, description, tags, ipfsHash)
deleteBookmark(bookmarkId)
getBookmark(bookmarkId) → Bookmark
getUserBookmarks(address) → uint256[]

// Space Management
createSpace(name, description, isPublic, accessPrice)
joinSpace(spaceId) payable
updateSpace(spaceId, name, description, isPublic, accessPrice)
getSpace(spaceId) → Space
getSpaceBookmarks(spaceId) → uint256[]
checkSpaceAccess(user, spaceId) → bool
```

### DirectMessageRegistry

```solidity
// DM Access (1 POL to unlock)
purchaseDMAccess(recipient) payable  // Costs 1 POL
checkDMAccess(sender, recipient) → bool
getDMAccess(sender, recipient) → DMAccess

// Messaging
sendMessage(recipient, ipfsHash) → messageId
getMessage(messageId) → Message
getInbox(user) → uint256[]
getConversation(user1, user2) → uint256[]
revokeDMAccess(recipient)
```

## 🎯 User Flow

### 1. Connect Wallets
- Connect MetaMask for Polygon (main features)
- Connect Phantom for Solana (tips/micropayments)

### 2. Create a Space
```typescript
const { createSpace } = useSpaces();

await createSpace(
  "Web3 Resources",
  "Curated Web3 learning materials",
  false,  // isPublic
  "5"     // 5 MATIC to join
);
```

### 3. Add Bookmarks
```typescript
const { createBookmark } = useBookmarks();

await createBookmark(
  "https://ethereum.org",
  "Ethereum.org",
  "Official Ethereum documentation",
  ["ethereum", "docs", "web3"],
  spaceId,
  ipfsHash
);
```

### 4. Send a Tip
```typescript
const { sendTip } = useSolanaTips();

await sendTip(
  recipientWallet,
  0.01,  // SOL amount
  "Great content!"
);
```

### 5. Direct Message
```typescript
const { purchaseAccess, sendMessage } = useDirectMessages();

// One-time payment of 1 POL
await purchaseAccess(recipientAddress);

// Unlimited messages after payment
await sendMessage(recipientAddress, ipfsHash);
```

## 💡 Key Features Explained

### Paid Direct Messaging
- **Cost**: 1 POL (one-time payment) via Polygon smart contract
- **Benefit**: Unlimited DMs after payment
- **Anti-Spam**: Prevents unsolicited messages
- **On-Chain Verification**: Access rights stored in smart contract
- **Encryption**: Messages encrypted and stored on IPFS
- **Payment goes directly to recipient's wallet**

### Multiple Payment Options
1. **Polygon (Primary)**
   - All smart contract features
   - DM unlock (1 POL to recipient)
   - Space access (set your own price in MATIC)
   - Most gas-efficient for frequent transactions

2. **Solana (Alternative)**
   - Direct wallet-to-wallet transfers
   - No smart contracts needed
   - Instant and cheap for tips
   - Optional payment method

3. **Razorpay (Fiat)**
   - Traditional payment gateway
   - UPI, Cards, Net Banking
   - Payments in INR
   - Best for non-crypto users

### Monetization
1. **Space Access Fees**: Set your price in MATIC (or accept SOL/INR via alternatives)
2. **DM Unlock**: Earn 1 POL when someone unlocks DM with you
3. **Tips**: Accept tips in SOL or via Razorpay
4. **All payments go directly to your wallet** (no platform fees on crypto)

## 🔐 Security Features

- **On-Chain Access Control**: Smart contracts verify permissions
- **Encrypted Messages**: CryptoJS encryption for private messages
- **Wallet Authentication**: Only wallet owners can modify their data
- **IPFS Content Addressing**: Tamper-proof content storage

## 📤 Export Functionality

```typescript
import { exportToJSON, exportToCSV } from '@/lib/utils';

// Export as JSON
exportToJSON(bookmarks, 'my-bookmarks');

// Export as CSV
exportToCSV(bookmarks, 'my-bookmarks');
```

## 🧪 Testing

```powershell
# Run Hardhat tests
npx hardhat test

# Test on Mumbai testnet
npx hardhat run scripts/deploy-polygon.ts --network mumbai
```

## 🚢 Deployment

### Frontend (Vercel)
```powershell
npm run build
vercel deploy
```

### Smart Contracts
```powershell
# Deploy to Polygon Mumbai
npm run deploy:polygon

# Verify on PolygonScan
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## 📊 Gas Costs (Approximate)

| Operation | Gas Cost (Mumbai) | USD Equivalent |
|-----------|------------------|----------------|
| Create Bookmark | ~100,000 gas | ~$0.002 |
| Create Space | ~150,000 gas | ~$0.003 |
| Join Space | ~80,000 gas + price | Variable |
| Purchase DM Access | ~100,000 gas + 1 MATIC | ~$0.50 |
| Send Message | ~80,000 gas | ~$0.002 |

## 🛣️ Roadmap

- [ ] NFT badges for top contributors
- [ ] DAO governance for platform decisions
- [ ] AI-powered bookmark categorization
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Integration with Lens Protocol
- [ ] Cross-chain bridges for other L2s

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Polygon](https://polygon.technology/) - Scalable blockchain infrastructure
- [Solana](https://solana.com/) - High-performance blockchain
- [Pinata](https://pinata.cloud/) - IPFS pinning service
- [RainbowKit](https://www.rainbowkit.com/) - Beautiful wallet connection
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum

## 📞 Support

- Twitter: [@BookSpaceWeb3](https://twitter.com/bookspace)
- Discord: [Join our community](https://discord.gg/bookspace)
- Email: support@bookspace.io

## ⚠️ Disclaimer

This project is in **beta** and deployed on testnets. Do not use real funds. Always verify contract addresses before interacting.

---

**Built with ❤️ for the decentralized web**
