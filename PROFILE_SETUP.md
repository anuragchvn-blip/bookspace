# 👤 USER PROFILES - SETUP GUIDE

## ✨ WHAT WE BUILT

Your BookSpace platform now has **complete user profile functionality**! Users can now:

✅ Set a **custom username** (@sarah_web3 instead of 0xd36E...)  
✅ Add a **display name** (Sarah Johnson)  
✅ Write a **bio** (up to 500 characters)  
✅ Upload a **profile picture** (stored on IPFS)  
✅ Add **social links** (Twitter, GitHub, Website)  
✅ Edit profiles **anytime for FREE** (no gas fees!)  

---

## 🏗️ ARCHITECTURE

### Storage Strategy: **HYBRID OFF-CHAIN**

**Why Off-Chain?**
- ✅ **FREE updates** - No gas fees to change username/bio
- ✅ **Flexible** - Easy to add new fields later
- ✅ **Privacy** - Can delete/update data
- ✅ **Rich content** - Store images, links, etc.

**How It Works:**
```
1. User connects wallet (0xABC123...)
2. User edits profile → Uploaded to IPFS via Pinata
3. Profile data stored with wallet address as key
4. When displaying spaces/bookmarks → Fetch profile by address
5. Shows "@sarah_web3" instead of "0xABC123..."
```

**Data Flow:**
```
User Wallet → ProfileEditor Component → /api/profile → Pinata IPFS → Stored
                                                              ↓
SpaceCard/BookmarkCard → useProfile Hook → /api/profile → Fetch from IPFS
```

---

## 📁 FILES CREATED

### 1. **Types** (`src/types/profile.ts`)
Defines profile data structure:
- UserProfile interface
- ProfileFormData interface

### 2. **API Route** (`src/app/api/profile/route.ts`)
- `POST /api/profile` - Create/update profile
- `GET /api/profile?address=0x...` - Fetch profile by address
- Validates username format (3-20 chars, alphanumeric + underscore)
- Validates bio length (max 500 chars)
- Uploads to IPFS via Pinata

### 3. **Profile Editor** (`src/components/ProfileEditor.tsx`)
Full-featured profile editing form:
- Avatar upload with preview
- Username input (validated)
- Display name
- Bio textarea (500 char limit with counter)
- Social links (Twitter, GitHub, Website)
- Loading states
- Error handling

### 4. **Profile Page** (`src/app/profile/page.tsx`)
Dedicated `/profile` route:
- Requires wallet connection
- Shows ProfileEditor component
- Sidebar navigation
- Back to dashboard link

### 5. **Profile Hook** (`src/hooks/useProfile.ts`)
- `useProfile(address)` - Fetch profile data
- Auto-caches profiles
- Returns loading/error states
- `formatUserDisplay()` helper function

### 6. **Profile Display Components** (`src/components/UserProfileCard.tsx`)
- `<UserProfileCard />` - Full profile card with avatar, bio, stats, social links
- `<UserBadge />` - Compact inline display (avatar + username)

### 7. **Updated Components**
- `SpaceCard.tsx` - Now shows `<UserBadge />` instead of raw address
- `BookmarkCard.tsx` - Now shows `<UserBadge />` instead of raw address

---

## 🚀 HOW TO USE

### For Users:

#### **Step 1: Set Up Profile**
1. Go to `/profile` page
2. Connect your wallet
3. Fill in:
   - **Username** (required): @your_username
   - **Display Name**: Your Full Name
   - **Bio**: Tell people about yourself
   - **Avatar**: Upload profile picture
   - **Social Links**: Twitter, GitHub, Website
4. Click **SAVE PROFILE** (FREE - no gas!)

#### **Step 2: Profile Appears Everywhere**
Your profile now shows instead of wallet address:
- ✅ In space cards ("by @sarah_web3")
- ✅ In bookmark cards ("by @sarah_web3")
- ✅ In DM conversations (future)
- ✅ In search results (future)

---

## 🎨 UI EXAMPLES

### Before:
```
Space: Web3 Learning
by: 0xd36E0A7390622C21a4E457cb9E9D074B040b82E5
```

### After:
```
Space: Web3 Learning
by: [Avatar] @sarah_web3 ✓
```

---

## 🔧 TECHNICAL DETAILS

### Profile Validation Rules:

**Username:**
- 3-20 characters
- Letters, numbers, underscore only
- Pattern: `/^[a-zA-Z0-9_]{3,20}$/`
- Examples: ✅ `sarah_web3` ✅ `dev123` ❌ `sa` (too short) ❌ `user-name` (hyphen not allowed)

**Bio:**
- Max 500 characters
- Multiline supported

**Avatar:**
- JPG, PNG, GIF
- Max 2MB (recommended)
- Uploaded to IPFS via Pinata

### IPFS Storage:

Profiles stored on IPFS with structure:
```json
{
  "address": "0xabc...",
  "username": "sarah_web3",
  "displayName": "Sarah Johnson",
  "bio": "Web3 Educator | Building the future",
  "avatar": "ipfs://QmXxx...",
  "twitter": "@sarah_web3",
  "github": "sarah-dev",
  "website": "https://sarah.com",
  "updatedAt": 1698518400000
}
```

