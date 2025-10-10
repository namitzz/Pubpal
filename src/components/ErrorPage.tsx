'use client';

import Link from 'next/link';

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gradient-party flex items-center justify-center p-4">
      <div className="glass-dark rounded-2xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-3xl font-bold text-white mb-2">Oops!</h1>
        <p className="text-white/80 mb-6">
          {error?.message || 'Something went wrong'}
        </p>
        <div className="flex gap-3 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Try Again
            </button>
          )}
          <Link href="/">
            <button className="px-6 py-3 glass text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
