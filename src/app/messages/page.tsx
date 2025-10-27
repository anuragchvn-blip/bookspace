'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnect } from '@/components/WalletConnect';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import Link from 'next/link';
import { MessageSquare, Send, Lock, ArrowLeft, Menu, X, User } from 'lucide-react';

export default function MessagesPage() {
  const { address, isConnected } = useAccount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [messageText, setMessageText] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  const { purchaseDMAccess, checkDMAccess, isLoading } = useDirectMessages();

  const handleUnlockDM = async () => {
    if (!recipientAddress) {
      alert('Please enter recipient address');
      return;
    }
    try {
      await purchaseDMAccess(recipientAddress);
      alert('DM access unlocked! You can now message this user.');
    } catch (error: any) {
      alert(`Failed to unlock: ${error.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">
            Connect your wallet to access direct messages
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
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-white bg-gray-800 px-3 py-2 rounded">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Messages</span>
          </div>
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
      <main className="lg:ml-64 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="ml-12 lg:ml-0 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-12 bg-cyan-400"></div>
              <span className="text-xs text-gray-500 font-mono tracking-wider">DIRECT MESSAGES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-3">
              Encrypted Messaging
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Pay 1 POL once to unlock unlimited DMs with any user. All messages stored on-chain.
            </p>
          </div>

          {/* Info Card */}
          <div className="bg-purple-900/20 border-2 border-purple-700/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-purple-300 mb-2">How DM Unlock Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Pay <strong>1 POL</strong> to unlock DMs with any user (one-time payment)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Once unlocked, send <strong>unlimited messages</strong> to that user forever</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Prevents spam - only serious messages get through</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>Platform receives 1 POL (revenue model) - creators get their content protected</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Unlock DM Section */}
          <div className="bg-black/40 border-2 border-gray-800 rounded-lg p-6 sm:p-8 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Unlock Direct Messages</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2 font-mono tracking-wider uppercase">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-black/60 border-2 border-gray-700 text-white focus:border-yellow-500 focus:outline-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the wallet address of the person you want to message
                </p>
              </div>

              <button
                onClick={handleUnlockDM}
                disabled={isLoading || !recipientAddress}
                className="w-full px-6 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Unlocking...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Unlock for 1 POL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Message Interface (Placeholder) */}
          <div className="bg-black/40 border-2 border-gray-800 rounded-lg p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-bold">Your Conversations</h2>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-2">No conversations yet</p>
              <p className="text-sm text-gray-500">
                Unlock DM access with someone to start messaging
              </p>
            </div>

            {/* Future: Message list will go here */}
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-gray-800 p-4 rounded">
              <div className="text-2xl font-bold text-cyan-400">0</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Active Chats</div>
            </div>
            <div className="bg-black/40 border border-gray-800 p-4 rounded">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">DMs Unlocked</div>
            </div>
            <div className="bg-black/40 border border-gray-800 p-4 rounded">
              <div className="text-2xl font-bold text-yellow-400">0 POL</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Spent on DMs</div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="mt-8 bg-cyan-900/20 border border-cyan-700/50 p-4 rounded">
            <p className="text-xs text-cyan-300">
              <strong>💡 Pro Tip:</strong> All messages are encrypted and stored on IPFS. 
              The 1 POL unlock fee goes to the platform to prevent spam and maintain the service. 
              Once you unlock someone, you can message them unlimited times forever!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
