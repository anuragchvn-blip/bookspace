import { NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import {
  successResponse,
  errorResponse,
  validateRequest,
  withApiMiddleware,
} from '@/lib/api-utils';

// Validation schema
const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  purpose: z.enum(['space_access', 'dm_access', 'tip', 'other']).optional(),
  metadata: z.record(z.any()).optional(),
});

async function handler(request: NextRequest) {
  // Check configuration
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return errorResponse(
      'CONFIGURATION_ERROR',
      'Razorpay key secret not configured',
      500
    );
  }

  // Validate request
  const { data, error } = await validateRequest(request, verifyPaymentSchema);
  if (error) return error;

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    purpose,
    metadata,
  } = data;

  try {
    // Generate expected signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', {
        expected: generatedSignature,
        received: razorpay_signature,
      });

      return errorResponse(
        'INVALID_SIGNATURE',
        'Payment signature verification failed. This payment may be fraudulent.',
        400
      );
    }

    // Payment verified successfully
    console.log('Payment verified successfully:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      purpose,
    });

    // TODO: Implement post-payment actions based on purpose
    // - space_access: Grant space access in database
    // - dm_access: Record DM access grant
    // - tip: Record tip transaction
    
    // Example: Grant access based on purpose
    if (purpose === 'space_access' && metadata?.spaceId && metadata?.userAddress) {
      await grantSpaceAccess(metadata.userAddress, metadata.spaceId);
    } else if (purpose === 'dm_access' && metadata?.recipientAddress && metadata?.userAddress) {
      await grantDMAccess(metadata.userAddress, metadata.recipientAddress);
    }

    return successResponse({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      purpose,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    
    return errorResponse(
      'VERIFICATION_FAILED',
      'Failed to verify payment',
      500,
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

// Helper functions (implement based on your database/storage)
async function grantSpaceAccess(userAddress: string, spaceId: string) {
  console.log(`TODO: Grant space ${spaceId} access to ${userAddress}`);
  // Implementation:
  // - Update Supabase with access record
  // - Cache access status
  // - Emit event for frontend
}

async function grantDMAccess(userAddress: string, recipientAddress: string) {
  console.log(`TODO: Grant DM access from ${userAddress} to ${recipientAddress}`);
  // Implementation:
  // - Update database with DM access record
  // - Cache access status
  // - Send notification to recipient
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 20, windowMs: 60000 }, // 20 verifications per minute
});