// @ts-nocheck - Wagmi v2 type compatibility
'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESSES, DM_ACCESS_PRICE } from '@/config/constants';
import { DM_REGISTRY_ABI } from '@/contracts/abis';
import { DMAccess, Message } from '@/types';
import { useState } from 'react';

export function useDirectMessages() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  // Check DM access - Note: This should be called from a component using useReadContract
  // For now, we'll return a function that components can use
  const checkAccess = async (sender: string, recipient: string): Promise<boolean> => {
    try {
      // This should be handled by the component using useReadContract hook directly
      return false;
    } catch {
      return false;
    }
  };

  // Purchase DM access
  const purchaseAccess = async (recipient: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      // Set deadline to 10 minutes from now to prevent front-running
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.dmRegistry as `0x${string}`,
        abi: DM_REGISTRY_ABI,
        functionName: 'purchaseDMAccess',
        args: [recipient as `0x${string}`, BigInt(deadline)],
        value: parseEther('1'), // 1 POL
      });
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async (recipient: string, ipfsHash: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.dmRegistry as `0x${string}`,
        abi: DM_REGISTRY_ABI,
        functionName: 'sendMessage',
        args: [recipient as `0x${string}`, ipfsHash],
      });
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Revoke access
  const revokeAccess = async (recipient: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.dmRegistry as `0x${string}`,
        abi: DM_REGISTRY_ABI,
        functionName: 'revokeDMAccess',
        args: [recipient as `0x${string}`],
      });
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkAccess,
    purchaseAccess,
    sendMessage,
    revokeAccess,
    isLoading,
    accessPrice: DM_ACCESS_PRICE,
  };
}

export function useInbox() {
  const { address } = useAccount();

  const { data: inboxIds, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.dmRegistry as `0x${string}`,
    abi: DM_REGISTRY_ABI,
    functionName: 'getInbox',
    args: address ? [address] : undefined,
  });

  return {
    inboxIds: (inboxIds as bigint[]) || [],
    refetch,
  };
}

export function useConversation(otherAddress: string) {
  const { address } = useAccount();

  const { data: messageIds, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.dmRegistry as `0x${string}`,
    abi: DM_REGISTRY_ABI,
    functionName: 'getConversation',
    args: address && otherAddress ? [address, otherAddress as `0x${string}`] : undefined,
  });

  return {
    messageIds: (messageIds as bigint[]) || [],
    refetch,
  };
}
