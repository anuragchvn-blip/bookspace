// Verify blockchain transaction

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  successResponse,
  errorResponse,
  validateRequest,
  withApiMiddleware,
} from '@/lib/api-utils';
import { verifyTransaction } from '@/lib/blockchain-utils';

const verifyTransactionSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  expectedFrom: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  expectedTo: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
});

async function handler(request: NextRequest) {
  // Validate request
  const { data, error } = await validateRequest(request, verifyTransactionSchema);
  if (error) return error;

  const { txHash, expectedFrom, expectedTo } = data;

  // Verify transaction on-chain
  const verification = await verifyTransaction(txHash);

  if (!verification.verified) {
    return errorResponse(
      'TRANSACTION_NOT_FOUND',
      'Transaction not found or failed',
      404
    );
  }

  // Additional verification checks
  if (expectedFrom && verification.from?.toLowerCase() !== expectedFrom.toLowerCase()) {
    return errorResponse(
      'SENDER_MISMATCH',
      'Transaction sender does not match expected address',
      400
    );
  }

  if (expectedTo && verification.to?.toLowerCase() !== expectedTo.toLowerCase()) {
    return errorResponse(
      'RECIPIENT_MISMATCH',
      'Transaction recipient does not match expected address',
      400
    );
  }

  return successResponse({
    verified: true,
    transaction: {
      hash: txHash,
      blockNumber: verification.blockNumber?.toString(),
      from: verification.from,
      to: verification.to,
    },
  });
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 20, windowMs: 60000 },
});
