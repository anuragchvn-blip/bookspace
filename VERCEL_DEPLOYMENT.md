# 🚀 VERCEL DEPLOYMENT GUIDE - BookSpace

## 📋 PREREQUISITES

Before deploying to Vercel, ensure you have:
- ✅ Contracts deployed to Polygon Mainnet (via Remix)
- ✅ Contract addresses ready
- ✅ Pinata account for IPFS storage
- ✅ WalletConnect Project ID
- ✅ Vercel account (sign up at vercel.com)

---

## 🎯 DEPLOYMENT STEPS

### 1. Install Vercel CLI (Optional)

```powershell
npm install -g vercel
```

### 2. Connect Your GitHub Repository

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `anuragchvn-blip/bookspace`
4. Click "Import"

**Option B: Via CLI**
```powershell
# Login to Vercel
vercel login

# Deploy from project directory
cd c:\Users\Windows\bookspace
vercel
```

---

## 🔐 ENVIRONMENT VARIABLES

### **IMPORTANT:** Add these in Vercel Dashboard

Go to: `Project Settings` → `Environment Variables`

Add the following variables (get values from your `.env.local`):

#### **Required - Polygon Configuration**
```
NEXT_PUBLIC_POLYGON_RPC_URL
Value: https://polygon-rpc.com
```

```
NEXT_PUBLIC_CHAIN_ID
Value: 137
```

#### **Required - Smart Contract Addresses**
```
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS
Value: 0xYourBookmarkRegistryMainnetAddress
```

```
NEXT_PUBLIC_DM_REGISTRY_ADDRESS
Value: 0xYourDMRegistryMainnetAddress
```

#### **Required - IPFS/Pinata**
```
NEXT_PUBLIC_PINATA_JWT
Value: your_pinata_jwt_token
```

```
NEXT_PUBLIC_PINATA_GATEWAY
Value: https://gateway.pinata.cloud
```

#### **Required - WalletConnect**
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
Value: your_walletconnect_project_id
```
Get from: https://cloud.walletconnect.com

#### **Optional - Solana**
```
NEXT_PUBLIC_SOLANA_RPC_URL
Value: https://api.mainnet-beta.solana.com
```

#### **Optional - Razorpay (for fiat payments)**
```
NEXT_PUBLIC_RAZORPAY_KEY_ID
Value: your_razorpay_key
```

```
RAZORPAY_KEY_SECRET
Value: your_razorpay_secret
```

---

## 🔧 VERCEL CONFIGURATION

Your project includes `vercel.json` with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    // Environment variables referenced above
  }
}
```

### What's Configured:
- ✅ **Build Command:** `npm run build`
- ✅ **Framework:** Next.js 14 (App Router)
- ✅ **Region:** US East (iad1) - optimal for global access
- ✅ **CORS Headers:** API routes support cross-origin requests
- ✅ **Environment Variables:** Secure storage for sensitive data

---

## 📦 BUILD SETTINGS

Vercel will automatically detect these settings:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install`
- **Node.js Version:** 18.x (from package.json engines)

---

## 🚀 DEPLOY COMMANDS

### **Initial Deployment**
```powershell
vercel --prod
```

### **Preview Deployment** (for testing)
```powershell
vercel
```

### **Check Deployment Status**
```powershell
vercel ls
```

### **View Logs**
```powershell
vercel logs
```

---

## 🔍 VERIFICATION STEPS

After deployment, verify these:

### 1. **Check Build Logs**
- Go to Vercel Dashboard → Your Project → Deployments
- Click on the latest deployment
- Check "Building" tab for any errors

### 2. **Test Environment Variables**
Open browser console on your deployed site:
```javascript
// This should return your contract address
console.log(process.env.NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS);
```

### 3. **Test Wallet Connection**
- Visit your Vercel URL (e.g., `bookspace.vercel.app`)
- Click "Connect Wallet"
- Ensure MetaMask prompts for Polygon Mainnet
- Verify wallet connects successfully

### 4. **Test Smart Contract Interaction**
- Try creating a space
- Check transaction on Polygonscan
- Verify space appears in dashboard

### 5. **Test Profile Creation**
- Go to `/profile`
- Fill in username, bio, avatar
- Save profile (should upload to IPFS)

---

## 🐛 TROUBLESHOOTING

### Issue: "Build Failed"
**Solution:**
```powershell
# Test build locally first
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

### Issue: "Environment Variable Not Found"
**Solution:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Ensure variable name is **exact** (case-sensitive)
- Redeploy after adding variables

### Issue: "Contract Address Not Configured"
**Solution:**
- Check `.env.local` locally has the address
- Add `NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS` in Vercel Dashboard
- Redeploy

