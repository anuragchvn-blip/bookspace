'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletConnect() {
  const { publicKey: solanaPublicKey } = useWallet();

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {/* Polygon Wallet */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Polygon</span>
        </div>
        <ConnectButton
          chainStatus="none"
          accountStatus="address"
          showBalance={false}
        />
      </div>

      {/* Solana Wallet */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Solana</span>
        </div>
        <WalletMultiButton className="!bg-gradient-to-r !from-green-600 !to-green-500 !text-white !rounded-lg !px-4 !py-3 !text-sm !font-bold hover:!from-green-700 hover:!to-green-600 transition-all !w-full !justify-center" />
      </div>
    </div>
  );
}

export function ConnectWalletButton() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black/60 border-2 border-gray-800 rounded-lg max-w-lg mx-auto">
      <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border-2 border-gray-700">
        <svg className="w-10 h-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-3 text-yellow-400">Connect Your Wallets</h3>
      <p className="text-gray-400 text-center mb-8 max-w-md text-sm">
        Connect both Polygon and Solana wallets to access all features of BookSpace
      </p>
      <WalletConnect />
    </div>
  );
}
