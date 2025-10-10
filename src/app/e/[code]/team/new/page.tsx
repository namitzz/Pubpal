'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient, generateJoinCode } from '@/lib/supabase';

export default function NewTeamPage() {
  const params = useParams();
  const router = useRouter();
  const eventCode = params.code as string;
  
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      // Get event ID from code
      const { data: event } = await supabase
        .from('events')
        .select('id')
        .eq('join_code', eventCode)
        .single();

      if (!event) {
        throw new Error('Event not found');
      }

      const teamCode = generateJoinCode();

      // Create team
      const { data: team, error } = await supabase
        .from('teams')
        .insert([
          {
            event_id: event.id,
            name: teamName,
            join_code: teamCode,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Create team chat room
      await supabase.from('chat_rooms').insert([
        {
          team_id: team.id,
          name: 'Team Chat',
        },
      ]);

      router.push(`/team/${teamCode}`);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-party p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href={`/e/${eventCode}`}>
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-colors">
              ← Back to Event
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            👥 Create New Team
          </h1>
          <p className="text-white/80">
            Form your squad for the pub crawl
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Team Name
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="e.g., The Drink Masters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? '👥 Creating Team...' : '👥 Create Team'}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
