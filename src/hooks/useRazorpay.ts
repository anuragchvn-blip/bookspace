'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number; // in paise (INR * 100)
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export function useRazorpay() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initialize Razorpay payment
   * @param amount - Amount in INR
   * @param purpose - Payment purpose (space_access, dm_unlock, etc.)
   * @param metadata - Additional metadata
   */
  const initiatePayment = async (
    amount: number,
    purpose: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
    if (!window.Razorpay) {
      return { success: false, error: 'Razorpay SDK not loaded' };
    }

    setIsLoading(true);

    try {
      // Create order on backend (you'll need to implement this API route)
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          purpose,
          metadata: { ...metadata, walletAddress: address },
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      return new Promise((resolve) => {
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: order.amount,
          currency: order.currency,
          name: 'BookSpace',
          description: purpose.replace('_', ' ').toUpperCase(),
          order_id: order.id,
          handler: async (response: any) => {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                purpose,
                metadata,
              }),
            });

            const verifyData = await verifyResponse.json();
            setIsLoading(false);

            if (verifyData.success) {
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
              });
            } else {
              resolve({ success: false, error: 'Payment verification failed' });
            }
          },
          prefill: {
            email: metadata?.email,
            contact: metadata?.phone,
          },
          theme: {
            color: '#0ea5e9',
          },
        };

        const razorpay = new window.Razorpay(options);
        
        razorpay.on('payment.failed', (response: any) => {
          setIsLoading(false);
          resolve({
            success: false,
            error: response.error.description,
          });
        });

        razorpay.open();
      });
    } catch (error: any) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  /**
   * Pay for space access via Razorpay
   */
  const payForSpace = async (
    spaceId: number,
    amount: number,
    spaceOwner: string
  ) => {
    return initiatePayment(amount, 'space_access', {
      spaceId,
      spaceOwner,
    });
  };

  /**
   * Pay for DM unlock via Razorpay (alternative to POL payment)
   */
  const payForDMAccess = async (recipientAddress: string, amount: number = 50) => {
    return initiatePayment(amount, 'dm_unlock', {
      recipientAddress,
    });
  };

  return {
    initiatePayment,
    payForSpace,
    payForDMAccess,
    isLoading,
  };
}

/**
 * Load Razorpay script dynamically
 */
export function useLoadRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadScript = () => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        setIsLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  return { loadScript, isLoaded };
}
