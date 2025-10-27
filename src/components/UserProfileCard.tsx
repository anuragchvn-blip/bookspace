'use client';

import { User, ExternalLink, Twitter, Github, Globe } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import Link from 'next/link';
import Image from 'next/image';

interface UserProfileCardProps {
  address: string;
  showStats?: boolean;
  showSocial?: boolean;
}

export function UserProfileCard({ address, showStats = true, showSocial = true }: UserProfileCardProps) {
  const { profile, isLoading } = useProfile(address);

  if (isLoading) {
    return (
      <div className="bg-black/40 border-2 border-gray-800 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-800"></div>
          <div className="flex-1">
            <div className="h-5 w-32 bg-gray-800 mb-2"></div>
            <div className="h-4 w-48 bg-gray-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-black/40 border-2 border-gray-800 p-6 hover:border-cyan-400 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 overflow-hidden flex items-center justify-center">
            {profile.avatar ? (
              <Image src={profile.avatar} alt={profile.username} width={64} height={64} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-gray-600" />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-white truncate">
                {profile.displayName || profile.username}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                @{profile.username}
              </p>
            </div>
            
            {profile.isVerified && (
              <div className="flex-shrink-0 bg-cyan-900/30 border border-cyan-700 px-2 py-1 rounded">
                <span className="text-xs text-cyan-400 font-mono">✓ VERIFIED</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-gray-300 mt-2 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>{profile.bookmarksCount} Bookmarks</span>
              <span>{profile.spacesCount} Spaces</span>
              <span>{profile.membersCount} Members</span>
            </div>
          )}

          {/* Social Links */}
          {showSocial && (profile.twitter || profile.github || profile.website) && (
            <div className="flex gap-2 mt-3">
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

          {/* Wallet Address */}
          <p className="text-xs text-gray-600 font-mono mt-2 truncate">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact version for inline display
interface UserBadgeProps {
  address: string;
  showAvatar?: boolean;
}

export function UserBadge({ address, showAvatar = true }: UserBadgeProps) {
  const { profile } = useProfile(address);

  return (
    <div className="inline-flex items-center gap-2">
      {showAvatar && (
        <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 overflow-hidden flex items-center justify-center flex-shrink-0">
          {profile?.avatar ? (
            <Image src={profile.avatar} alt={profile.username} width={24} height={24} className="w-full h-full object-cover" />
          ) : (
            <User className="w-3 h-3 text-gray-600" />
          )}
        </div>
      )}
      <span className="text-sm font-medium">
        {profile?.displayName || profile?.username || `${address.slice(0, 6)}...${address.slice(-4)}`}
      </span>
      {profile?.isVerified && (
        <span className="text-cyan-400 text-xs">✓</span>
      )}
    </div>
  );
}
