// @ts-nocheck - Next.js client component props
'use client';

import { Space } from '@/types';
import { shortenAddress, formatEther } from '@/lib/utils';
import { Lock, Users, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';
import { UserBadge } from './UserProfileCard';

interface SpaceCardProps {
  space: Space;
  onJoin?: (spaceId: number, price: string) => void;
  isMember?: boolean;
  isOwner?: boolean;
}

export function SpaceCard({ space, onJoin, isMember, isOwner }: SpaceCardProps) {
  const priceInMatic = formatEther(space.accessPrice);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-bold text-lg sm:text-xl break-words">{space.name}</h3>
            {isOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                <Crown className="w-3 h-3 flex-shrink-0" />
                Owner
              </span>
            )}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            <UserBadge address={space.owner} showAvatar={true} />
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
          {space.isPublic ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
              Public
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium whitespace-nowrap">
              <Lock className="w-3 h-3 flex-shrink-0" />
              Premium
            </span>
          )}
          
          {!space.isPublic && space.accessPrice > 0n && (
            <span className="text-xs sm:text-sm font-semibold text-polygon whitespace-nowrap">
              {priceInMatic} MATIC
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {space.description}
      </p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{space.memberCount} members</span>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{new Date(space.createdAt * 1000).toLocaleDateString()}</span>
            <span className="sm:hidden">{new Date(space.createdAt * 1000).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href={`/space/${space.id}`}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex-1 sm:flex-none text-center"
          >
            View
          </Link>
          
          {!isMember && !isOwner && onJoin && (
            <button
              onClick={() => onJoin(space.id, priceInMatic)}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-1 sm:flex-none whitespace-nowrap"
            >
              {space.isPublic ? 'Join Free' : `Join ${priceInMatic} MATIC`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SpaceGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {children}
    </div>
  );
}

export function EmptySpaces() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Users className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No spaces found</h3>
      <p className="text-gray-600 mb-4">Create your first space to organize bookmarks</p>
      <Link
        href="/create"
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Create Space
      </Link>
    </div>
  );
}
