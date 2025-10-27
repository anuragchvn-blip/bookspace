# BookSpace Architecture

## Overview

BookSpace is a decentralized bookmarking platform built with a simplified multi-chain architecture:
- **Polygon**: Primary blockchain for all core features (bookmarks, spaces, DMs)
- **Solana**: Optional alternative payment method (simple wallet transfers only)
- **Razorpay**: Fiat payment gateway for traditional payment methods

## Architecture Decisions

### Why Polygon is Primary?

1. **Smart Contract Support**: All core features require smart contracts
2. **Data Storage**: Efficient mapping and storage for bookmarks/spaces
3. **Access Control**: On-chain verification of space membership and DM access
4. **Cost Efficiency**: Low gas fees on Mumbai testnet (~$0.001 per transaction)
5. **EVM Compatible**: Easy integration with existing tools (Hardhat, Wagmi, Viem)

### Why Solana is Optional?

Originally planned for:
- ❌ Complex Anchor programs for tipping system
- ❌ On-chain DM payments
- ❌ Micropayment state management

Simplified to:
- ✅ Direct wallet-to-wallet transfers only
- ✅ Simple RPC calls via `@solana/web3.js`
- ✅ Optional payment method for tips
- ✅ No smart contracts needed

**Rationale**: User clarified that DM payments should be on Polygon, not Solana. This eliminated the need for complex Solana programs. Solana now serves as a lightweight alternative payment rail.

### Why Razorpay?

1. **Accessibility**: Not everyone has crypto wallets
2. **Local Payment Methods**: UPI is dominant in India
3. **Familiar UX**: Credit cards, net banking
4. **Business Compliance**: KYC/AML built-in
5. **Reversibility**: Chargeback protection (pro/con)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js 14 App                       │
│                     (Frontend + API Routes)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
        ┌───────────┐ ┌──────────┐ ┌────────────┐
        │  Polygon  │ │  Solana  │ │  Razorpay  │
        │  (Mumbai) │ │ (Devnet) │ │   (API)    │
        └───────────┘ └──────────┘ └────────────┘
                │           │           │
                ▼           ▼           ▼
        ┌───────────┐ ┌──────────┐ ┌────────────┐
        │  Smart    │ │  Wallet  │ │  Payment   │
        │ Contracts │ │ Transfers│ │  Gateway   │
        └───────────┘ └──────────┘ └────────────┘
                │
                ▼
        ┌─────────────────┐
        │  IPFS/Pinata    │
        │  (Content)      │
        └─────────────────┘
```

## Data Flow

### Creating a Bookmark

```
User Input (URL, Title, Tags)
        ↓
Extract Metadata (API Route)
        ↓
Upload to IPFS (if rich content)
        ↓
Call BookmarkRegistry.createBookmark()
        ↓
Polygon Smart Contract Storage
        ↓
Event Emitted → Frontend Updates
```

### Joining a Premium Space

```
User Clicks "Join Space"
        ↓
PaymentSelector Component Displays
        ↓
User Selects Payment Method:
        ├─ Polygon → Smart Contract Call (joinSpace)
        ├─ Solana → Direct Wallet Transfer
        └─ Razorpay → Fiat Payment Gateway
        ↓
Payment Verified
        ↓
Access Granted in Smart Contract
        ↓
UI Updated with Space Bookmarks
```

### Unlocking DM Access

```
User Wants to DM Another User
        ↓
Check dmAccess[sender][recipient]
        ↓
If Not Paid:
    ↓
    Display PaymentSelector (1 POL)
    ↓
    User Pays via Polygon Smart Contract
    ↓
    purchaseDMAccess(recipient) called
    ↓
    1 POL transferred to recipient
    ↓
    dmAccess[sender][recipient].hasPaid = true
        ↓
Send Encrypted Message
        ↓
Upload to IPFS
        ↓
Store IPFS hash on-chain
```

## Smart Contract Architecture

### BookmarkRegistry.sol

**Purpose**: Core contract for bookmarks and spaces

**Key Structures**:
```solidity
struct Bookmark {
    uint256 id;
    address owner;
    string url;
    string title;
    string description;
    string[] tags;
    uint256 spaceId;
    string ipfsHash;
    uint256 createdAt;
}

