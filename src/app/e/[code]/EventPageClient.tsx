'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { Event, Team, Stop, LeaderboardEntry } from '@/types';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvent = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.error('Supabase not configured');
        setLoading(false);
        return;
      }

      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('join_code', code)
        .single();

      if (eventError) {
        console.error('Event not found:', eventError);
        router.push('/');
        return;
      }

      setEvent(eventData);

      // Fetch teams
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*')
        .eq('event_id', eventData.id);

      setTeams(teamsData || []);

      // Fetch stops
      const { data: stopsData } = await supabase
        .from('stops')
        .select('*')
        .eq('event_id', eventData.id)
        .order('order_index');

      setStops(stopsData || []);

      // Fetch leaderboard
      await loadLeaderboard(eventData.id);

      setLoading(false);
    } catch (error) {
      console.error('Error loading event:', error);
      setLoading(false);
    }
  }, [code, router]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const loadLeaderboard = async (eventId: string) => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: scoresData } = await supabase
        .from('scores')
        .select('team_id, strokes')
        .eq('event_id', eventId);

      const { data: teamsData } = await supabase
        .from('teams')
        .select('id, name')
        .eq('event_id', eventId);

      if (!scoresData || !teamsData) return;

      const leaderboardMap = new Map<string, LeaderboardEntry>();

      teamsData.forEach(team => {
        leaderboardMap.set(team.id, {
          team_id: team.id,
          team_name: team.name,
          total_strokes: 0,
          completed_stops: 0,
        });
      });

      scoresData.forEach(score => {
        const entry = leaderboardMap.get(score.team_id);
        if (entry) {
          entry.total_strokes += score.strokes;
          entry.completed_stops += 1;
        }
      });

      const sortedLeaderboard = Array.from(leaderboardMap.values())
        .sort((a, b) => a.total_strokes - b.total_strokes);

      setLeaderboard(sortedLeaderboard);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="animate-pulse">
            <p className="text-white text-lg sm:text-xl">🔍 Loading event...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-white text-lg sm:text-xl mb-4">Event not found</p>
          <Link href="/">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all">
              Go Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

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
          <div className="glass rounded-2xl p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              🍻 {event.name}
            </h1>
            <div className="text-white/80 space-y-1 text-sm sm:text-base">
              <p>📍 {event.city}</p>
              <p>📅 {new Date(event.date).toLocaleDateString()} at {event.start_time}</p>
              <p>🎫 Code: <span className="font-bold text-white">{event.join_code}</span></p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Stops */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            <div className="glass rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">🗺️ Stops</h2>
                <Link href={`/e/${code}/stops`}>
                  <button className="px-4 py-2 bg-white/20 text-white text-sm sm:text-base rounded-xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95">
                    + Add Stop
                  </button>
                </Link>
              </div>
              {stops.length === 0 ? (
                <p className="text-white/70 text-sm sm:text-base">No stops added yet. Add your first stop!</p>
              ) : (
                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="glass-dark rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-xl sm:text-2xl font-bold text-white/50">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-white">
                            {stop.name}
                          </h3>
                          {stop.rule && (
                            <p className="text-xs sm:text-sm text-white/70 mt-1">
                              ⛳ Rule: {stop.rule}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="glass rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">💬 Event Chat</h2>
              <Link href={`/e/${code}/chat`}>
                <button className="w-full py-3 bg-white/20 text-white text-sm sm:text-base rounded-xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95">
                  Open Chat
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Teams */}
            <div className="glass rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">👥 Teams</h2>
              {teams.length === 0 ? (
                <p className="text-white/70 text-sm mb-4">No teams yet</p>
              ) : (
                <div className="space-y-2 mb-4">
                  {teams.map((team) => (
                    <Link key={team.id} href={`/team/${team.join_code}`}>
                      <div className="glass-dark rounded-xl p-3 hover:bg-white/10 transition-all cursor-pointer hover:scale-102">
                        <p className="text-white font-semibold text-sm sm:text-base">{team.name}</p>
                        <p className="text-xs text-white/50">Code: {team.join_code}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <Link href={`/e/${code}/team/new`}>
                <button className="w-full py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                  + Create Team
                </button>
              </Link>
            </div>

            {/* Leaderboard */}
            <div className="glass rounded-2xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">🏆 Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <p className="text-white/70 text-sm">No scores yet</p>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.team_id} className="glass-dark rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg sm:text-xl font-bold text-white/50">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm sm:text-base">{entry.team_name}</p>
                          <p className="text-xs text-white/70">
                            {entry.total_strokes} strokes • {entry.completed_stops} stops
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
