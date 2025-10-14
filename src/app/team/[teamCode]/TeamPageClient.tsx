'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { Team, Member, Score, Stop } from '@/types';
import Tabs, { TabItem } from '@/components/Tabs';

export default function TeamPage() {
  const params = useParams();
  const teamCode = params.teamCode as string;
  
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMemberName, setNewMemberName] = useState('');
  const [activeTab, setActiveTab] = useState('scorecard');

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
  const completedStops = scores.filter(s => s.strokes > 0).length;

  // Prepare tabs
  const tabs: TabItem[] = [
    {
      id: 'scorecard',
      label: 'Scorecard',
      icon: '⛳',
      content: (
        <div className="glass rounded-2xl p-4 sm:p-6">
          {stops.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/70 text-base mb-4">No stops added yet</p>
              <p className="text-white/50 text-sm">The event organizer needs to add stops first</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stops.map((stop, index) => (
                <motion.div 
                  key={stop.id} 
                  className="glass-dark rounded-xl p-4 hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl sm:text-3xl font-bold text-white/50 min-w-[40px]">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {stop.name}
                      </h3>
                      {stop.rule && (
                        <p className="text-xs sm:text-sm text-white/70 mt-1">
                          ⛳ {stop.rule}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      value={getScoreForStop(stop.id)}
                      onChange={(e) => updateScore(stop.id, parseInt(e.target.value) || 0)}
                      className="w-20 sm:w-24 px-3 py-2 text-center rounded-lg bg-white/20 text-white text-lg font-bold border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <span className="text-white/70 text-sm">strokes</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'members',
      label: 'Members',
      icon: '👥',
      content: (
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="text-xl font-bold text-white mb-4">Team Members</h3>
          {members.length > 0 ? (
            <div className="space-y-2 mb-4">
              {members.map((member, index) => (
                <motion.div 
                  key={member.id} 
                  className="glass-dark rounded-xl p-4 flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                    👤
                  </div>
                  <p className="text-white font-semibold text-base">{member.nickname}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-4">
              <p className="text-white/70 text-base">No members yet</p>
              <p className="text-white/50 text-sm mt-2">Add your first team member below</p>
            </div>
          )}
          <form onSubmit={addMember} className="space-y-3">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name..."
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-base"
            />
            <button
              type="submit"
              className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-base"
            >
              + Add Member
            </button>
          </form>
        </div>
      )
    },
    {
      id: 'info',
      label: 'Info',
      icon: 'ℹ️',
      content: (
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="glass-dark rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">Team Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Team Name</span>
                <span className="text-white font-semibold">{team?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Join Code</span>
                <span className="text-white font-bold bg-white/20 px-3 py-1 rounded-lg">{team?.join_code}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Members</span>
                <span className="text-white font-semibold">{members.length}</span>
              </div>
            </div>
          </div>
          
          <div className="glass-dark rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
                💬 Team Chat
              </button>
              <button 
                onClick={() => setActiveTab('scorecard')}
                className="w-full py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                ⛳ View Scorecard
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

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
    <main className="min-h-screen bg-gradient-party p-4 sm:p-6">
      <div className="max-w-5xl mx-auto pt-4 sm:pt-8 pb-8">
        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/">
            <button className="mb-4 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base">
              ← Back
            </button>
          </Link>
          
          <div className="glass rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  👥 {team.name}
                </h1>
                <p className="text-white/80 text-sm sm:text-base">
                  🎫 Code: <span className="font-bold text-white">{team.join_code}</span>
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="glass-dark rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{totalStrokes}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">Total Strokes</div>
              </div>
              <div className="glass-dark rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{completedStops}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">Completed</div>
              </div>
              <div className="glass-dark rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stops.length}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">Total Stops</div>
              </div>
              <div className="glass-dark rounded-xl p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{members.length}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">Members</div>
              </div>
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
