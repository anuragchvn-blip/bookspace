// Verify user access to resources (spaces, DMs)

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  successResponse,
  errorResponse,
  validateRequest,
  withApiMiddleware,
  isValidEthAddress,
} from '@/lib/api-utils';
import {
  verifySpaceAccess,
  verifyDMAccess,
  verifyBookmarkOwnership,
} from '@/lib/blockchain-utils';

const verifyAccessSchema = z.object({
  type: z.enum(['space', 'dm', 'bookmark']),
  userAddress: z.string().refine(isValidEthAddress, 'Invalid Ethereum address'),
  resourceId: z.union([z.number(), z.string()]).optional(),
  targetAddress: z.string().refine(isValidEthAddress, 'Invalid Ethereum address').optional(),
});

async function handler(request: NextRequest) {
  // Validate request
  const { data, error } = await validateRequest(request, verifyAccessSchema);
  if (error) return error;

  const { type, userAddress, resourceId, targetAddress } = data;

  let hasAccess = false;
  let details: any = {};

  try {
    switch (type) {
      case 'space':
        if (typeof resourceId !== 'number') {
          return errorResponse('INVALID_RESOURCE_ID', 'Space ID must be a number', 400);
        }
        hasAccess = await verifySpaceAccess(resourceId, userAddress);
        details = { spaceId: resourceId, member: hasAccess };
        break;

      case 'dm':
        if (!targetAddress) {
          return errorResponse('MISSING_TARGET', 'Target address is required for DM access', 400);
        }
        hasAccess = await verifyDMAccess(userAddress, targetAddress);
        details = { sender: userAddress, recipient: targetAddress, paid: hasAccess };
        break;

      case 'bookmark':
        if (typeof resourceId !== 'number') {
          return errorResponse('INVALID_RESOURCE_ID', 'Bookmark ID must be a number', 400);
        }
        hasAccess = await verifyBookmarkOwnership(resourceId, userAddress);
        details = { bookmarkId: resourceId, owner: hasAccess };
        break;

      default:
        return errorResponse('INVALID_TYPE', 'Invalid access type', 400);
    }

    return successResponse({
      hasAccess,
      type,
      userAddress,
      ...details,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Access verification error:', error);
    return errorResponse(
      'VERIFICATION_FAILED',
      'Failed to verify access on-chain',
      500
    );
  }
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 30, windowMs: 60000 },
});
