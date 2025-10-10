'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { Event, ChatMessage } from '@/types';

export default function ChatPage() {
  const params = useParams();
  const eventCode = params.code as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameSet, setNicknameSet] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatRoom();
  }, [eventCode]);

  useEffect(() => {
    if (roomId) {
      loadMessages();
      // Set up real-time subscription
      const supabase = getSupabaseClient();
      if (supabase) {
        const channel = supabase
          .channel('chat-messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `room_id=eq.${roomId}`,
            },
            (payload) => {
              setMessages((prev) => [...prev, payload.new as ChatMessage]);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatRoom = async () => {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      // Fetch event
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('join_code', eventCode)
        .single();

      if (!eventData) {
        setLoading(false);
        return;
      }

      setEvent(eventData);

      // Get or create chat room
      const { data: roomData } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('event_id', eventData.id)
        .single();

      if (roomData) {
        setRoomId(roomData.id);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading chat room:', error);
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!roomId) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || !nickname) return;

    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            room_id: roomId,
            nickname: nickname,
            body: newMessage.trim(),
          },
        ]);

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const setNicknameHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setNicknameSet(true);
      localStorage.setItem('pubpal_nickname', nickname.trim());
    }
  };

  // Load saved nickname
  useEffect(() => {
    const saved = localStorage.getItem('pubpal_nickname');
    if (saved) {
      setNickname(saved);
      setNicknameSet(true);
    }
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <p className="text-white text-xl">🔍 Loading chat...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <p className="text-white text-xl mb-4">Event not found</p>
          <Link href="/">
            <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold">
              Go Home
            </button>
          </Link>
        </div>
      </main>
    );
  }

  // Nickname prompt
  if (!nicknameSet) {
    return (
      <main className="min-h-screen bg-gradient-party p-4 flex items-center justify-center">
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={setNicknameHandler}
          className="glass rounded-2xl p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            👤 Enter Your Nickname
          </h2>
          <input
            type="text"
            required
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 mb-4"
            placeholder="Your nickname..."
          />
          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            Join Chat
          </button>
        </motion.form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-party p-4">
      <div className="max-w-4xl mx-auto pt-8 h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Link href={`/e/${eventCode}`}>
            <button className="mb-2 px-4 py-2 glass rounded-xl text-white hover:bg-white/20 transition-colors">
              ← Back
            </button>
          </Link>
          <div className="glass rounded-2xl p-4">
            <h1 className="text-2xl font-bold text-white">
              💬 {event.name} Chat
            </h1>
            <p className="text-sm text-white/70">Chatting as {nickname}</p>
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 glass rounded-2xl p-4 overflow-y-auto mb-4"
        >
          {messages.length === 0 ? (
            <p className="text-white/70 text-center mt-8">
              No messages yet. Be the first to say something! 👋
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="glass-dark rounded-xl p-3">
                  <p className="text-sm font-semibold text-purple-300">
                    {message.nickname}
                  </p>
                  <p className="text-white mt-1">{message.body}</p>
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </motion.div>

        {/* Message Input */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={sendMessage}
          className="glass rounded-2xl p-4"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Send
            </button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}
