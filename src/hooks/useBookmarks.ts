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
  const CONTRACT_ADDR = CONTRACT_ADDRESSES.bookmarkRegistry;

  function ensureContractAddress() {
    if (!CONTRACT_ADDR || CONTRACT_ADDR === '') {
      throw new Error('BookmarkRegistry contract address is not configured. Please set NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS in your .env.local');
    }
  }

  // Read user bookmarks - only if contract address is set
  const { data: userBookmarkIds, refetch: refetchBookmarks } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}` | undefined,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getUserBookmarks',
    args: address ? [address] : undefined,
    query: {
      enabled: !!(CONTRACT_ADDR && address), // Only run query if both are set
      refetchOnMount: 'always', // Always refetch when component mounts
      staleTime: 0, // Consider data immediately stale
    },
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
  ensureContractAddress();
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDR as `0x${string}`,
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
  ensureContractAddress();
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDR as `0x${string}`,
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
    ensureContractAddress();
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDR as `0x${string}`,
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
  const CONTRACT_ADDR = CONTRACT_ADDRESSES.bookmarkRegistry;

  // Read user spaces - only if contract address is set
  const { data: userSpaceIds, refetch: refetchSpaces } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}` | undefined,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getUserSpaces',
    args: address ? [address] : undefined,
    query: {
      enabled: !!(CONTRACT_ADDR && address), // Only run query if both are set
      refetchOnMount: 'always', // Always refetch when component mounts
      staleTime: 0, // Consider data immediately stale
    },
  });

  // Debug logging
  console.log('useSpaces - address:', address);
  console.log('useSpaces - CONTRACT_ADDR:', CONTRACT_ADDR);
  console.log('useSpaces - userSpaceIds:', userSpaceIds);

  // Create space
  const createSpace = async (
    name: string,
    description: string,
    isPublic: boolean,
    accessPrice: string
  ) => {
    if (!address) throw new Error('Wallet not connected');
    if (!CONTRACT_ADDR || CONTRACT_ADDR === '') {
      throw new Error('BookmarkRegistry contract address is not configured. Please set NEXT_PUBLIC_BOOKMARK_REGISTRY_ADDRESS in your .env.local');
    }
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDR as `0x${string}`,
        abi: BOOKMARK_REGISTRY_ABI,
        functionName: 'createSpace',
        args: [name, description, isPublic, parseEther(accessPrice)],
      });
      
      // Wait a moment for blockchain state to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refetchSpaces();
      
      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  // Join space
  const joinSpace = async (spaceId: number, paymentAmount: string) => {
    if (!address) throw new Error('Wallet not connected');
    const CONTRACT_ADDR = CONTRACT_ADDRESSES.bookmarkRegistry;
    if (!CONTRACT_ADDR || CONTRACT_ADDR === '') {
      throw new Error('BookmarkRegistry contract address is not configured');
    }
    
    setIsLoading(true);
    try {
      // Set deadline to 10 minutes from now to prevent front-running
      const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDR as `0x${string}`,
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
    const CONTRACT_ADDR = CONTRACT_ADDRESSES.bookmarkRegistry;
    if (!CONTRACT_ADDR || CONTRACT_ADDR === '') {
      throw new Error('BookmarkRegistry contract address is not configured');
    }
    
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDR as `0x${string}`,
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
  const CONTRACT_ADDR = CONTRACT_ADDRESSES.bookmarkRegistry;
  
  const { data: bookmark, refetch, isLoading, error } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}` | undefined,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getBookmark',
    args: [BigInt(bookmarkId)],
    query: {
      enabled: !!(CONTRACT_ADDR && bookmarkId), // Only run if contract address exists
    },
  });

  // Debug logging
  console.log('useBookmark - bookmarkId:', bookmarkId);
  console.log('useBookmark - raw data:', bookmark);
  console.log('useBookmark - isLoading:', isLoading);
  console.log('useBookmark - error:', error);

  // Convert the tuple data to proper Bookmark object
  let parsedBookmark: Bookmark | null = null;
  if (bookmark && Array.isArray(bookmark)) {
    parsedBookmark = {
      id: Number(bookmark[0]),
      url: bookmark[1],
      title: bookmark[2],
      description: bookmark[3],
      tags: bookmark[4],
      owner: bookmark[5],
      spaceId: Number(bookmark[6]),
      timestamp: Number(bookmark[7]),
      ipfsHash: bookmark[8],
      isDeleted: bookmark[9],
    };
    console.log('useBookmark - parsed bookmark:', parsedBookmark);
  }

  return {
    bookmark: parsedBookmark,
    refetch,
    isLoading,
    error,
  };
}

export function useSpace(spaceId: number) {
  const CONTRACT_ADDR = CONTRACT_ADDRESSES.bookmarkRegistry;
  
  const { data: space, refetch, isLoading, error } = useReadContract({
    address: CONTRACT_ADDR as `0x${string}` | undefined,
    abi: BOOKMARK_REGISTRY_ABI,
    functionName: 'getSpace',
    args: [BigInt(spaceId)],
    query: {
      enabled: !!(CONTRACT_ADDR && spaceId), // Only run if contract address exists
    },
  });

  // Debug logging
  console.log('useSpace - spaceId:', spaceId);
  console.log('useSpace - raw data:', space);
  console.log('useSpace - isLoading:', isLoading);
  console.log('useSpace - error:', error);

  // Convert the tuple data to proper Space object
  let parsedSpace: Space | null = null;
  if (space && Array.isArray(space)) {
    parsedSpace = {
      id: Number(space[0]),
      name: space[1],
      description: space[2],
      owner: space[3],
      isPublic: space[4],
      accessPrice: space[5],
      memberCount: Number(space[6]),
      createdAt: Number(space[7]),
      isActive: space[8],
    };
    console.log('useSpace - parsed space:', parsedSpace);
  }

  return {
    space: parsedSpace,
    refetch,
    isLoading,
    error,
  };
}
