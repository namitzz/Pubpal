'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getEvent, getStops, addStop, deleteStop, type EventData, type Stop } from '@/lib/storage';

export default function StopsPage() {
  const router = useRouter();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    rule: '',
  });

  const loadData = () => {
    try {
      const eventData = getEvent();
      
      if (!eventData) {
        console.error('No event found');
        router.push('/');
        return;
      }

      setEvent(eventData);
      setStops(getStops());
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      addStop(formData.name.trim(), formData.rule.trim() || undefined);
      setFormData({ name: '', rule: '' });
      loadData();
    } catch (error) {
      console.error('Error adding stop:', error);
      alert('Failed to add stop');
    }
  };

  const handleDeleteStop = (stopId: string) => {
    if (!confirm('Are you sure you want to delete this stop?')) return;

    try {
      deleteStop(stopId);
      loadData();
    } catch (error) {
      console.error('Error deleting stop:', error);
      alert('Failed to delete stop');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <p className="text-white text-xl">🔍 Loading...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <p className="text-white text-xl mb-4">No event found</p>
          <Link href="/">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold">
              Go Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-party p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/event">
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-colors">
              ← Back to Event
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            🗺️ Manage Stops
          </h1>
          <p className="text-white/80">
            Add and manage pub stops for {event.name}
          </p>
        </motion.div>

        {/* Add Stop Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleAddStop}
          className="glass rounded-2xl p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">➕ Add New Stop</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Pub/Bar Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="e.g., The King's Head"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                Rule (Optional)
              </label>
              <input
                type="text"
                value={formData.rule}
                onChange={(e) => setFormData({ ...formData, rule: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="e.g., Order a pint, +1 stroke for spillage"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              ➕ Add Stop
            </button>
          </div>
        </motion.form>

        {/* Stops List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              📍 Current Stops ({stops.length})
            </h2>
            {stops.length === 0 ? (
              <p className="text-white/70">No stops added yet. Add your first stop above!</p>
            ) : (
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="glass-dark rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl font-bold text-white/50">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {stop.name}
                        </h3>
                        {stop.rule && (
                          <p className="text-sm text-white/70 mt-1">
                            ⛳ Rule: {stop.rule}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="px-3 py-1 bg-red-500/30 text-white rounded-lg hover:bg-red-500/50 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
