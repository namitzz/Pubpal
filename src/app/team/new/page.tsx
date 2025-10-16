'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { addTeam, getEvent } from '@/lib/storage';

export default function NewTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if event exists
      const event = getEvent();
      if (!event) {
        alert('⚠️ No event found. Please create an event first.');
        router.push('/');
        return;
      }

      // Validate team name
      if (!teamName.trim()) {
        alert('⚠️ Please enter a team name.');
        setLoading(false);
        return;
      }

      // Create team
      const team = addTeam(teamName.trim());
      
      // Navigate to team page
      router.push(`/team/${team.join_code}`);
    } catch (error) {
      console.error('Error creating team:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Failed to create team: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-party p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto pt-4 sm:pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <Link href="/event">
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
              ← Back
            </button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            👥 Create New Team
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Join the pub crawl with your team
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-4 sm:p-6 md:p-8"
        >
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-base"
                placeholder="e.g., The Party Animals"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-white text-purple-600 rounded-xl font-bold text-base sm:text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? '👥 Creating Team...' : '👥 Create Team'}
            </button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 glass-dark rounded-2xl p-4 sm:p-6"
        >
          <h3 className="text-lg font-bold text-white mb-2">What&apos;s next?</h3>
          <ul className="text-white/80 text-sm space-y-2">
            <li>✅ You&apos;ll get a unique team code</li>
            <li>✅ Add team members</li>
            <li>✅ Track your scores at each stop</li>
            <li>✅ Compete on the leaderboard</li>
          </ul>
        </motion.div>
      </div>
    </main>
  );
}
