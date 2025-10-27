// Blockchain utility functions for backend

// @ts-nocheck - Viem v2 type compatibility
import { createPublicClient, http, parseAbi } from 'viem';
import { polygonMumbai } from 'viem/chains';

/**
 * Create a Viem public client for reading blockchain data
 */
export function getPolygonClient() {
  const rpcUrl = process.env.NEXT_PUBLIC_POLYGON_RPC_URL || 'https://rpc-mumbai.maticvigil.com';
  
  return createPublicClient({
    chain: polygonMumbai,
    transport: http(rpcUrl),
  });
}

/**
 * Verify a transaction exists on-chain
 */
export async function verifyTransaction(txHash: string): Promise<{
  verified: boolean;
  blockNumber?: bigint;
  from?: string;
  to?: string;
  value?: bigint;
}> {
  try {
    const client = getPolygonClient();
    const receipt = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    if (!receipt) {
      return { verified: false };
    }

    return {
      verified: receipt.status === 'success',
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to || undefined,
    };
  } catch (error) {
    console.error('Transaction verification failed:', error);
    return { verified: false };
  }
}

/**
 * Verify bookmark ownership
 */
export async function verifyBookmarkOwnership(
  bookmarkId: number,
  ownerAddress: string
): Promise<boolean> {
  try {
    const client = getPolygonClient();
    const contractAddress = process.env.NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS;

    if (!contractAddress) {
      console.warn('BOOKMARK_REGISTRY_ADDRESS not configured');
      return false;
    }

    const bookmark = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: parseAbi([
        'function getBookmark(uint256 bookmarkId) view returns (tuple(uint256 id, address owner, string url, string title, string description, string[] tags, uint256 spaceId, string ipfsHash, uint256 createdAt))',
      ]),
      functionName: 'getBookmark',
      args: [BigInt(bookmarkId)],
    });

    return bookmark.owner.toLowerCase() === ownerAddress.toLowerCase();
  } catch (error) {
    console.error('Bookmark ownership verification failed:', error);
    return false;
  }
}

/**
 * Verify space access
 */
export async function verifySpaceAccess(
  spaceId: number,
  userAddress: string
): Promise<boolean> {
  try {
    const client = getPolygonClient();
    const contractAddress = process.env.NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS;

    if (!contractAddress) {
      console.warn('BOOKMARK_REGISTRY_ADDRESS not configured');
      return false;
    }

    const hasAccess = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: parseAbi([
        'function checkSpaceAccess(address user, uint256 spaceId) view returns (bool)',
      ]),
      functionName: 'checkSpaceAccess',
      args: [userAddress as `0x${string}`, BigInt(spaceId)],
    });

    return hasAccess;
  } catch (error) {
    console.error('Space access verification failed:', error);
    return false;
  }
}

/**
 * Verify DM access
 */
export async function verifyDMAccess(
  sender: string,
  recipient: string
): Promise<boolean> {
  try {
    const client = getPolygonClient();
    const contractAddress = process.env.NEXT_PUBLIC_DM_REGISTRY_ADDRESS;

    if (!contractAddress) {
      console.warn('DM_REGISTRY_ADDRESS not configured');
      return false;
    }

    const dmAccess = await client.readContract({
      address: contractAddress as `0x${string}`,
      abi: parseAbi([
        'function checkDMAccess(address sender, address recipient) view returns (bool)',
      ]),
      functionName: 'checkDMAccess',
      args: [sender as `0x${string}`, recipient as `0x${string}`],
    });

    return dmAccess;
  } catch (error) {
    console.error('DM access verification failed:', error);
    return false;
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(address: string): Promise<bigint> {
  try {
    const client = getPolygonClient();
    const balance = await client.getBalance({
      address: address as `0x${string}`,
    });
    return balance;
  } catch (error) {
    console.error('Failed to get wallet balance:', error);
    return BigInt(0);
  }
}

/**
 * Format MATIC amount from wei
 */
export function formatMatic(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4);
}

/**
 * Parse MATIC amount to wei
 */
export function parseMatic(matic: string): bigint {
  return BigInt(Math.floor(parseFloat(matic) * 1e18));
}
