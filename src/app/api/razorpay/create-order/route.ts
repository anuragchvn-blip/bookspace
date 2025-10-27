import { NextRequest } from 'next/server';
import { z } from 'zod';
import Razorpay from 'razorpay';
import {
  successResponse,
  errorResponse,
  validateRequest,
  withApiMiddleware,
} from '@/lib/api-utils';

// Validation schema
const createOrderSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  purpose: z.enum(['space_access', 'dm_access', 'tip', 'other']),
  metadata: z.record(z.any()).optional(),
});

async function handler(request: NextRequest) {
  // Check Razorpay configuration
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return errorResponse(
      'CONFIGURATION_ERROR',
      'Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.',
      500
    );
  }

  // Validate request
  const { data, error } = await validateRequest(request, createOrderSchema);
  if (error) return error;

  const { amount, currency, purpose, metadata } = data;

  try {
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // Amount in paise (must be integer)
      currency,
      receipt: `rcpt_${Date.now()}_${purpose}`,
      notes: {
        purpose,
        timestamp: Date.now(),
        ...metadata,
      },
    });

    return successResponse({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      createdAt: order.created_at,
    });
  } catch (error: any) {
    console.error('Razorpay order creation failed:', error);
    
    return errorResponse(
      'ORDER_CREATION_FAILED',
      error.error?.description || error.message || 'Failed to create Razorpay order',
      500,
      process.env.NODE_ENV === 'development' ? error : undefined
    );
  }
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 10, windowMs: 60000 }, // 10 orders per minute
});