import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PolygonProvider } from '@/providers/PolygonProvider';
import { SolanaProvider } from '@/providers/SolanaProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookSpace - Decentralized Bookmarking Platform',
  description: 'A Web3-powered bookmarking and learning platform on Polygon and Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PolygonProvider>
          <SolanaProvider>
            {children}
            <Toaster position="bottom-right" />
          </SolanaProvider>
        </PolygonProvider>
      </body>
    </html>
  );
}
