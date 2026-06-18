import { supabase } from '../config/database.js';

export const findAll = async ({ category } = {}) => {
  let q = supabase.from('services').select('*').order('name', { ascending: true });
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
};

export const findById = async (id) => {
  const { data, error } = await supabase
    .from('services').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
};
