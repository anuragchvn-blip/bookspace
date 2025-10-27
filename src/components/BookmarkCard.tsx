// @ts-nocheck - Next.js client component props
'use client';

import { Bookmark as BookmarkType } from '@/types';
import { shortenAddress, formatTimestamp } from '@/lib/utils';
import { ExternalLink, Edit, Trash2, Tag } from 'lucide-react';
import Link from 'next/link';
import { UserBadge } from './UserProfileCard';

interface BookmarkCardProps {
  bookmark: BookmarkType;
  onEdit?: (bookmark: BookmarkType) => void;
  onDelete?: (id: number) => void;
  isOwner?: boolean;
}

export function BookmarkCard({ bookmark, onEdit, onDelete, isOwner }: BookmarkCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2">
        <div className="flex-1 w-full sm:w-auto">
          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-1 break-words">
            {bookmark.title || bookmark.url}
          </h3>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 break-all"
          >
            {new URL(bookmark.url).hostname}
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        </div>
        
        {isOwner && (
          <div className="flex gap-2 self-end sm:self-start">
            {onEdit && (
              <button
                onClick={() => onEdit(bookmark)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                aria-label="Edit bookmark"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(bookmark.id)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {bookmark.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
          {bookmark.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
            >
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-none">{tag}</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 gap-1 sm:gap-0">
        <span className="truncate">{formatTimestamp(bookmark.timestamp)}</span>
        <UserBadge address={bookmark.owner} showAvatar={false} />
      </div>
    </div>
  );
}

export function BookmarkGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {children}
    </div>
  );
}

export function EmptyBookmarks() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <Tag className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
      <p className="text-gray-600 mb-4">Start saving your favorite links and resources</p>
      <Link
        href="/create"
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Create Your First Bookmark
      </Link>
    </div>
  );
}
