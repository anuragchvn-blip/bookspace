'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useState } from 'react';

/**
 * Hook for Solana wallet-to-wallet payments
 * Used as an alternative payment method (not for DMs - those use Polygon)
 */
export function useSolanaPayments() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Send SOL payment directly to recipient wallet
   * @param recipientAddress - Recipient's Solana wallet address
   * @param amount - Amount in SOL
   * @param memo - Optional payment memo
   */
  const sendPayment = async (recipientAddress: string, amount: number, memo?: string) => {
    if (!publicKey) throw new Error('Solana wallet not connected');
    
    setIsLoading(true);
    try {
      const recipientPubkey = new PublicKey(recipientAddress);
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      return {
        signature,
        amount,
        recipient: recipientAddress,
        timestamp: Date.now(),
        memo,
        explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get SOL balance for an address
   */
  const getBalance = async (address?: string) => {
    const pubkey = address ? new PublicKey(address) : publicKey;
    if (!pubkey) return 0;

    const balance = await connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  };

  /**
   * Send tip (same as payment but with different context)
   */
  const sendTip = async (recipientAddress: string, amount: number, message?: string) => {
    return sendPayment(recipientAddress, amount, message);
  };

  return {
    sendPayment,
    sendTip,
    getBalance,
    isLoading,
    isConnected: !!publicKey,
    walletAddress: publicKey?.toBase58(),
  };
}
