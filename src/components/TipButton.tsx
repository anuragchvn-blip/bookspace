// @ts-nocheck - Next.js client component props
'use client';

import { useState } from 'react';
import { useSolanaPayments } from '@/hooks/useSolanaTips';
import { Gift, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TipButtonProps {
  recipientWallet: string;
  recipientName?: string;
  suggestedAmount?: number;
  onSuccess?: (signature: string) => void;
}

export function TipButton({
  recipientWallet,
  recipientName,
  suggestedAmount = 0.01,
  onSuccess,
}: TipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(suggestedAmount);
  const [message, setMessage] = useState('');
  const { sendTip, isLoading, isConnected } = useSolanaPayments();

  const handleTip = async () => {
    if (!isConnected) {
      toast.error('Please connect your Solana wallet');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    try {
      const result = await sendTip(recipientWallet, amount, message);
      toast.success(`Sent ${amount} SOL tip!`);
      onSuccess?.(result.signature);
      setIsOpen(false);
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send tip');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-solana text-white rounded-lg hover:bg-solana-dark transition-colors text-sm font-medium"
      >
        <Gift className="w-4 h-4" />
        Tip SOL
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold">Send a Tip</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {recipientName && (
            <div className="p-3 bg-solana bg-opacity-10 rounded-lg">
              <p className="text-sm text-gray-600">Tipping</p>
              <p className="font-semibold">{recipientName}</p>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Amount (SOL)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solana focus:border-transparent text-sm"
                placeholder="0.01"
              />
              <div className="flex gap-1">
                {[0.01, 0.05, 0.1].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="flex-1 sm:flex-none px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={280}
              rows={3}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-solana focus:border-transparent resize-none text-sm"
              placeholder="Add a nice message..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/280 characters
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleTip}
              disabled={isLoading || !isConnected}
              className="flex-1 px-4 py-3 bg-solana text-white rounded-lg hover:bg-solana-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Send {amount} SOL
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
