// Razorpay webhook handler

import { NextRequest } from 'next/server';
import crypto from 'crypto';
import {
  successResponse,
  errorResponse,
  withApiMiddleware,
} from '@/lib/api-utils';

async function handler(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured');
    return errorResponse('CONFIGURATION_ERROR', 'Webhook secret not configured', 500);
  }

  // Get signature from headers
  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) {
    return errorResponse('MISSING_SIGNATURE', 'Webhook signature missing', 400);
  }

  // Get raw body
  const body = await request.text();

  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    console.error('Invalid webhook signature');
    return errorResponse('INVALID_SIGNATURE', 'Webhook signature verification failed', 400);
  }

  // Parse verified webhook payload
  const payload = JSON.parse(body);
  const event = payload.event;

  console.log('Razorpay webhook received:', event);

  // Handle different webhook events
  switch (event) {
    case 'payment.authorized':
      await handlePaymentAuthorized(payload);
      break;

    case 'payment.captured':
      await handlePaymentCaptured(payload);
      break;

    case 'payment.failed':
      await handlePaymentFailed(payload);
      break;

    case 'order.paid':
      await handleOrderPaid(payload);
      break;

    default:
      console.log('Unhandled webhook event:', event);
  }

  return successResponse({ received: true });
}

async function handlePaymentAuthorized(payload: any) {
  const payment = payload.payload.payment.entity;
  console.log('Payment authorized:', payment.id);
  
  // TODO: Update database with payment authorization
  // - Mark order as authorized
  // - Don't grant access yet (wait for capture)
}

async function handlePaymentCaptured(payload: any) {
  const payment = payload.payload.payment.entity;
  console.log('Payment captured:', payment.id);
  
  // TODO: Update database and grant access
  // - Mark payment as completed
  // - Grant space/DM access
  // - Send confirmation email/notification
  
  // Example: Grant access based on notes
  const notes = payment.notes;
  if (notes.purpose === 'space_access' && notes.spaceId) {
    await grantSpaceAccess(notes.userAddress, notes.spaceId);
  } else if (notes.purpose === 'dm_access' && notes.recipientAddress) {
    await grantDMAccess(notes.userAddress, notes.recipientAddress);
  }
}

async function handlePaymentFailed(payload: any) {
  const payment = payload.payload.payment.entity;
  console.log('Payment failed:', payment.id, payment.error_description);
  
  // TODO: Update database with failure
  // - Mark payment as failed
  // - Log error reason
  // - Send notification to user
}

async function handleOrderPaid(payload: any) {
  const order = payload.payload.order.entity;
  console.log('Order paid:', order.id);
  
  // TODO: Handle order completion
  // - Verify all payments captured
  // - Grant access if not already done
}

// Helper functions (implement based on your database)
async function grantSpaceAccess(userAddress: string, spaceId: string) {
  console.log(`Granting space ${spaceId} access to ${userAddress}`);
  // TODO: Implement space access grant
  // - Update Supabase/database with access record
  // - Cache access status
}

async function grantDMAccess(userAddress: string, recipientAddress: string) {
  console.log(`Granting DM access from ${userAddress} to ${recipientAddress}`);
  // TODO: Implement DM access grant
  // - Update database with DM access record
  // - Cache access status
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 100, windowMs: 60000 },
});
