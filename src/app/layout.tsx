import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PubPal - Pub Golf Crawl & Party Chat',
  description: 'Plan and play pub golf bar crawls with friends',
  manifest: '/manifest.json',
  themeColor: '#667eea',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
