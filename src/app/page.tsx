'use client';

import { WalletConnect } from '@/components/WalletConnect';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded border border-gray-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle mobile menu"
        title="Toggle navigation menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Left Sidebar */}
      <aside className={`
        fixed lg:fixed top-0 left-0 h-full w-64 bg-[#0d0d0d] border-r border-gray-800 
        flex flex-col p-6 z-40 transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-12">
          <h1 className="text-2xl font-bold tracking-wider">BOOKSPACE</h1>
          <p className="text-xs text-gray-500 mt-1">DECENTRALIZED BOOKMARKING</p>
        </div>

        <nav className="flex-1 space-y-6">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span className="text-sm">Home</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span className="text-sm">Dashboard</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span className="text-sm">Messages</span>
          </Link>
          <Link href="/create" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span className="text-sm">Create Space</span>
          </Link>
        </nav>

        <div className="space-y-3">
          <Link href="/create" className="w-full block">
            <button className="w-full bg-cyan-400 text-black font-bold py-3 rounded hover:bg-cyan-300 transition text-sm">
              CREATE SPACE
            </button>
          </Link>
          <Link href="/dashboard" className="w-full block">
            <button className="w-full border border-gray-700 text-white py-3 rounded hover:bg-gray-900 transition text-sm">
              DASHBOARD
            </button>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <div className="border-b border-gray-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-12 lg:ml-0">
            <span className="text-xs text-red-500">● POLYGON</span>
            <span className="text-xs text-yellow-500">● SOLANA</span>
            <span className="text-xs text-green-500">● IPFS</span>
          </div>
          <div className="flex items-center gap-3 ml-12 lg:ml-0">
            <div className="hidden sm:flex items-center gap-2 bg-gray-900 px-3 py-1 rounded border border-gray-700 text-xs">
              <span>Product Hunt</span>
              <span className="bg-orange-500 px-2 py-1 rounded">183</span>
            </div>
            <WalletConnect />
          </div>
        </div>

        {/* Hero Section */}
        <section className="p-6 lg:p-12 border-b border-gray-800">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              <span className="text-xs text-gray-500 font-mono tracking-wider">DECENTRALIZED BOOKMARKING</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-yellow-neon">
              Own Your<br />Bookmarks Forever
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-2xl">
              Store bookmarks on blockchain. Create premium spaces. Get tipped in crypto. Your data, your rules.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <button className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded font-bold">
                  Get Started
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="w-full sm:w-auto px-8 py-4 border border-gray-700 hover:bg-gray-900 rounded">
                  View Dashboard
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Code Snippet */}
        <section className="p-6 lg:p-12 bg-[#0d0d0d] border-b border-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Built on Blockchain</h2>
            <p className="text-sm md:text-base text-gray-400 mb-8">Immutable smart contracts power your bookmarks</p>
            
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-gray-800">
              <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 border-b border-gray-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-xs text-gray-500 font-mono hidden sm:block">BookmarkRegistry.sol</span>
              </div>
              
              <div className="p-4 lg:p-6 font-mono text-xs sm:text-sm overflow-x-auto">
                <pre className="text-gray-300">
                  <code>
                    <span className="text-purple-400">pragma solidity</span> <span className="text-green-400">^0.8.0</span>;{'\n\n'}
                    <span className="text-purple-400">contract</span> <span className="text-yellow-400">BookmarkRegistry</span> {'{\n'}
                    {'  '}<span className="text-blue-400">mapping</span>(<span className="text-blue-400">address</span> {'=>'} <span className="text-blue-400">string</span>[]) <span className="text-purple-400">public</span> bookmarks;{'\n\n'}
                    {'  '}<span className="text-purple-400">function</span> <span className="text-yellow-400">addBookmark</span>(<span className="text-blue-400">string memory</span> url) <span className="text-purple-400">public</span> {'{\n'}
                    {'    '}bookmarks[<span className="text-blue-400">msg.sender</span>].<span className="text-yellow-400">push</span>(url);{'\n'}
                    {'  }}\n'}
                    {'}'}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="p-6 lg:p-12 border-b border-gray-800">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-cyan-400"></div>
              <span className="text-xs text-gray-500 font-mono tracking-wider">HOW IT WORKS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">Three Simple Steps</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemoCard
              icon="🚀"
              title="STEP 01"
              subtitle="Create Space"
              number="01/03"
              description="Set up your Web3 bookmark collection"
            />
            <DemoCard
              icon="🔖"
              title="STEP 02"
              subtitle="Add Bookmark"
              number="02/03"
              description="Store URLs permanently on blockchain"
            />
            <DemoCard
              icon="💰"
              title="STEP 03"
              subtitle="Send Tips"
              number="03/03"
              description="Reward creators with SOL tokens"
            />
          </div>
        </section>

        {/* NFT Features */}
        <section className="p-6 lg:p-12 border-b border-gray-800">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-12 bg-purple-400"></div>
            <span className="text-xs text-gray-500 font-mono tracking-wider">TECHNOLOGY STACK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Features for Web3</h2>
          <p className="text-gray-400 mb-12 font-mono text-xs sm:text-sm max-w-3xl">
            Built to bring true ownership and decentralization to your digital bookmarks...
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NFTFeatureCard
              title="Blockchain Storage"
              description="Permanent, censorship-resistant bookmarks stored forever on Polygon"
              color="bg-blue-600"
              pixelPattern={[9,10,11,12,13,14,17,22,25,30,33,38,41,46,50,51,52,53,54,55]}
            />
            <NFTFeatureCard
              title="Premium Spaces"
              description="Create gated collections and monetize your curated knowledge"
              color="bg-purple-600"
              pixelPattern={[10,11,12,13,18,21,26,29,34,37,42,45,50,51,52,53]}
            />
            <NFTFeatureCard
              title="Instant Tips"
              description="Send SOL micropayments to reward valuable content creators"
              color="bg-green-500"
              pixelPattern={[11,12,19,20,27,28,35,36,43,44,51,52]}
            />
            <NFTFeatureCard
              title="IPFS Integration"
              description="Rich metadata stored on decentralized networks forever"
              color="bg-orange-500"
              pixelPattern={[9,10,13,14,17,18,21,22,25,26,29,30,41,42,45,46,49,50,53,54]}
            />
            <NFTFeatureCard
              title="Direct Messaging"
              description="1 POL unlocks unlimited DMs with spam protection built-in"
              color="bg-pink-500"
              pixelPattern={[10,11,12,13,18,21,26,29,34,37,42,45,50,51,52,53]}
            />
            <NFTFeatureCard
              title="Multi-Chain"
              description="Polygon for storage, Solana for fast instant payments"
              color="bg-cyan-500"
              pixelPattern={[8,9,14,15,16,17,22,23,24,25,30,31,32,33,38,39,44,45,50,51,52,53,54,55]}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 p-8 lg:p-16 mt-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <div className="minecraft-snake"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center gap-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl tracking-wider text-center font-helvetica-extrabold">
              foooterr
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-4 mt-8 w-full max-w-4xl px-4">
              <iframe 
                className="w-full lg:w-1/2 rounded-xl"
                src="https://open.spotify.com/embed/track/4uUG5RXrOk84mYEfFvj3cK?utm_source=generator" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="Brazilian Phonk Spotify Player"
              ></iframe>
              <iframe 
                className="w-full lg:w-1/2 rounded-xl"
                src="https://open.spotify.com/embed/track/4cOdK2wGLETKBW3PvgPWqT?utm_source=generator" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="Ye Fue Que Spotify Player"
              ></iframe>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function DemoCard({ icon, title, subtitle, number, description }: { icon: string; title: string; subtitle: string; number: string; description: string }) {
  return (
    <div className="bg-[#0d0d0d] border border-gray-800 rounded-lg p-6 lg:p-8 hover:border-cyan-500/50 transition group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-2 font-mono">
        <span className="text-2xl">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 group-hover:text-cyan-400 transition">{subtitle}</div>
      <div className="flex items-center justify-between text-sm text-gray-500 font-mono">
        <span>C</span>
        <span>{number}</span>
        <span className="text-xs hidden sm:block">{description}</span>
        <div className="w-2 h-2 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition"></div>
      </div>
    </div>
  );
}

function NFTFeatureCard({ title, description, color, pixelPattern }: { title: string; description: string; color: string; pixelPattern: number[] }) {
  const nftNumber = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  
  return (
    <div className="group relative bg-[#0d0d0d] border-2 border-gray-800 rounded-lg overflow-hidden hover:border-cyan-400 transition-all duration-300">
      <div className={`h-40 sm:h-48 ${color} relative pixelated-grid-bg`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-8 gap-1 p-4">
            {[...Array(64)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 transition-all duration-200 pixelated ${
                  pixelPattern.includes(i) 
                    ? 'bg-white opacity-90 group-hover:opacity-100' 
                    : 'bg-black/20'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute top-3 right-3 bg-black/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-cyan-400/50 text-xs font-mono text-cyan-400 group-hover:border-cyan-400 transition">
          NFT #{nftNumber}
        </div>
      </div>
      
      <div className="p-4 sm:p-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
        
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-cyan-400 transition">{title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-mono">{description}</p>
        
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-cyan-400/30 group-hover:border-cyan-400 transition"></div>
      </div>
    </div>
  );
}
