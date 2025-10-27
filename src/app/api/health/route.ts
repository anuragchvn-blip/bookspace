// Health check endpoint

import { NextRequest } from 'next/server';
import { successResponse, withApiMiddleware } from '@/lib/api-utils';
import { getPolygonClient } from '@/lib/blockchain-utils';

async function handler(request: NextRequest) {
  const startTime = Date.now();

  // Check blockchain connectivity
  let blockchainStatus = 'disconnected';
  let blockNumber = 0;

  try {
    const client = getPolygonClient();
    const currentBlock = await client.getBlockNumber();
    blockNumber = Number(currentBlock);
    blockchainStatus = 'connected';
  } catch (error) {
    console.error('Blockchain health check failed:', error);
  }

  // Check environment variables
  const envStatus = {
    polygon: {
      rpcUrl: !!process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
      bookmarkRegistry: !!process.env.NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS,
      dmRegistry: !!process.env.NEXT_PUBLIC_DM_REGISTRY_ADDRESS,
    },
    solana: {
      rpcUrl: !!process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    },
    razorpay: {
      keyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keySecret: !!process.env.RAZORPAY_KEY_SECRET,
    },
    ipfs: {
      pinataJwt: !!process.env.NEXT_PUBLIC_PINATA_JWT,
      pinataGateway: !!process.env.NEXT_PUBLIC_PINATA_GATEWAY,
    },
  };

  const responseTime = Date.now() - startTime;

  return successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    responseTime: `${responseTime}ms`,
    blockchain: {
      status: blockchainStatus,
      blockNumber,
      network: 'Mumbai Testnet',
    },
    environment: {
      node: process.env.NODE_ENV || 'development',
      configured: envStatus,
    },
  });
}

export const GET = withApiMiddleware(handler);
