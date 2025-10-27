// @ts-nocheck - Next.js client component props
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaPayments } from '@/hooks/useSolanaTips';
import { useRazorpay, useLoadRazorpay } from '@/hooks/useRazorpay';
import { Wallet, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentSelectorProps {
  recipientName: string;
  recipientPolygonWallet: string;
  recipientSolanaWallet?: string;
  amountMatic: string; // Amount in MATIC for Polygon
  amountSol?: number; // Amount in SOL for Solana
  amountInr?: number; // Amount in INR for Razorpay
  purpose: 'space_access' | 'dm_unlock' | 'tip';
  metadata?: Record<string, any>;
  onSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

type PaymentMethod = 'polygon' | 'solana' | 'razorpay';

export function PaymentSelector({
  recipientName,
  recipientPolygonWallet,
  recipientSolanaWallet,
  amountMatic,
  amountSol = 0.01,
  amountInr = 50,
  purpose,
  metadata,
  onSuccess,
  onCancel,
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('polygon');
  const [isProcessing, setIsProcessing] = useState(false);

  const { address: polygonAddress } = useAccount();
  const { publicKey: solanaPublicKey } = useWallet();
  const { sendPayment: sendSolana, isLoading: solanaLoading } = useSolanaPayments();
  const { initiatePayment: initiateRazorpay, isLoading: razorpayLoading } = useRazorpay();
  const { loadScript, isLoaded } = useLoadRazorpay();

  // Load Razorpay script on mount
  useState(() => {
    loadScript();
  });

  const handlePolygonPayment = async () => {
    // This will be handled by the parent component
    // which has access to space/DM contract functions
    toast.error('Please use the Polygon payment button in the UI');
  };

  const handleSolanaPayment = async () => {
    if (!recipientSolanaWallet) {
      toast.error('Recipient Solana wallet not available');
      return;
    }

    if (!solanaPublicKey) {
      toast.error('Please connect your Solana wallet');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await sendSolana(
        recipientSolanaWallet,
        amountSol,
        `${purpose} - ${recipientName}`
      );

      toast.success(`Payment sent! ${result.signature.slice(0, 8)}...`);
      onSuccess({
        method: 'solana',
        signature: result.signature,
        amount: amountSol,
        explorerUrl: result.explorerUrl,
      });
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!isLoaded) {
      toast.error('Razorpay not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await initiateRazorpay(amountInr, purpose, {
        ...metadata,
        recipientName,
        recipientWallet: recipientPolygonWallet,
      });

      if (result.success) {
        toast.success('Payment successful!');
        onSuccess({
          method: 'razorpay',
          paymentId: result.paymentId,
          amount: amountInr,
        });
      } else {
        toast.error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    switch (selectedMethod) {
      case 'polygon':
        handlePolygonPayment();
        break;
      case 'solana':
        handleSolanaPayment();
        break;
      case 'razorpay':
        handleRazorpayPayment();
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Choose Payment Method</h3>

      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600">Paying to</p>
        <p className="font-semibold text-base sm:text-lg">{recipientName}</p>
        <p className="text-xs text-gray-500 mt-1 break-all">
          {selectedMethod === 'solana' ? recipientSolanaWallet : recipientPolygonWallet}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {/* Polygon Payment */}
        <button
          onClick={() => setSelectedMethod('polygon')}
          className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all ${
            selectedMethod === 'polygon'
              ? 'border-polygon bg-polygon bg-opacity-10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-polygon flex items-center justify-center flex-shrink-0">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">Polygon (MATIC)</p>
                <p className="text-xs sm:text-sm text-gray-600">{amountMatic} MATIC</p>
              </div>
            </div>
            {selectedMethod === 'polygon' && (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-polygon flex-shrink-0" />
            )}
          </div>
          {!polygonAddress && (
            <p className="text-xs text-red-500 mt-2 text-left">Connect MetaMask first</p>
          )}
        </button>

        {/* Solana Payment */}
        {recipientSolanaWallet && (
          <button
            onClick={() => setSelectedMethod('solana')}
            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all ${
              selectedMethod === 'solana'
                ? 'border-solana bg-solana bg-opacity-10'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-solana flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm sm:text-base">Solana (SOL)</p>
                  <p className="text-xs sm:text-sm text-gray-600">{amountSol} SOL</p>
                </div>
              </div>
              {selectedMethod === 'solana' && (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-solana flex-shrink-0" />
              )}
            </div>
            {!solanaPublicKey && (
              <p className="text-xs text-red-500 mt-2 text-left">Connect Phantom first</p>
            )}
          </button>
        )}

        {/* Razorpay Payment */}
        <button
          onClick={() => setSelectedMethod('razorpay')}
          className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all ${
            selectedMethod === 'razorpay'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm sm:text-base">UPI / Card / Banking</p>
                <p className="text-xs sm:text-sm text-gray-600">₹{amountInr}</p>
              </div>
            </div>
            {selectedMethod === 'razorpay' && (
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            )}
          </div>
        </button>
      </div>

      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing || 
            (selectedMethod === 'polygon' && !polygonAddress) ||
            (selectedMethod === 'solana' && !solanaPublicKey)
          }
          className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span className="hidden sm:inline">Processing...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            `Pay Now`
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
        Payments are secure and encrypted.
      </p>
    </div>
  );
}
