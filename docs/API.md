# Backend API Documentation

## Overview

The BookSpace backend provides REST APIs for:
- Payment processing (Razorpay)
- Blockchain verification
- IPFS uploads
- Analytics tracking
- Health monitoring

All API routes follow a consistent response format with proper error handling, rate limiting, and CORS support.

---

## Base URL

**Development:** `http://localhost:3000/api`  
**Production:** `https://yourdomain.com/api`

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "timestamp": 1234567890
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional, only in development
  },
  "timestamp": 1234567890
}
```

---

## Authentication

Some endpoints require authentication via API key:

```http
POST /api/endpoint
x-api-key: your-internal-api-key
```

Set `INTERNAL_API_KEY` in `.env.local` for protected routes.

---

## Rate Limiting

All endpoints have rate limiting enabled. Headers included in responses:

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1234567890
```

If limit exceeded:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "resetAt": 1234567890
    }
  }
}
```

---

## Endpoints

### Health Check

**Endpoint:** `GET /api/health`  
**Authentication:** None  
**Rate Limit:** None

**Description:** Check API and blockchain connectivity status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 12345,
    "responseTime": "15ms",
    "blockchain": {
      "status": "connected",
      "blockNumber": 12345678,
      "network": "Mumbai Testnet"
    },
    "environment": {
      "node": "development",
      "configured": {
        "polygon": { "rpcUrl": true, "bookmarkRegistry": true },
        "solana": { "rpcUrl": true },
        "razorpay": { "keyId": true, "keySecret": true },
        "ipfs": { "pinataJwt": true }
      }
    }
  }
}
```

---

### Verify Transaction

**Endpoint:** `POST /api/verify/transaction`  
**Authentication:** None  
**Rate Limit:** 20 requests/minute

**Description:** Verify a blockchain transaction exists and succeeded.

**Request Body:**
```json
{
  "txHash": "0x...",
  "expectedFrom": "0x..." (optional),
  "expectedTo": "0x..." (optional)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "transaction": {
      "hash": "0x...",
      "blockNumber": "12345678",
      "from": "0x...",
      "to": "0x..."
    }
  }
}
```

**Errors:**
- `VALIDATION_ERROR` (400) - Invalid transaction hash format
- `TRANSACTION_NOT_FOUND` (404) - Transaction not found on-chain
- `SENDER_MISMATCH` (400) - Transaction sender doesn't match expected
- `RECIPIENT_MISMATCH` (400) - Transaction recipient doesn't match expected

---

### Verify Access

**Endpoint:** `POST /api/verify/access`  
**Authentication:** None  
**Rate Limit:** 30 requests/minute

**Description:** Verify user's access to spaces, DMs, or bookmark ownership.

**Request Body:**
```json
{
  "type": "space" | "dm" | "bookmark",
  "userAddress": "0x...",
  "resourceId": 123, // For space or bookmark
  "targetAddress": "0x..." // For DM verification
}
```

**Response (Space):**
```json
{
  "success": true,
  "data": {
    "hasAccess": true,
    "type": "space",
    "userAddress": "0x...",
    "spaceId": 123,
    "member": true,
    "timestamp": 1234567890
  }
}
```

**Response (DM):**
```json
{
  "success": true,
  "data": {
    "hasAccess": true,
    "type": "dm",
    "userAddress": "0x...",
    "sender": "0x...",
    "recipient": "0x...",
    "paid": true,
    "timestamp": 1234567890
  }
}
```

**Errors:**
- `INVALID_RESOURCE_ID` (400) - Invalid or missing resource ID
- `MISSING_TARGET` (400) - Target address required for DM verification
- `VERIFICATION_FAILED` (500) - On-chain verification failed

---

### Create Razorpay Order

**Endpoint:** `POST /api/razorpay/create-order`  
**Authentication:** None  
**Rate Limit:** 10 requests/minute

**Description:** Create a Razorpay order for payment processing.

**Request Body:**
```json
{
  "amount": 40000, // Amount in paise (₹400)
  "currency": "INR",
  "purpose": "space_access" | "dm_access" | "tip" | "other",
  "metadata": {
    "userAddress": "0x...",
    "spaceId": "123",
    "recipientAddress": "0x..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xxx",
    "amount": 40000,
    "currency": "INR",
    "receipt": "rcpt_1234567890_space_access",
    "status": "created",
    "createdAt": 1234567890
  }
}
```

**Errors:**
- `CONFIGURATION_ERROR` (500) - Razorpay not configured
- `VALIDATION_ERROR` (400) - Invalid amount or purpose
- `ORDER_CREATION_FAILED` (500) - Razorpay API error

---

### Verify Razorpay Payment

**Endpoint:** `POST /api/razorpay/verify-payment`  
**Authentication:** None  
**Rate Limit:** 20 requests/minute

