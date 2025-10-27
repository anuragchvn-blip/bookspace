'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/profile';

export function useProfile(address?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/profile?address=${address}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
        // Return default profile on error
        setProfile({
          address: address.toLowerCase(),
          username: `user_${address.slice(2, 8)}`,
          displayName: `${address.slice(0, 6)}...${address.slice(-4)}`,
          bio: '',
          bookmarksCount: 0,
          spacesCount: 0,
          membersCount: 0,
          joinedAt: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [address]);

  return { profile, isLoading, error };
}

// Format address to display name
export function formatUserDisplay(address: string, profile?: UserProfile | null): string {
  if (profile?.displayName) {
    return profile.displayName;
  }
  if (profile?.username) {
    return `@${profile.username}`;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
