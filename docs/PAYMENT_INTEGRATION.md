# Payment Integration Guide

## Overview

BookSpace supports three payment methods:
1. **Polygon (MATIC)** - Primary blockchain, all smart contracts
2. **Solana (SOL)** - Alternative crypto payments, direct transfers
3. **Razorpay (INR)** - Fiat payments via UPI/Cards/Net Banking

## Using PaymentSelector Component

### Basic Usage

```typescript
import PaymentSelector from '@/components/PaymentSelector';

function MyComponent() {
  const handlePaymentSuccess = (data: PaymentSuccessData) => {
    console.log('Payment successful:', data);
    // Grant access, update UI, etc.
  };

  return (
    <PaymentSelector
      recipientName="Space Owner Name"
      recipientPolygonWallet="0x1234...5678"
      recipientSolanaWallet="ABC...XYZ" // Optional
      amountMatic="5.0"
      amountSol={0.05}
      amountInr={400}
      purpose="space_access"
      onSuccess={handlePaymentSuccess}
      onError={(error) => console.error(error)}
    />
  );
}
```

### Payment Success Data Structure

```typescript
interface PaymentSuccessData {
  method: 'polygon' | 'solana' | 'razorpay';
  transactionHash?: string;  // For blockchain payments
  razorpayPaymentId?: string;  // For Razorpay
  razorpayOrderId?: string;
  razorpaySignature?: string;
  amount: number;
  timestamp: number;
}
```

## Use Cases

### 1. Premium Space Access

```typescript
<PaymentSelector
  recipientName={space.owner.name}
  recipientPolygonWallet={space.owner.wallet}
  recipientSolanaWallet={space.owner.solanaWallet}
  amountMatic={space.priceInMatic}
  amountSol={space.priceInMatic * 0.01} // Rough conversion
  amountInr={space.priceInMatic * 80} // 1 MATIC ≈ ₹80
  purpose="space_access"
  spaceId={space.id}
  onSuccess={(data) => {
    // Call joinSpace after payment verification
    joinSpace(space.id);
  }}
/>
```

### 2. DM Unlock (1 POL)

```typescript
<PaymentSelector
  recipientName={user.name}
  recipientPolygonWallet={user.wallet}
  amountMatic="1.0" // Fixed 1 POL
  amountSol={0.01}
  amountInr={50} // ₹50 equivalent
  purpose="dm_access"
  userId={user.id}
  onSuccess={async (data) => {
    if (data.method === 'polygon') {
      // Smart contract already handled payment
      await purchaseDMAccess(user.wallet);
    } else {
      // For Solana/Razorpay, verify payment then grant access
      await verifyAndGrantDMAccess(data);
    }
  }}
/>
```

### 3. Tipping Content Creator

```typescript
<PaymentSelector
  recipientName={creator.name}
  recipientPolygonWallet={creator.wallet}
  recipientSolanaWallet={creator.solanaWallet}
  amountMatic="0.5"
  amountSol={0.005}
  amountInr={40}
  purpose="tip"
  contentId={bookmark.id}
  onSuccess={(data) => {
    toast.success(`Tip sent via ${data.method}!`);
  }}
/>
```

## Smart Contract Integration

### Polygon Payments (via Smart Contracts)

The PaymentSelector automatically uses the appropriate contract:

**For Space Access:**
```solidity
// BookmarkRegistry.sol
function joinSpace(uint256 spaceId) external payable {
    Space storage space = spaces[spaceId];
    require(msg.value >= space.accessPrice, "Insufficient payment");
    
    // Payment goes to space owner
    payable(space.owner).transfer(msg.value);
    
    // Grant access
    spaceMembers[spaceId][msg.sender] = true;
}
```

**For DM Access:**
```solidity
// DirectMessageRegistry.sol
function purchaseDMAccess(address recipient) external payable {
    require(msg.value >= 1 ether, "Must pay 1 POL");
    
    // Payment goes to recipient
    payable(recipient).transfer(msg.value);
    
    // Grant access
    dmAccess[msg.sender][recipient] = DMAccess({
        hasPaid: true,
        paidAt: block.timestamp
    });
}
```

## Solana Integration (Direct Transfers)

For Solana payments, the component uses simple wallet-to-wallet transfers:

