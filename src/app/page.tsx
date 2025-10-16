'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-party p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto pt-8 sm:pt-12 pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
            🍻 PubPal
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8">
            Your ultimate pub golf crawl & party chat companion
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {/* Create Event Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/event/new">
              <div className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all cursor-pointer h-full">
                <div className="text-4xl sm:text-5xl mb-4">🎉</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Create Event
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  Start a new pub crawl and invite your friends
                </p>
              </div>
            </Link>
          </motion.div>

          {/* View Event Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/event">
              <div className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all cursor-pointer h-full">
                <div className="text-4xl sm:text-5xl mb-4">🍻</div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  View My Event
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  Manage stops, teams and scoreboard
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Discover Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/discover">
            <div className="glass rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all cursor-pointer">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-4xl sm:text-5xl">🗺️</div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Discover Nearby Pubs
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base">
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
          className="mt-8 sm:mt-12 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <motion.div 
              className="glass-dark rounded-xl p-3 sm:p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl sm:text-3xl mb-2">🏆</div>
              <p className="text-xs sm:text-sm text-white/80">Live Leaderboard</p>
            </motion.div>
            <motion.div 
              className="glass-dark rounded-xl p-3 sm:p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl sm:text-3xl mb-2">💬</div>
              <p className="text-xs sm:text-sm text-white/80">Group Chat</p>
            </motion.div>
            <motion.div 
              className="glass-dark rounded-xl p-3 sm:p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl sm:text-3xl mb-2">📸</div>
              <p className="text-xs sm:text-sm text-white/80">Share Photos</p>
            </motion.div>
            <motion.div 
              className="glass-dark rounded-xl p-3 sm:p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl sm:text-3xl mb-2">⛳</div>
              <p className="text-xs sm:text-sm text-white/80">Custom Rules</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
