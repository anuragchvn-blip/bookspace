// @ts-nocheck - Wagmi v2 type compatibility
'use client';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESSES } from '@/config/constants';
import { BOOKMARK_REGISTRY_ABI } from '@/contracts/abis';
import { Bookmark, Space } from '@/types';
import { useState } from 'react';

export function useBookmarks() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  // Read user bookmarks
  const { data: userBookmarkIds, refetch: refetchBookmarks } = useReadContract({
    address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getUserBookmarks',
    args: address ? [address] : undefined,
  });

  // Create bookmark
  const createBookmark = async (
    url: string,
    title: string,
    description: string,
    tags: string[],
    spaceId: number,
    ipfsHash: string
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'createBookmark',
        args: [url, title, description, tags, BigInt(spaceId), ipfsHash],
      });
      
      await refetchBookmarks();
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Update bookmark
  const updateBookmark = async (
    bookmarkId: number,
    url: string,
    title: string,
    description: string,
    tags: string[],
    ipfsHash: string
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'updateBookmark',
        args: [BigInt(bookmarkId), url, title, description, tags, ipfsHash],
      });
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete bookmark
  const deleteBookmark = async (bookmarkId: number) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'deleteBookmark',
        args: [BigInt(bookmarkId)],
      });
      
      await refetchBookmarks();
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userBookmarkIds: (userBookmarkIds as bigint[]) || [],
    createBookmark,
    updateBookmark,
    deleteBookmark,
    refetchBookmarks,
    isLoading,
  };
}

export function useSpaces() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  // Read user spaces
  const { data: userSpaceIds, refetch: refetchSpaces } = useReadContract({
    address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getUserSpaces',
    args: address ? [address] : undefined,
  });

  // Create space
  const createSpace = async (
    name: string,
    description: string,
    isPublic: boolean,
    accessPrice: string
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'createSpace',
        args: [name, description, isPublic, parseEther(accessPrice)],
      });
      
      await refetchSpaces();
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Join space
  const joinSpace = async (spaceId: number, paymentAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      // Set deadline to 10 minutes from now to prevent front-running
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'joinSpace',
        args: [BigInt(spaceId), BigInt(deadline)],
        value: parseEther(paymentAmount),
      });
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Update space
  const updateSpace = async (
    spaceId: number,
    name: string,
    description: string,
    isPublic: boolean,
    accessPrice: string
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'updateSpace',
        args: [BigInt(spaceId), name, description, isPublic, parseEther(accessPrice)],
      });
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userSpaceIds: (userSpaceIds as bigint[]) || [],
    createSpace,
    joinSpace,
    updateSpace,
    refetchSpaces,
    isLoading,
  };
}

export function useBookmark(bookmarkId: number) {
  const { data: bookmark, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getBookmark',
    args: [BigInt(bookmarkId)],
  });

  return {
    bookmark: bookmark as unknown as Bookmark,
    refetch,
  };
}

export function useSpace(spaceId: number) {
  const { data: space, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.bookmarkRegistry as `0x${string}`,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getSpace',
    args: [BigInt(spaceId)],
  });

  return {
    space: space as unknown as Space,
    refetch,
  };
}
