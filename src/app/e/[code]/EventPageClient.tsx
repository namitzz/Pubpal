'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { Event, Team, Stop, LeaderboardEntry } from '@/types';
import Tabs, { TabItem } from '@/components/Tabs';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  // Prepare tabs
  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '🗺️',
      content: (
        <div className="space-y-4">
          {/* Stops */}
          <div className="glass rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Pub Stops</h2>
              <Link href={`/e/${code}/stops`}>
                <button className="px-4 py-2.5 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                  + Add Stop
                </button>
              </Link>
            </div>
            {stops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70 text-base mb-2">No stops added yet</p>
                <p className="text-white/50 text-sm">Add your first pub stop to start the crawl!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <motion.div 
                    key={stop.id} 
                    className="glass-dark rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-xl sm:text-2xl font-bold text-white/50 min-w-[35px]">
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="glass rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">💬 Event Chat</h2>
            <Link href={`/e/${code}/chat`}>
              <button className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                Open Chat Room
              </button>
            </Link>
          </div>
        </div>
      )
    },
    {
      id: 'teams',
      label: 'Teams',
      icon: '👥',
      content: (
        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Participating Teams</h2>
            <Link href={`/e/${code}/team/new`}>
              <button className="px-4 py-2.5 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                + Create Team
              </button>
            </Link>
          </div>
          {teams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70 text-base mb-2">No teams yet</p>
              <p className="text-white/50 text-sm">Be the first to create a team!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teams.map((team, index) => (
                <Link key={team.id} href={`/team/${team.join_code}`}>
                  <motion.div 
                    className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                        👥
                      </div>
                      <p className="text-white font-semibold text-base sm:text-lg">{team.name}</p>
                    </div>
                    <p className="text-xs text-white/50">Code: {team.join_code}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: '🏆',
      content: (
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Tournament Rankings</h2>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70 text-base mb-2">No scores yet</p>
              <p className="text-white/50 text-sm">Teams will appear here once they start scoring</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div 
                  key={entry.team_id} 
                  className="glass-dark rounded-xl p-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      text-xl sm:text-2xl font-bold min-w-[50px] text-center
                      ${index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-400' : 
                        'text-white/50'}
                    `}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-base sm:text-lg">{entry.team_name}</p>
                      <div className="flex gap-4 mt-1">
                        <p className="text-xs sm:text-sm text-white/70">
                          ⛳ {entry.total_strokes} strokes
                        </p>
                        <p className="text-xs sm:text-sm text-white/70">
                          📍 {entry.completed_stops} stops
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )
    }
  ];

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
    <main className="min-h-screen bg-gradient-party p-4 sm:p-6">
      <div className="max-w-5xl mx-auto pt-4 sm:pt-8 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/">
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
              ← Back
            </button>
          </Link>
          
          <div className="glass rounded-2xl p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              🍻 {event.name}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="glass-dark rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{stops.length}</div>
                <div className="text-xs text-white/70 mt-1">Stops</div>
              </div>
              <div className="glass-dark rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{teams.length}</div>
                <div className="text-xs text-white/70 mt-1">Teams</div>
              </div>
              <div className="glass-dark rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{event.city}</div>
                <div className="text-xs text-white/70 mt-1">City</div>
              </div>
              <div className="glass-dark rounded-xl p-3 text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{event.join_code}</div>
                <div className="text-xs text-white/70 mt-1">Code</div>
              </div>
            </div>
            <div className="text-white/80 text-sm sm:text-base">
              <p>📅 {new Date(event.date).toLocaleDateString()} at {event.start_time}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabbed Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        </motion.div>
      </div>
    </main>
  );
}
