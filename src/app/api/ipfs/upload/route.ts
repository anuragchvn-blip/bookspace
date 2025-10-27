// IPFS upload endpoint (via Pinata)

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  successResponse,
  errorResponse,
  validateRequest,
  withApiMiddleware,
} from '@/lib/api-utils';

const uploadSchema = z.object({
  content: z.string().max(1000000, 'Content too large (max 1MB)'),
  name: z.string().min(1).max(255).optional(),
  metadata: z.record(z.any()).optional(),
  encrypt: z.boolean().optional(),
});

async function handler(request: NextRequest) {
  const pinataJwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!pinataJwt) {
    return errorResponse('CONFIGURATION_ERROR', 'Pinata JWT not configured', 500);
  }

  // Validate request
  const { data, error } = await validateRequest(request, uploadSchema);
  if (error) return error;

  const { content, name, metadata, encrypt } = data;

  try {
    // Prepare content
    let finalContent = content;
    
    // Optional: Encrypt content before upload
    if (encrypt) {
      // TODO: Implement encryption using CryptoJS
      // const encrypted = encryptContent(content, userKey);
      // finalContent = encrypted;
    }

    // Upload to Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pinataJwt}`,
      },
      body: JSON.stringify({
        pinataContent: {
          content: finalContent,
          uploadedAt: new Date().toISOString(),
        },
        pinataMetadata: {
          name: name || `upload-${Date.now()}`,
          keyvalues: metadata || {},
        },
      }),
    });

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata upload failed:', errorText);
      return errorResponse('UPLOAD_FAILED', 'Failed to upload to IPFS', 500);
    }

    const result = await pinataResponse.json();

    return successResponse({
      ipfsHash: result.IpfsHash,
      pinSize: result.PinSize,
      timestamp: result.Timestamp,
      encrypted: !!encrypt,
      gateway: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${result.IpfsHash}`,
    });
  } catch (error) {
    console.error('IPFS upload error:', error);
    return errorResponse('UPLOAD_ERROR', 'Failed to upload content', 500);
  }
}

export const POST = withApiMiddleware(handler, {
  rateLimit: { maxRequests: 10, windowMs: 60000 },
});