### Issue: "Network Mismatch"
**Solution:**
- Ensure `NEXT_PUBLIC_CHAIN_ID=137` in Vercel
- Clear browser cache
- Switch MetaMask to Polygon Mainnet

### Issue: "IPFS Upload Failed"
**Solution:**
- Verify `NEXT_PUBLIC_PINATA_JWT` is correct
- Test JWT at https://app.pinata.cloud/keys
- Check Pinata quota limits

---

## 🎨 CUSTOM DOMAIN (Optional)

### Add Custom Domain
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `bookspace.io`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### DNS Configuration
For domain `bookspace.io`:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 📊 PERFORMANCE OPTIMIZATIONS

Your Vercel deployment includes:

### **Automatic Optimizations**
- ✅ Image optimization via Next.js Image component
- ✅ Code splitting for faster loads
- ✅ Edge caching for static assets
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 support

### **Recommended Edge Functions**
Add to `vercel.json` for edge runtime:
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  }
}
```

---

## 🔒 SECURITY CHECKLIST

Before going live:

- [ ] All contract addresses are correct (Mainnet, not testnet)
- [ ] Environment variables are set in Vercel (not committed to git)
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] CORS headers configured for API routes
- [ ] Smart contracts are verified on Polygonscan
- [ ] Test with small amounts of MATIC first
- [ ] Rate limiting considered for API routes (optional)

---

## 📱 MOBILE TESTING

Test on multiple devices:
- iPhone Safari
- Android Chrome
- Desktop Chrome/Firefox/Safari
- Tablet devices

Your app is already 100% mobile responsive!

---

## 🎯 POST-DEPLOYMENT CHECKLIST

After successful deployment:

1. **Test All Features**
   - [ ] Wallet connection (Polygon + Solana)
   - [ ] Create space
   - [ ] Create bookmark
   - [ ] Edit profile
   - [ ] Join space (paid)
   - [ ] DM unlock (1 MATIC)
   - [ ] View bookmarks/spaces
   - [ ] Mobile responsiveness

2. **Monitor Performance**
   - [ ] Check Vercel Analytics
   - [ ] Monitor smart contract gas usage
   - [ ] Track user signups
   - [ ] Review error logs

3. **Promote Your App**
   - [ ] Share on Twitter/X
   - [ ] Post on Reddit (r/polygon, r/web3)
   - [ ] Submit to Product Hunt
   - [ ] Add to Web3 directories

---

## 🚦 QUICK DEPLOY CHECKLIST

```
✅ GitHub repo connected to Vercel
✅ Environment variables added (all NEXT_PUBLIC_* vars)
✅ Contract addresses verified (Mainnet, not testnet)
✅ Pinata JWT added
✅ WalletConnect Project ID added
✅ Build successful (check logs)
✅ Deployment live (visit URL)
✅ Wallet connects to Polygon Mainnet
✅ Create space works (test transaction)
✅ Profile creation works (IPFS upload)
✅ Mobile responsive (test on phone)
```

---

## 📞 SUPPORT & RESOURCES

**Vercel Documentation:**
- https://vercel.com/docs
- https://nextjs.org/docs/deployment

**Check Deployment Status:**
```powershell
vercel ls
```

**View Production Logs:**
```powershell
vercel logs --prod
```

**Rollback to Previous Deployment:**
```powershell
vercel rollback
```

---

## 🎉 YOUR APP IS LIVE!

Once deployed, your BookSpace app will be accessible at:
- **Vercel URL:** `https://bookspace-xyz.vercel.app` (auto-generated)
- **Custom Domain:** `https://yourdomain.com` (if configured)

### Share Your Success:
Tweet: "Just deployed my Web3 bookmarking platform on @vercel! 🚀 Built with @0xPolygon + @Solana. Try it: [your-url] #Web3 #Polygon #NextJS"

---

## 🔄 CONTINUOUS DEPLOYMENT

Every push to your `main` branch will trigger:
1. ✅ Automatic build
2. ✅ Run tests (if configured)
3. ✅ Deploy to production
4. ✅ Update live site

Preview deployments created for:
- Pull requests
- Non-main branches

---

## 💰 PRICING

**Vercel Free Tier Includes:**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics (basic)

**Upgrade to Pro ($20/month) for:**
- More bandwidth
- Advanced analytics
- Team collaboration
- Custom domains (unlimited)
- Priority support

---

## ✅ DEPLOYMENT COMPLETE!

Your BookSpace platform is now live on Vercel! 🎊

**Next Steps:**
1. Share with friends for testing
2. Monitor Vercel analytics
3. Check Polygonscan for transactions
4. Gather user feedback
5. Iterate and improve!

🚀 **Happy Building!**
