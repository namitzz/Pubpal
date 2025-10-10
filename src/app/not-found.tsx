import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-party flex items-center justify-center p-4">
      <div className="glass-dark rounded-2xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🍺</div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-white/80 mb-6">
          Oops! This pub doesn't exist
        </p>
        <Link href="/">
          <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