### Default Profiles:

If no profile set, shows:
- Username: `user_ABC123` (from wallet address)
- Display: `0xABC1...XYZ9` (shortened address)
- No avatar/bio/links

---

## 🎯 FUTURE ENHANCEMENTS

### Next Steps (Optional):

1. **Profile Discovery**
   - `/profiles` page to browse all users
   - Search by username
   - Filter by verified status

2. **Database Integration**
   - Add Prisma/Supabase for faster queries
   - Index usernames for search
   - Cache profiles in DB

3. **Username Uniqueness**
   - Check if username already taken
   - Reserve system (paid feature?)

4. **Verification System**
   - Blue checkmark for verified users
   - Twitter/GitHub verification
   - Domain ownership verification

5. **Profile Stats**
   - Auto-calculate bookmarks count
   - Auto-calculate spaces owned
   - Total members across spaces
   - Joined date from blockchain

6. **NFT Avatars**
   - Use owned NFTs as avatars
   - Display NFT collections

7. **Follow System**
   - Follow other users
   - Follow feeds
   - Notifications

---

## 💡 PRODUCTION TIPS

### Before Going Live:

1. **Set up Database** (Recommended)
   ```bash
   npm install @prisma/client
   npx prisma init
   ```
   Create profile table:
   ```prisma
   model Profile {
     id          String   @id @default(cuid())
     address     String   @unique
     username    String   @unique
     displayName String?
     bio         String?
     avatar      String?
     twitter     String?
     github      String?
     website     String?
     ipfsHash    String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

2. **Add Username Uniqueness Check**
   In `/api/profile/route.ts`:
   ```typescript
   // Check if username already exists
   const existing = await db.profile.findUnique({
     where: { username: username.toLowerCase() }
   });
   if (existing && existing.address !== address) {
     return NextResponse.json(
       { error: 'Username already taken' },
       { status: 409 }
     );
   }
   ```

3. **Rate Limiting**
   Prevent spam profile updates:
   ```typescript
   // Max 1 profile update per 5 minutes
   const lastUpdate = await redis.get(`profile:${address}`);
   if (lastUpdate && Date.now() - lastUpdate < 300000) {
     return NextResponse.json(
       { error: 'Please wait before updating again' },
       { status: 429 }
     );
   }
   ```

4. **Image Optimization**
   Resize avatars before upload:
   ```typescript
   import sharp from 'sharp';
   
   const buffer = await sharp(file)
     .resize(200, 200, { fit: 'cover' })
     .jpeg({ quality: 80 })
     .toBuffer();
   ```

5. **Content Moderation**
   - Filter inappropriate usernames
   - Scan bios for spam/scam links
   - Report system for abuse

---

## 🐛 TROUBLESHOOTING

### Issue: "Username already taken"
**Solution:** Choose a different username (uniqueness will be enforced after DB setup)

### Issue: "Failed to upload to IPFS"
**Solution:** Check `NEXT_PUBLIC_PINATA_JWT` in `.env.local`

### Issue: Profile not showing
**Solution:** Clear cache and refresh. IPFS can take 1-2 seconds to propagate.

### Issue: Avatar not uploading
**Solution:** 
- Check file size (max 2MB recommended)
- Check file format (JPG/PNG/GIF only)
- Check Pinata quota

---

## 📊 COST ANALYSIS

### Current Setup (Off-Chain):
- ✅ **Profile creation:** FREE
- ✅ **Profile updates:** FREE
- ✅ **Avatar upload:** FREE (uses Pinata free tier)
- ✅ **Username changes:** FREE (unlimited)

### If On-Chain (Not Recommended):
- ❌ **Profile creation:** ~$0.02 gas
- ❌ **Each update:** ~$0.02 gas
- ❌ **Avatar storage:** ~$5-50 depending on size
- ❌ **Username change:** ~$0.02 gas

**Savings:** Off-chain saves users ~$10-100 over lifetime!

---

## ✅ TESTING CHECKLIST

Test these scenarios:

- [ ] Connect wallet
- [ ] Visit `/profile` page
- [ ] Fill out profile form
- [ ] Upload avatar image
- [ ] Save profile (should succeed)
- [ ] Go to dashboard
- [ ] Create a space
- [ ] Verify space shows username instead of address
- [ ] Create a bookmark
- [ ] Verify bookmark shows username instead of address
- [ ] Edit profile again
- [ ] Verify changes saved
- [ ] Disconnect wallet
- [ ] Reconnect wallet
- [ ] Verify profile persists

---

## 🎉 SUCCESS!

Your users can now:
1. ✅ Set custom usernames (@sarah_web3)
2. ✅ Add bios and avatars
3. ✅ Link social profiles
4. ✅ Update profiles anytime for FREE
5. ✅ Be recognized across the platform

**No more ugly wallet addresses!** 🚀

---

## 📞 NEED HELP?

If you want to add:
- Database integration
- Username uniqueness
- Verification badges
- Follow system
- Profile analytics

Just ask! I can help implement any of these features.
