'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [joinCode, setJoinCode] = useState('');

  return (
    <main className="min-h-screen bg-gradient-party p-4">
      <div className="max-w-4xl mx-auto pt-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            🍻 PubPal
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Your ultimate pub golf crawl & party chat companion
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Create Event Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/event/new">
              <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer h-full">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Create Event
                </h2>
                <p className="text-white/80">
                  Start a new pub crawl and invite your friends
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Join Event Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Join Event
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                maxLength={6}
              />
              <Link href={joinCode ? `/e/${joinCode}` : '#'}>
                <button
                  disabled={!joinCode}
                  className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Discover Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/discover">
            <div className="glass rounded-2xl p-8 hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🗺️</div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Discover Nearby Pubs
                  </h2>
                  <p className="text-white/80">
                    Find pubs and bars near you for your crawl
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-dark rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm text-white/80">Live Leaderboard</p>
            </div>
            <div className="glass-dark rounded-xl p-4">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm text-white/80">Group Chat</p>
            </div>
            <div className="glass-dark rounded-xl p-4">
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm text-white/80">Share Photos</p>
            </div>
            <div className="glass-dark rounded-xl p-4">
              <div className="text-3xl mb-2">⛳</div>
              <p className="text-sm text-white/80">Custom Rules</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
