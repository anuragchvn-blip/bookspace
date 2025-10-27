# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```powershell
   Copy-Item .env.example .env.local
   ```

2. **Fill in required values** (see sections below)

3. **Restart the development server**

---

## Required Configuration

### 1. Polygon Smart Contracts

After deploying contracts to Mumbai testnet:

```env
NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS=0x...  # From deployment output
NEXT_PUBLIC_DM_REGISTRY_ADDRESS=0x...        # From deployment output
```

**How to get:**
```powershell
npm run deploy:polygon
# Copy the addresses from the output
```

---

### 2. Pinata/IPFS (Required)

Sign up at [Pinata](https://app.pinata.cloud/) and get API keys:

```env
NEXT_PUBLIC_PINATA_JWT=eyJhbGc...  # From Pinata dashboard
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
```

**Steps:**
1. Go to https://app.pinata.cloud/keys
2. Create new key with admin permissions
3. Copy the JWT token
4. Add to `.env.local`

---

### 3. Deployment Private Key

Export from MetaMask (for Mumbai testnet deployment):

```env
PRIVATE_KEY=0xabc123...  # Your wallet private key
```

**Steps:**
1. Open MetaMask
2. Click on account menu → Account Details
3. Click "Export Private Key"
4. Enter password and copy key
5. **NEVER commit this to git!**

---

## Optional Configuration

### 1. Razorpay (For Fiat Payments)

Sign up at [Razorpay](https://dashboard.razorpay.com/):

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

**Steps:**
1. Create account at https://dashboard.razorpay.com/signup
2. Complete KYC (optional for test mode)
3. Go to Settings → API Keys
4. Generate test/live keys
5. For webhook secret: Settings → Webhooks → Create webhook
6. Use URL: `https://yourdomain.com/api/webhook/razorpay`

**Test Cards:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

### 2. Supabase (For Caching)

Sign up at [Supabase](https://supabase.com/):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Steps:**
1. Create project at https://app.supabase.com/
2. Go to Settings → API
3. Copy URL and keys
4. Create tables (see `docs/SUPABASE_SCHEMA.md`)

---

### 3. Internal API Key (For Security)

Generate a random API key:

```powershell
# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

```env
INTERNAL_API_KEY=your-generated-key
```

Use this key in request headers for authenticated API routes:
```typescript
headers: {
  'x-api-key': process.env.INTERNAL_API_KEY
}
```

---

## Environment-Specific Configuration

### Development (.env.local)

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
DEBUG=true
SKIP_BLOCKCHAIN_VERIFICATION=false
```

### Staging (.env.staging)

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.bookspace.io
NEXT_PUBLIC_POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
DEBUG=false
ALLOWED_ORIGINS=https://staging.bookspace.io
```

### Production (.env.production)

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://bookspace.io
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_POLYGON_CHAIN_ID=137
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
DEBUG=false
ALLOWED_ORIGINS=https://bookspace.io,https://www.bookspace.io
```

---

## Backend API Configuration

### Rate Limiting

The backend uses in-memory rate limiting by default. For production, use Redis:

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Sign up at [Upstash](https://upstash.com/) for serverless Redis.

### CORS Configuration

```env
# Development: Allow all
ALLOWED_ORIGINS=*

# Production: Specific domains only
ALLOWED_ORIGINS=https://bookspace.io,https://app.bookspace.io
```

---

## Web3 Provider Upgrades

### Alchemy (Recommended)

Better performance and reliability:

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
```

Sign up: https://dashboard.alchemy.com/

### Infura

```env
NEXT_PUBLIC_INFURA_API_KEY=your_key
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_KEY
```

Sign up: https://infura.io/

---

## Security Checklist

- [ ] **Never commit `.env.local`** - Already in `.gitignore`
- [ ] **Rotate private keys** regularly
- [ ] **Use different keys** for dev/staging/production
- [ ] **Enable 2FA** on all service accounts
- [ ] **Restrict API keys** to specific domains in production
- [ ] **Set up webhook signature verification** for Razorpay
- [ ] **Use HTTPS** for all production URLs
- [ ] **Backup environment variables** in secure vault (1Password, etc.)
- [ ] **Limit CORS origins** to your domains only
- [ ] **Use environment variables** for all secrets (never hardcode)

---

## Troubleshooting

### "Contract address not configured"

Make sure you've deployed contracts and added addresses:
```powershell
npm run deploy:polygon
# Copy addresses to .env.local
```

### "Pinata upload failed"

Check your Pinata JWT is valid:
```powershell
# Test Pinata connection
curl -X GET https://api.pinata.cloud/data/testAuthentication -H "Authorization: Bearer YOUR_JWT"
```

### "Rate limit exceeded"

Increase rate limits in `src/lib/api-utils.ts` or add Redis for distributed rate limiting.

### "Webhook signature verification failed"

Make sure `RAZORPAY_WEBHOOK_SECRET` matches the secret in Razorpay dashboard.

---

## Environment Variable Priority

Next.js loads environment variables in this order (highest priority first):

1. `.env.local` (all environments, loaded for local development)
2. `.env.[environment].local` (e.g., `.env.production.local`)
3. `.env.[environment]` (e.g., `.env.production`)
4. `.env`

**Best Practice:** Use `.env.local` for local development, never commit it.

---

## Vercel Deployment

Add environment variables in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select environment (Production/Preview/Development)
4. Save and redeploy

**Important:** Vercel automatically exposes `NEXT_PUBLIC_*` variables to the client bundle.

---

## Testing Configuration

To verify your setup:

```powershell
# Start development server
npm run dev

# Open health check endpoint
# http://localhost:3000/api/health
```

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
        "polygon": { "rpcUrl": true, "bookmarkRegistry": true },
        "ipfs": { "pinataJwt": true }
      }
    }
  }
}
```

---

## Quick Reference

| Variable | Required | Where to Get | Used For |
|----------|----------|--------------|----------|
| `NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS` | ✅ | Deploy contracts | Smart contract interactions |
| `NEXT_PUBLIC_DM_REGISTRY_ADDRESS` | ✅ | Deploy contracts | DM system |
| `NEXT_PUBLIC_PINATA_JWT` | ✅ | Pinata.cloud | IPFS uploads |
| `PRIVATE_KEY` | ✅ | MetaMask export | Contract deployment |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⚠️ | Razorpay dashboard | Fiat payments |
| `RAZORPAY_KEY_SECRET` | ⚠️ | Razorpay dashboard | Payment verification |
| `RAZORPAY_WEBHOOK_SECRET` | ⚠️ | Razorpay webhooks | Webhook security |
| `INTERNAL_API_KEY` | ⚠️ | Generate random | API authentication |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ | Supabase.com | Caching (optional) |

**Legend:** ✅ Required | ⚠️ Optional but recommended | ❌ Optional

---

**Last Updated:** 2024  
**For Issues:** See `docs/TROUBLESHOOTING.md`
