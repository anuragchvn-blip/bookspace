'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useBookmarks, useSpaces, useSpace, useBookmark } from '@/hooks/useBookmarks';
import { WalletConnect, ConnectWalletButton } from '@/components/WalletConnect';
import { BookmarkCard, BookmarkGrid, EmptyBookmarks } from '@/components/BookmarkCard';
import { SpaceCard, SpaceGrid } from '@/components/SpaceCard';
import { Bookmark, Layers, Plus, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { userBookmarkIds } = useBookmarks();
  const { userSpaceIds } = useSpaces();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug logging
  console.log('Dashboard - Connected:', isConnected);
  console.log('Dashboard - Address:', address);
  console.log('Dashboard - userSpaceIds:', userSpaceIds);
  console.log('Dashboard - userBookmarkIds:', userBookmarkIds);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded border border-gray-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0d0d0d] border-r border-gray-800 
        flex flex-col p-6 z-40 transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Link href="/" className="mb-12">
          <h1 className="text-2xl font-bold tracking-wider">BOOKSPACE</h1>
          <p className="text-xs text-gray-500 mt-1">DECENTRALIZED BOOKMARKING</p>
        </Link>
        
        <nav className="flex-1 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-white bg-gray-800 px-3 py-2 rounded">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/spaces" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded">
            <Layers className="w-4 h-4" />
            <span className="text-sm">My Spaces</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Messages</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded">
            <User className="w-4 h-4" />
            <span className="text-sm">Edit Profile</span>
          </Link>
          <Link href="/create" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Create</span>
          </Link>
        </nav>

        <div className="mt-6">
          <WalletConnect />
        </div>
      </aside>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-12">
        {/* Header with Typewriter Explanation */}
        <div className="mb-6 sm:mb-8 border-l-4 border-yellow-500 pl-4 sm:pl-6 ml-12 lg:ml-0">
          <div className="font-mono text-xs sm:text-sm mb-4 text-gray-400">
            <span className="text-yellow-400">$</span> cd dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-yellow-400">Dashboard</h1>
          <div className="bg-black/40 border border-gray-800 rounded p-3 sm:p-4 max-w-2xl mt-4">
            <div className="font-mono text-xs sm:text-sm text-gray-300">
              <div className="text-yellow-400 mb-2">{`// Why use the dashboard?`}</div>
              <div className="text-gray-400 border-l-2 border-gray-700 pl-2 sm:pl-3 text-xs sm:text-sm">
                Track your decentralized knowledge library. Monitor spaces, bookmarks, 
                and on-chain engagement—all stored permanently, censorship-resistant.
              </div>
            </div>
          </div>
        </div>

        {/* Stats with Line UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            label="Total Bookmarks"
            value={userBookmarkIds.length}
          />
          <StatCard
            label="My Spaces"
            value={userSpaceIds.length}
          />
          <StatCard
            label="Member Spaces"
            value={0}
          />
        </div>

        {/* Quick Actions with Line Divider */}
        <div className="mb-6 sm:mb-8 border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-12 bg-cyan-400"></div>
            <span className="text-xs text-gray-500 font-mono tracking-wider">QUICK ACTIONS</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/create?type=bookmark"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors border-2 border-yellow-600 text-center text-sm sm:text-base"
            >
              + NEW BOOKMARK
            </Link>
            <Link
              href="/create?type=space"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-600 text-gray-300 font-bold hover:border-yellow-500 hover:text-yellow-400 transition-colors text-center text-sm sm:text-base"
            >
              + NEW SPACE
            </Link>
          </div>
        </div>

        {/* My Spaces */}
        <section className="mb-8 sm:mb-12 border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-yellow-400"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">MY SPACES</h2>
          </div>
          {userSpaceIds.length > 0 ? (
            <SpaceGrid>
              {userSpaceIds.map((spaceId) => (
                <SpaceCardWrapper key={spaceId.toString()} spaceId={Number(spaceId)} />
              ))}
            </SpaceGrid>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-black/40 border border-gray-800 px-4">
              <div className="font-mono text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                <div className="text-yellow-400 mb-2">$ ls spaces/</div>
                <div className="text-gray-500">No spaces found.</div>
                <div className="mt-4 text-gray-400">
                  Create your first premium space to start monetizing your curated bookmarks.
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Recent Bookmarks */}
        <section className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-cyan-400"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">RECENT BOOKMARKS</h2>
          </div>
          {userBookmarkIds.length > 0 ? (
            <BookmarkGrid>
              {userBookmarkIds.slice(0, 6).map((bookmarkId) => (
                <BookmarkCardWrapper
                  key={bookmarkId.toString()}
                  bookmarkId={Number(bookmarkId)}
                />
              ))}
            </BookmarkGrid>
          ) : (
            <EmptyBookmarks />
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-black/40 border-l-4 border-yellow-500 border-t border-r border-b border-gray-800 p-4 sm:p-6 hover:border-l-yellow-400 transition-colors">
      <p className="text-xs text-gray-500 mb-2 sm:mb-3 font-mono tracking-wider uppercase">{label}</p>
      <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400">{value}</p>
      <div className="h-px bg-gray-800 mt-3 sm:mt-4"></div>
    </div>
  );
}

function BookmarkCardWrapper({ bookmarkId }: { bookmarkId: number }) {
  const { bookmark } = useBookmark(bookmarkId);
  const { address } = useAccount();

  console.log('BookmarkCardWrapper - bookmarkId:', bookmarkId);
  console.log('BookmarkCardWrapper - bookmark data:', bookmark);

  if (!bookmark) return null;

  // Convert data properly, handling both object and array responses
  const bookmarkData = {
    id: Number(bookmark.id || bookmark[0]),
    url: String(bookmark.url || bookmark[1]),
    title: String(bookmark.title || bookmark[2]),
    description: String(bookmark.description || bookmark[3]),
    tags: Array.isArray(bookmark.tags) ? bookmark.tags : (bookmark[4] || []),
    owner: String(bookmark.owner || bookmark[5]),
    spaceId: Number(bookmark.spaceId || bookmark[6]),
    timestamp: Number(bookmark.timestamp || bookmark[7]),
    ipfsHash: String(bookmark.ipfsHash || bookmark[8] || ''),
  };

  return (
    <BookmarkCard
      bookmark={bookmarkData}
      isOwner={bookmarkData.owner.toLowerCase() === address?.toLowerCase()}
    />
  );
}

function SpaceCardWrapper({ spaceId }: { spaceId: number }) {
  const { space } = useSpace(spaceId);
  const { address } = useAccount();

  console.log('SpaceCardWrapper - spaceId:', spaceId);
  console.log('SpaceCardWrapper - space data:', space);

  if (!space) {
    return (
      <div className="bg-black/40 border border-gray-800 p-6 animate-pulse">
        <div className="h-6 bg-gray-800 rounded mb-4"></div>
        <div className="h-4 bg-gray-800 rounded mb-2"></div>
        <div className="h-4 bg-gray-800 rounded w-2/3"></div>
      </div>
    );
  }

  // Convert BigInt values properly
  const spaceData = {
    id: Number(space.id || space[0]),
    name: String(space.name || space[1]),
    description: String(space.description || space[2]),
    owner: String(space.owner || space[3]),
    isPublic: Boolean(space.isPublic !== undefined ? space.isPublic : space[4]),
    accessPrice: BigInt(space.accessPrice !== undefined ? space.accessPrice : space[5]),
    memberCount: Number(space.memberCount !== undefined ? space.memberCount : space[6]),
    createdAt: Number(space.createdAt !== undefined ? space.createdAt : space[7]),
    isActive: Boolean(space.isActive !== undefined ? space.isActive : space[8]),
  };

  console.log('SpaceCardWrapper - formatted space:', spaceData);

  return (
    <SpaceCard
      space={spaceData}
      isOwner={spaceData.owner.toLowerCase() === address?.toLowerCase()}
      isMember={true}
    />
  );
}