struct Space {
    uint256 id;
    address owner;
    string name;
    string description;
    bool isPublic;
    uint256 accessPrice;
    uint256 createdAt;
}
```

**Key Functions**:
- `createBookmark()` - Store bookmark with IPFS hash
- `createSpace()` - Create public/premium space
- `joinSpace()` - Pay to join premium space (MATIC goes to owner)
- `getSpaceBookmarks()` - Access-controlled retrieval

**Access Control**:
- Public spaces: Anyone can view
- Premium spaces: Must pay `accessPrice` to join
- Only members can view space bookmarks

### DirectMessageRegistry.sol

**Purpose**: Paid DM system with spam prevention

**Key Structure**:
```solidity
struct DMAccess {
    bool hasPaid;
    uint256 paidAt;
}

struct Message {
    uint256 id;
    address sender;
    address recipient;
    string ipfsHash;  // Encrypted message on IPFS
    uint256 timestamp;
}
```

**Payment Model**:
- **Cost**: 1 POL (one-time payment)
- **Recipient**: Payment goes directly to recipient wallet
- **Benefit**: Unlimited messages after payment
- **Anti-Spam**: Prevents unsolicited DMs

**Key Functions**:
- `purchaseDMAccess(recipient)` - Pay 1 POL to unlock
- `sendMessage(recipient, ipfsHash)` - Send encrypted message
- `checkDMAccess(sender, recipient)` - Verify payment

## Frontend Architecture

### Component Hierarchy

```
App Layout
├── WalletProviders (Polygon + Solana)
│   └── Page Components
│       ├── Home (Landing)
│       ├── Dashboard (User's bookmarks/spaces)
│       ├── Create (Add bookmark/space)
│       ├── Spaces (Browse all spaces)
│       ├── Space Detail (Single space view)
│       └── Messages (DM inbox)
│
├── Shared Components
│   ├── WalletConnect (Multi-wallet button)
│   ├── BookmarkCard (Display bookmark)
│   ├── SpaceCard (Display space)
│   ├── PaymentSelector (3-way payment chooser)
│   └── TipButton (Quick tip to creator)
│
└── Hooks
    ├── useBookmarks (Smart contract interactions)
    ├── useSpaces (Space management)
    ├── useDirectMessages (DM system)
    ├── useSolanaPayments (SOL transfers)
    └── useRazorpay (Fiat payments)
```

### State Management

**Wallet State**:
- Wagmi: Polygon wallet connection
- Solana Wallet Adapter: Solana wallet connection
- Zustand: Global app state (optional)

**Blockchain State**:
- Smart contract reads via `useContractRead`
- Writes via `useContractWrite`
- Events via `useContractEvent`
- Optimistic UI updates

**Payment State**:
- Transaction pending/success/error
- Payment method selection
- Amount calculations
- Receipt storage

## Security Architecture

### Smart Contract Security

1. **Access Control**: Only bookmark owner can edit/delete
2. **Payment Validation**: `require(msg.value >= price)`
3. **Reentrancy Protection**: Using OpenZeppelin patterns
4. **Integer Overflow**: Solidity 0.8.20 has built-in checks
5. **Event Logging**: All state changes emit events

### Frontend Security

1. **Environment Variables**: Sensitive keys in `.env.local`
2. **API Routes**: Server-side Razorpay verification
3. **Input Validation**: Zod schemas for all forms
4. **XSS Prevention**: React auto-escapes by default
5. **CORS**: Next.js API routes have CORS protection

### Payment Security

**Polygon**:
- Smart contracts handle payment atomically
- No intermediary custody of funds
- Direct wallet-to-wallet transfers

**Solana**:
- `SystemProgram.transfer()` only
- No complex program logic = smaller attack surface
- User signs every transaction

**Razorpay**:
- HMAC-SHA256 signature verification
- Server-side secret key never exposed
- Webhook signature validation
- Rate limiting on payment endpoints

## Performance Optimization

### Blockchain

1. **Event Indexing**: Index events instead of querying full history
2. **Batch Reads**: Use `multicall` for multiple contract reads
3. **Optimistic Updates**: Update UI before confirmation
4. **Gas Optimization**: Efficient data structures in contracts

### Frontend

1. **Next.js 14**: App Router with server components
2. **Code Splitting**: Dynamic imports for heavy components
3. **Image Optimization**: next/image for IPFS content
4. **Caching**: SWR or React Query for contract data

### IPFS

1. **Pinata**: Reliable IPFS pinning service
2. **Gateway**: Use fast CDN gateway for retrieval
3. **Lazy Loading**: Load IPFS content on-demand
4. **Compression**: Compress large content before upload

## Deployment Architecture

### Development
- **Frontend**: `npm run dev` (localhost:3000)
- **Contracts**: Mumbai testnet
- **Solana**: Devnet
- **Razorpay**: Test mode

### Staging
- **Frontend**: Vercel preview deployment
- **Contracts**: Mumbai testnet (same)
- **Solana**: Devnet (same)
- **Razorpay**: Test mode → Live mode transition

### Production
- **Frontend**: Vercel production (vercel.com)
- **Contracts**: Polygon mainnet
- **Solana**: Mainnet-beta
- **Razorpay**: Live mode with KYC complete

## Scalability Considerations

### Current Limitations

1. **On-chain Storage**: All bookmarks on Polygon
   - **Limit**: Gas costs for large datasets
   - **Solution**: Store only metadata on-chain, full content on IPFS

2. **Event Querying**: Need to query all events
   - **Limit**: Slow for users with 1000+ bookmarks
   - **Solution**: Implement The Graph indexer or Supabase caching

3. **Real-time Updates**: Polling for new bookmarks
   - **Limit**: Not truly real-time
   - **Solution**: WebSocket connection to event listener

### Future Improvements

1. **The Graph**: Index all smart contract events
2. **Supabase**: Cache frequently accessed data off-chain
3. **Subgraph**: Query bookmarks/spaces efficiently
4. **Push Protocol**: Real-time notifications for DMs
5. **Arweave**: Permanent storage for important bookmarks
6. **Ceramic**: Decentralized profile and social graph

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 | React framework with SSR |
| | TypeScript | Type safety |
| | Tailwind CSS | Styling |
| | Wagmi | Ethereum interactions |
| | Solana Wallet Adapter | Solana wallet connection |
| **Blockchain** | Polygon Mumbai | Primary smart contracts |
| | Solana Devnet | Alternative payments |
| | Solidity 0.8.20 | Smart contract language |
| | Hardhat | Contract development |
| **Payments** | Razorpay | Fiat payment gateway |
| **Storage** | IPFS/Pinata | Decentralized storage |
| | CryptoJS | Message encryption |
| **API** | Next.js API Routes | Backend endpoints |
| **Deployment** | Vercel | Frontend hosting |

## Design Principles

1. **Decentralization First**: Smart contracts control access, not servers
2. **User Sovereignty**: Users own their data (wallet = identity)
3. **Progressive Enhancement**: Works with any payment method
4. **Gas Efficiency**: Minimize on-chain storage costs
5. **Security by Design**: Multi-layer validation
6. **Simplicity**: Use native tools (no over-engineering)

## Lessons Learned

### What Changed During Development

**Original Plan**:
- Complex Solana Anchor program for tips
- Solana for all micropayments including DMs
- Multi-signature accounts for space ownership

**Final Implementation**:
- Simplified Solana to RPC-only transfers
- Polygon for DM payments (user clarification)
- Direct wallet-to-wallet payments (no escrow)
- Added Razorpay for fiat accessibility

### Why the Changes?

1. **User Feedback**: "payment for dm happens using polygon"
2. **Complexity vs Value**: Anchor program was overkill for simple transfers
3. **Accessibility**: Not everyone has crypto - Razorpay bridges gap
4. **Transparency**: Direct payments = owner sees wallet address before paying

### Key Takeaways

- Start simple, add complexity only when needed
- Always clarify payment flows early in design
- Provide multiple payment options for wider adoption
- Direct payments build trust (no platform custody)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Development (Ready for testing)
