'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { fetchNearbyPubs } from '@/lib/overpass';
import { Pub } from '@/types';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-2xl glass flex items-center justify-center">
      <p className="text-white">Loading map...</p>
    </div>
  ),
});

export default function DiscoverPage() {
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          
          // Fetch nearby pubs
          try {
            const nearbyPubs = await fetchNearbyPubs(latitude, longitude, 2000);
            setPubs(nearbyPubs);
            setLoading(false);
          } catch {
            setError('Failed to fetch nearby pubs');
            setLoading(false);
          }
        },
        () => {
          setError('Please enable location access to discover nearby pubs');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-party p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto pt-4 sm:pt-8 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <Link href="/">
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
              ← Back
            </button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            🗺️ Discover Nearby Pubs
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Find the best spots for your pub crawl
          </p>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          {loading && (
            <div className="glass rounded-2xl p-6 sm:p-8 text-center">
              <div className="animate-pulse">
                <p className="text-white text-base sm:text-lg">🔍 Finding pubs near you...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="glass-dark rounded-2xl p-6 sm:p-8 text-center">
              <p className="text-white text-base sm:text-lg mb-4">⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
              >
                Try Again
              </button>
            </div>
          )}
          {!loading && !error && userLocation && (
            <MapComponent pubs={pubs} center={userLocation} />
          )}
        </motion.div>

        {/* Pubs List */}
        {!loading && !error && pubs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              📍 Found {pubs.length} pubs nearby
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {pubs.map((pub, index) => (
                <motion.div 
                  key={pub.id} 
                  className="glass rounded-xl p-4 hover:bg-white/20 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                    {pub.name}
                  </h3>
                  {pub.address && (
                    <p className="text-xs sm:text-sm text-white/70 mb-2">{pub.address}</p>
                  )}
                  <p className="text-xs text-white/50">
                    📍 {pub.lat.toFixed(5)}, {pub.lon.toFixed(5)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
