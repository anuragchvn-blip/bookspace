# IPFS Usage in BookSpace

## Overview
IPFS (InterPlanetary File System) is used throughout BookSpace for decentralized storage of content that would be expensive to store directly on-chain.

## Current IPFS Integration

### 1. **Bookmarks** ✅ ACTIVE
- **What's Stored:** Full bookmark metadata (URL, title, description, tags)
- **When:** Every time you create a bookmark
- **Location:** `src/app/create/page.tsx` (lines 74-88)
- **Smart Contract:** IPFS hash is stored on-chain in the Bookmark struct
- **Benefits:**
  - Permanent, decentralized storage
  - Reduces on-chain storage costs
  - Rich metadata without gas fees
  - Can retrieve full bookmark details from IPFS hash

**Flow:**
```
User creates bookmark → Upload to IPFS → Get hash → Store hash on-chain
```

### 2. **Spaces** ✅ ACTIVE (Metadata Only)
- **What's Stored:** Space metadata (name, description, access price, settings)
- **When:** Every time you create a space
- **Location:** `src/app/create/page.tsx` (lines 110-121)
- **Smart Contract:** NOT stored on-chain (Space struct doesn't have ipfsHash field)
- **Benefits:**
  - Backup of space data
  - Can be used for analytics/indexing
  - Future-proof for v2 contract

**Flow:**
```
User creates space → Upload to IPFS (backup only) → Store details on-chain
```

### 3. **User Profiles** ✅ ACTIVE
- **What's Stored:** Profile data (username, bio, avatar, social links)
- **When:** User edits their profile
- **Location:** `src/app/api/profile/route.ts`
- **Smart Contract:** NOT stored on-chain (completely off-chain)
- **Benefits:**
  - Free profile updates (no gas fees)
  - Rich profile data (unlimited size)
  - Avatar images stored on IPFS

**Flow:**
```
User updates profile → Upload to IPFS → Store hash in database/localStorage
```

### 4. **Direct Messages** 🔧 IMPLEMENTED (Not Active)
- **What's Stored:** Encrypted message content
- **When:** Sending DMs between users
- **Location:** `src/hooks/useDirectMessages.ts`
- **Smart Contract:** IPFS hash stored on-chain
- **Benefits:**
  - End-to-end encryption
  - Message content not visible on-chain
  - Permanent message history

**Flow:**
```
User sends message → Encrypt content → Upload to IPFS → Store hash on-chain
```

## IPFS Functions Available

Located in `src/lib/ipfs.ts`:

### Core Functions
- `uploadToIPFS(data)` - Upload any JSON data
- `fetchFromIPFS(hash)` - Retrieve data by hash
- `pinFileToIPFS(file)` - Upload files (images, etc.)

### Specialized Functions
- `uploadBookmarkContent()` - Upload bookmark metadata
- `uploadSpaceContent()` - Upload space metadata
- `uploadEncryptedMessage()` - Upload encrypted DM
- `fetchEncryptedMessage()` - Retrieve and decrypt DM

### Encryption Functions
- `encryptMessage()` - AES encryption
- `decryptMessage()` - AES decryption

## Configuration

**Required Environment Variable:**
```env
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
```

**Gateway:**
- Default: `https://gateway.pinata.cloud`
- Configurable in `src/config/constants.ts`

## How to Use IPFS in Your Code

### Example 1: Create Bookmark with IPFS
```typescript
import { uploadBookmarkContent } from '@/lib/ipfs';

// Upload to IPFS first
const { ipfsHash } = await uploadBookmarkContent(
  url, title, description, tags
);

// Then save to blockchain with hash
await createBookmark(url, title, description, tags, spaceId, ipfsHash);
```

### Example 2: Retrieve Bookmark Data
```typescript
import { fetchFromIPFS } from '@/lib/ipfs';

// Get bookmark from blockchain
const bookmark = await getBookmark(bookmarkId);

// Fetch full metadata from IPFS
if (bookmark.ipfsHash) {
  const fullData = await fetchFromIPFS(bookmark.ipfsHash);
  console.log(fullData); // { url, title, description, tags, timestamp }
}
```

### Example 3: Send Encrypted Message
```typescript
import { uploadEncryptedMessage } from '@/lib/ipfs';

const { ipfsHash } = await uploadEncryptedMessage(
  messageContent,
  senderAddress,
  recipientAddress
);

await sendMessage(recipientAddress, ipfsHash);
```

## Benefits of IPFS Integration

1. **Cost Savings** 💰
   - Storing data on-chain is expensive (~$0.01-$1 per KB)
   - IPFS storage is essentially free
   - Only store small hash (46 bytes) on-chain

2. **Censorship Resistance** 🛡️
   - Data distributed across IPFS network
   - No single point of failure
   - Content-addressed (tamper-proof)

3. **Rich Content** 📝
   - No gas limit constraints
   - Can store large metadata
   - Future: Images, documents, etc.

4. **Privacy** 🔒
   - Encrypted messages not readable on-chain
   - Only sender/recipient can decrypt

## Current vs Future IPFS Usage

### ✅ Currently Active
- Bookmark metadata upload
- Space metadata backup
- User profile storage
- Message encryption functions

### 🚧 Partially Implemented
- Direct messaging (code exists, needs UI)
- File attachments (function exists, not used)

### 🔮 Future Enhancements
- Space thumbnails/images
- Bookmark screenshots
- Rich text content
- Collaborative notes
- File sharing

## Verification

To verify IPFS is working:

1. **Create a bookmark**
2. **Check browser console** for "Uploaded to IPFS!" message
3. **Check blockchain transaction** - should see ipfsHash parameter
4. **Visit IPFS gateway**: `https://gateway.pinata.cloud/ipfs/YOUR_HASH`

## Troubleshooting

**Issue:** "Failed to upload to IPFS"
- Check `NEXT_PUBLIC_PINATA_JWT` is set
- Verify Pinata account has API quota
- Check network connectivity

**Issue:** Empty ipfsHash on-chain
- IPFS upload failed but blockchain transaction succeeded
- Check browser console for errors
- Bookmark still works, just no IPFS backup

## Summary

**IPFS is actively used for:**
1. ✅ Bookmark content storage (with on-chain hash)
2. ✅ Space metadata backup (off-chain only)
3. ✅ User profiles (completely off-chain)

**Smart contracts store IPFS hashes for:**
- Bookmarks (ipfsHash field in Bookmark struct)
- Messages (ipfsHash field in Message struct)

**Current deployment:** IPFS upload happens automatically when creating bookmarks and spaces!
