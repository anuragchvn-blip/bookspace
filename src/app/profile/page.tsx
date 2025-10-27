'use client';

import { useAccount } from 'wagmi';
import { ProfileEditor } from '@/components/ProfileEditor';
import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';
import { User, ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Connect your wallet to edit your profile
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 p-3 rounded border border-gray-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed w-64 bg-[#0d0d0d] border-r border-gray-800 flex flex-col p-6 h-full z-40
        transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Link href="/" className="mb-12">
          <h1 className="text-2xl font-bold tracking-wider">BOOKSPACE</h1>
          <p className="text-xs text-gray-500 mt-1">DECENTRALIZED BOOKMARKING</p>
        </Link>
        
        <nav className="flex-1 space-y-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-2 rounded transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-white bg-gray-800 px-3 py-2 rounded">
            <User className="w-4 h-4" />
            <span className="text-sm">Edit Profile</span>
          </div>
        </nav>

        <div className="mt-6">
          <WalletConnect />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="ml-12 lg:ml-0">
          <ProfileEditor />
        </div>
      </main>
    </div>
  );
}