**Description:** Verify Razorpay payment signature after successful payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx",
  "purpose": "space_access",
  "metadata": {
    "userAddress": "0x...",
    "spaceId": "123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "paymentId": "pay_xxx",
    "orderId": "order_xxx",
    "purpose": "space_access",
    "timestamp": 1234567890
  }
}
```

**Errors:**
- `CONFIGURATION_ERROR` (500) - Razorpay secret not configured
- `INVALID_SIGNATURE` (400) - Payment signature verification failed
- `VERIFICATION_FAILED` (500) - Verification error

---

### Razorpay Webhook

**Endpoint:** `POST /api/webhook/razorpay`  
**Authentication:** Webhook signature  
**Rate Limit:** 100 requests/minute

**Description:** Receive Razorpay webhook events for payment updates.

**Headers:**
```http
x-razorpay-signature: webhook_signature
```

**Events Handled:**
- `payment.authorized` - Payment authorized (not captured yet)
- `payment.captured` - Payment captured successfully
- `payment.failed` - Payment failed
- `order.paid` - Order fully paid

**Response:**
```json
{
  "success": true,
  "data": {
    "received": true
  }
}
```

**Configuration:**
Set webhook URL in Razorpay dashboard:
```
https://yourdomain.com/api/webhook/razorpay
```

Add `RAZORPAY_WEBHOOK_SECRET` to `.env.local`

---

### Upload to IPFS

**Endpoint:** `POST /api/ipfs/upload`  
**Authentication:** None  
**Rate Limit:** 10 requests/minute

**Description:** Upload content to IPFS via Pinata.

**Request Body:**
```json
{
  "content": "String content to upload",
  "name": "My Upload",
  "metadata": {
    "key": "value"
  },
  "encrypt": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ipfsHash": "Qm...",
    "pinSize": 1234,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "encrypted": false,
    "gateway": "https://gateway.pinata.cloud/ipfs/Qm..."
  }
}
```

**Errors:**
- `CONFIGURATION_ERROR` (500) - Pinata JWT not configured
- `VALIDATION_ERROR` (400) - Content too large or invalid
- `UPLOAD_FAILED` (500) - Pinata upload error

---

### Track Analytics Event

**Endpoint:** `POST /api/analytics/track`  
**Authentication:** None  
**Rate Limit:** 100 requests/minute

**Description:** Track user events for analytics.

**Request Body:**
```json
{
  "event": "bookmark_created",
  "userAddress": "0x...",
  "properties": {
    "spaceId": 123,
    "tags": ["web3", "learning"]
  },
  "timestamp": 1234567890
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracked": true,
    "eventId": "1234567890"
  }
}
```

---

### Get Analytics Stats

**Endpoint:** `GET /api/analytics/track`  
**Authentication:** None  
**Rate Limit:** None

**Description:** Get basic analytics statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEvents": 1234,
    "uniqueUsers": 56,
    "eventTypes": {
      "bookmark_created": 500,
      "space_joined": 234,
      "dm_sent": 100
    },
    "recentEvents": [...]
  }
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `PARSE_ERROR` | 400 | Failed to parse request body |
| `INVALID_SIGNATURE` | 400 | Signature verification failed |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `TRANSACTION_NOT_FOUND` | 404 | Blockchain transaction not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `CONFIGURATION_ERROR` | 500 | Server configuration error |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `ORDER_CREATION_FAILED` | 500 | Razorpay order creation failed |
| `UPLOAD_FAILED` | 500 | IPFS upload failed |
| `VERIFICATION_FAILED` | 500 | Verification process failed |

---

## CORS

API supports CORS for allowed origins (configured via `ALLOWED_ORIGINS`).

Development default: `*` (all origins)  
Production: Set specific domains in `.env.local`

---

## Testing

### cURL Examples

**Health Check:**
```powershell
curl http://localhost:3000/api/health
```

**Create Razorpay Order:**
```powershell
curl -X POST http://localhost:3000/api/razorpay/create-order `
  -H "Content-Type: application/json" `
  -d '{"amount":40000,"currency":"INR","purpose":"space_access"}'
```

**Verify Transaction:**
```powershell
curl -X POST http://localhost:3000/api/verify/transaction `
  -H "Content-Type: application/json" `
  -d '{"txHash":"0x..."}'
```

---

## Best Practices

1. **Always check response.success** before accessing data
2. **Handle rate limits** - Implement exponential backoff
3. **Validate inputs** client-side before API calls
4. **Use HTTPS** in production
5. **Never expose** `RAZORPAY_KEY_SECRET` to frontend
6. **Log errors** for debugging
7. **Implement retries** for network errors
8. **Cache responses** when appropriate

---

**Version:** 1.0.0  
**Last Updated:** 2024
