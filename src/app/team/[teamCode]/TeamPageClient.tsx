'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { Team, Member, Score, Stop } from '@/types';

export default function TeamPage() {
  const params = useParams();
  const teamCode = params.teamCode as string;
  
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemberName, setNewMemberName] = useState('');

  const loadTeam = useCallback(async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Fetch team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('join_code', teamCode)
        .single();

      if (teamError) {
        console.error('Team not found:', teamError);
        setLoading(false);
        return;
      }

      setTeam(teamData);

      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .eq('team_id', teamData.id);

      setMembers(membersData || []);

      // Fetch event data
      const { data: eventData } = await supabase
        .from('events')
        .select('join_code')
        .eq('id', teamData.event_id)
        .single();

      if (eventData) {
        // Fetch stops
        const { data: stopsData } = await supabase
          .from('stops')
          .select('*')
          .eq('event_id', teamData.event_id)
          .order('order_index');

        setStops(stopsData || []);

        // Fetch scores
        const { data: scoresData } = await supabase
          .from('scores')
          .select('*')
          .eq('team_id', teamData.id);

        setScores(scoresData || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading team:', error);
      setLoading(false);
    }
  }, [teamCode]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !team) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { error } = await supabase
        .from('members')
        .insert([
          {
            team_id: team.id,
            nickname: newMemberName.trim(),
          },
        ]);

      if (error) throw error;

      setNewMemberName('');
      loadTeam();
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member');
    }
  };

  const updateScore = async (stopId: string, strokes: number) => {
    if (!team) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: eventData } = await supabase
        .from('teams')
        .select('event_id')
        .eq('id', team.id)
        .single();

      if (!eventData) return;

      // Upsert score
      const { error } = await supabase
        .from('scores')
        .upsert([
          {
            event_id: eventData.event_id,
            team_id: team.id,
            stop_id: stopId,
            strokes: strokes,
          },
        ]);

      if (error) throw error;

      loadTeam();
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const getScoreForStop = (stopId: string): number => {
    const score = scores.find(s => s.stop_id === stopId);
    return score?.strokes || 0;
  };

  const totalStrokes = scores.reduce((sum, score) => sum + score.strokes, 0);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <p className="text-white text-xl">🔍 Loading team...</p>
        </div>
      </main>
    );
  }

  if (!team) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <p className="text-white text-xl mb-4">Team not found</p>
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
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass rounded-2xl p-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              👥 {team.name}
            </h1>
            <p className="text-white/80">
              🎫 Join Code: <span className="font-bold text-white">{team.join_code}</span>
            </p>
            <p className="text-white/80 mt-2">
              ⛳ Total Strokes: <span className="font-bold text-white text-2xl">{totalStrokes}</span>
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scorecard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">⛳ Scorecard</h2>
              {stops.length === 0 ? (
                <p className="text-white/70">No stops added yet</p>
              ) : (
                <div className="space-y-3">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="glass-dark rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl font-bold text-white/50">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">
                            {stop.name}
                          </h3>
                          {stop.rule && (
                            <p className="text-sm text-white/70">
                              ⛳ {stop.rule}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={getScoreForStop(stop.id)}
                          onChange={(e) => updateScore(stop.id, parseInt(e.target.value) || 0)}
                          className="w-24 px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <span className="text-white/70">strokes</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Members */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Team Members</h2>
              {members.length > 0 && (
                <div className="space-y-2 mb-4">
                  {members.map((member) => (
                    <div key={member.id} className="glass-dark rounded-xl p-3">
                      <p className="text-white font-semibold">{member.nickname}</p>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={addMember} className="flex gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Add member..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  +
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
              <div className="space-y-2">
                <button className="w-full py-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors text-sm">
                  💬 Team Chat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
