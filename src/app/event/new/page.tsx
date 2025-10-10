'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient, generateJoinCode } from '@/lib/supabase';

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    date: '',
    start_time: '',
    owner: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        alert('⚠️ Database not configured. Please add your Supabase credentials to .env.local file.');
        setLoading(false);
        return;
      }

      // Validate form data
      if (!formData.name.trim() || !formData.city.trim() || !formData.owner.trim()) {
        alert('⚠️ Please fill in all required fields.');
        setLoading(false);
        return;
      }

      const joinCode = generateJoinCode();
      
      const { data: event, error } = await supabase
        .from('events')
        .insert([
          {
            ...formData,
            join_code: joinCode,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(error.message || 'Failed to create event');
      }

      // Create default chat room for the event
      const { error: chatError } = await supabase.from('chat_rooms').insert([
        {
          event_id: event.id,
          name: 'Event Chat',
        },
      ]);

      if (chatError) {
        console.error('Chat room creation error:', chatError);
        // Continue anyway since event was created
      }

      router.push(`/e/${joinCode}`);
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`❌ Failed to create event: ${errorMessage}\n\nPlease check your database configuration.`);
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
          <Link href="/">
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
              ← Back
            </button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            🎉 Create New Event
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Set up your pub golf crawl
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
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-base"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                Event Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-base"
                placeholder="e.g., Epic Saturday Pub Crawl"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-base"
                placeholder="e.g., London"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-white text-purple-600 rounded-xl font-bold text-base sm:text-lg hover:bg-white/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? '🎲 Creating Event...' : '🎉 Create Event'}
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