```typescript
import { useSolanaPayments } from '@/hooks/useSolanaTips';

const { sendPayment } = useSolanaPayments();

await sendPayment(
  recipientWallet,  // Solana address
  0.05,             // Amount in SOL
  purpose           // Optional memo
);
```

No smart contracts involved - just direct SystemProgram.transfer().

## Razorpay Integration

### Backend Flow

1. **Create Order** (`/api/razorpay/create-order`)
```typescript
POST /api/razorpay/create-order
{
  amount: 40000,  // Amount in paise (₹400)
  currency: "INR",
  notes: {
    purpose: "space_access",
    spaceId: "123"
  }
}

Response:
{
  orderId: "order_xxx",
  amount: 40000,
  currency: "INR"
}
```

2. **Open Checkout** (Frontend)
```typescript
const razorpay = new Razorpay({
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  order_id: orderId,
  handler: async (response) => {
    // Verify payment signature
    await verifyPayment(response);
  }
});
razorpay.open();
```

3. **Verify Payment** (`/api/razorpay/verify-payment`)
```typescript
POST /api/razorpay/verify-payment
{
  razorpay_order_id: "order_xxx",
  razorpay_payment_id: "pay_xxx",
  razorpay_signature: "signature_xxx"
}

// Server verifies HMAC signature
const generated_signature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(order_id + "|" + payment_id)
  .digest('hex');

if (generated_signature === razorpay_signature) {
  // Payment verified - grant access
}
```

## Price Conversion Reference

| MATIC | SOL | INR (approx) |
|-------|-----|--------------|
| 1.0   | 0.01 | ₹80 |
| 5.0   | 0.05 | ₹400 |
| 10.0  | 0.10 | ₹800 |
| 0.5   | 0.005 | ₹40 |

**Note:** Exchange rates fluctuate. Update conversions regularly or fetch from an oracle.

## Error Handling

```typescript
<PaymentSelector
  // ...props
  onError={(error: PaymentError) => {
    switch (error.code) {
      case 'WALLET_NOT_CONNECTED':
        toast.error('Please connect your wallet');
        break;
      case 'INSUFFICIENT_BALANCE':
        toast.error('Insufficient balance');
        break;
      case 'USER_REJECTED':
        toast.error('Transaction cancelled');
        break;
      case 'RAZORPAY_FAILED':
        toast.error('Payment failed. Please try again.');
        break;
      default:
        toast.error(error.message);
    }
  }}
/>
```

## Testing

### Polygon Mumbai Testnet
- Get free MATIC: https://faucet.polygon.technology/
- Network: Mumbai Testnet
- RPC: https://rpc-mumbai.maticvigil.com/

### Solana Devnet
- Get free SOL: `solana airdrop 2` or https://faucet.solana.com/
- Network: Devnet
- RPC: https://api.devnet.solana.com

### Razorpay Test Mode
Use test card numbers from [Razorpay docs](https://razorpay.com/docs/payments/payments/test-card-details/):
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Security Best Practices

1. **Never expose private keys** - Use environment variables
2. **Verify all payments server-side** - Don't trust client data
3. **Use HTTPS** for Razorpay webhooks
4. **Implement rate limiting** on payment APIs
5. **Log all transactions** for audit trail
6. **Validate amounts** before processing
7. **Handle network failures** gracefully

## Production Checklist

### Polygon
- [ ] Deploy contracts to Polygon mainnet
- [ ] Update contract addresses in environment
- [ ] Test with real MATIC (small amounts first)
- [ ] Verify gas estimation is accurate

### Solana
- [ ] Switch to mainnet-beta RPC
- [ ] Test with real SOL
- [ ] Implement transaction confirmation polling

### Razorpay
- [ ] Complete KYC verification
- [ ] Switch from test to live API keys
- [ ] Set up webhook endpoint with HTTPS
- [ ] Configure payment methods (UPI, Cards)
- [ ] Test end-to-end with real payments
- [ ] Set up settlement bank account

## Support

For issues:
- Polygon: https://support.polygon.technology/
- Solana: https://discord.gg/solana
- Razorpay: https://razorpay.com/support/

---

**Last Updated:** 2024
**Version:** 1.0.0
