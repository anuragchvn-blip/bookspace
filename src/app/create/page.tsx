'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useBookmarks, useSpaces } from '@/hooks/useBookmarks';
import { WalletConnect } from '@/components/WalletConnect';
import { Bookmark, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'bookmark';
  
  const { address } = useAccount();
  const { createBookmark } = useBookmarks();
  const { createSpace } = useSpaces();

  const [formData, setFormData] = useState({
    // Bookmark fields
    url: '',
    title: '',
    description: '',
    tags: '',
    spaceId: '1',
    // Space fields
    name: '',
    isPublic: true,
    accessPrice: '0',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      if (type === 'bookmark') {
        const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        await createBookmark(
          formData.url,
          formData.title,
          formData.description,
          tags,
          parseInt(formData.spaceId),
          '' // IPFS hash - implement upload here
        );
        toast.success('Bookmark created successfully!');
        router.push('/dashboard');
      } else {
        await createSpace(
          formData.name,
          formData.description,
          formData.isPublic,
          formData.accessPrice
        );
        toast.success('Space created successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0d0d] border-r border-gray-800 flex flex-col p-6 fixed h-full">
        <Link href="/" className="mb-12">
          <h1 className="text-2xl font-bold tracking-wider">BOOKSPACE</h1>
          <p className="text-xs text-gray-500 mt-1">DECENTRALIZED BOOKMARKING</p>
        </Link>
        
        <nav className="flex-1 space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/create" className="flex items-center gap-2 text-white bg-gray-800 px-3 py-2 rounded">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Create</span>
          </Link>
        </nav>

        <WalletConnect />
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-12">
        {/* Header with Typewriter Explanation */}
        <div className="mb-8 border-l-4 border-yellow-500 pl-6">
          <div className="font-typewriter text-sm mb-4 text-gray-400">
            <span className="text-yellow-400">$</span> touch new_{type}.web3
          </div>
          <h1 className="text-5xl font-bold mb-3 text-yellow-400">
            Create {type === 'bookmark' ? 'Bookmark' : 'Space'}
          </h1>
          <div className="bg-black/40 border border-gray-800 rounded p-4 max-w-2xl mt-4">
            <div className="font-typewriter text-sm text-gray-300">
              <div className="text-yellow-400 mb-2">
                {`// ${type === 'bookmark' ? 'Why create bookmarks on-chain?' : 'Why create premium spaces?'}`}
              </div>
              <div className="text-gray-400 border-l-2 border-gray-700 pl-3">
                {type === 'bookmark' 
                  ? 'Permanent, censorship-resistant storage. Your bookmarks live forever on the blockchain, accessible across any device.'
                  : 'Monetize your curated knowledge. Premium spaces let you earn from your expertise while building a community.'}
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-black/40 border-2 border-gray-800 p-8 max-w-3xl">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-cyan-400"></div>
              <span className="text-xs text-gray-500 font-mono tracking-wider">TYPE</span>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => router.push('/create?type=bookmark')}
                className={`px-6 py-2 font-bold transition-colors border-2 ${
                  type === 'bookmark'
                    ? 'bg-yellow-500 text-black border-yellow-600'
                    : 'border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-400'
                }`}
              >
                BOOKMARK
              </button>
              <button
                onClick={() => router.push('/create?type=space')}
                className={`px-6 py-2 font-bold transition-colors border-2 ${
                  type === 'space'
                    ? 'bg-yellow-500 text-black border-yellow-600'
                    : 'border-gray-600 text-gray-400 hover:border-yellow-500 hover:text-yellow-400'
                }`}
              >
                SPACE
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'bookmark' ? (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                    URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none font-mono"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none"
                    placeholder="My awesome bookmark"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none resize-none"
                    placeholder="Describe this bookmark..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none font-mono text-sm"
                    placeholder="web3, blockchain, tutorial"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                    Space Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none"
                    placeholder="My Learning Space"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none resize-none"
                    placeholder="Describe your space..."
                  />
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <label className="block text-xs text-gray-500 mb-3 font-mono tracking-wider uppercase">
                    Access Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: true, accessPrice: '0' })}
                        className="accent-yellow-500"
                      />
                      <span className="text-gray-300">Public (Free)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isPublic}
                        onChange={() => setFormData({ ...formData, isPublic: false })}
                        className="accent-yellow-500"
                      />
                      <span className="text-gray-300">Premium (Paid)</span>
                    </label>
                  </div>
                </div>

                {!formData.isPublic && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                      Access Price (MATIC)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.accessPrice}
                      onChange={(e) => setFormData({ ...formData, accessPrice: e.target.value })}
                      className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none font-mono"
                      placeholder="1.0"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex gap-4 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-4 border-2 border-gray-600 text-gray-300 font-bold hover:border-gray-500 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={isLoading || !address}
                className="flex-1 px-6 py-4 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors border-2 border-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    CREATING...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    CREATE {type === 'bookmark' ? 'BOOKMARK' : 'SPACE'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
