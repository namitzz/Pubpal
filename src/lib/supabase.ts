import { createClient } from '@supabase/supabase-js';

// Create supabase client only on client side
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Backward compatibility
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null;

// Helper function to generate random join code
export function generateJoinCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
