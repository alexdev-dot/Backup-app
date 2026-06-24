import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export const testConnection = async () => {
  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) {
    console.warn('[DB] Warning:', error.message);
    console.warn('[DB] Tables may not exist yet. Please run the schema SQL in your Supabase SQL Editor.');
    console.warn('[DB] Schema file: backend/schema.sql');
  } else {
    console.log('[DB] Supabase connection ready');
  }
};

/**
 * Set the current user ID in the PostgreSQL session for RLS policies
 * This is called after authentication to enable row-level security
 */
export const setCurrentUser = async (userId) => {
  if (!userId) return;
  try {
    await supabase.rpc('set_current_user_id', { user_id: userId });
  } catch (error) {
    console.warn('[DB] Failed to set current user for RLS:', error.message);
  }
};

/**
 * Clear the current user ID from the PostgreSQL session
 */
export const clearCurrentUser = async () => {
  try {
    await supabase.rpc('reset_current_user_id');
  } catch (error) {
    console.warn('[DB] Failed to clear current user for RLS:', error.message);
  }
};

export default supabase;
