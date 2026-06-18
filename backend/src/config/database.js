import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: ws },
});

export const testConnection = async () => {
  const { error } = await supabase.from('users').select('id').limit(1);
  if (error) throw new Error(`[DB] Supabase connection failed: ${error.message}`);
  console.log('[DB] Supabase connection ready');
};

export default supabase;
