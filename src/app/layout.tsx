import type { Metadata, Viewport } from 'next';
import PWARegister from '@/components/PWARegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'PubPal - Pub Golf Crawl & Party Chat',
  description: 'Plan and play pub golf bar crawls with friends',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#667eea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
