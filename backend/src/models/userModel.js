import { supabase } from '../config/database.js';

export const findByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users').select('*').eq('email', email).maybeSingle();
  if (error) throw error;
  return data || null;
};

export const findById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, phone, role, location, created_at, updated_at')
    .eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
};

export const create = async ({ fullName, email, phone, password, role }) => {
  const { data, error } = await supabase
    .from('users')
    .insert({ full_name: fullName, email, phone, password, role })
    .select('id, full_name, email, phone, role, created_at')
    .single();
  if (error) throw error;
  return data;
};

export const updateById = async (id, { full_name, email, phone, location }) => {
  const updates = {};
  if (full_name !== undefined) updates.full_name = full_name;
  if (email     !== undefined) updates.email     = email;
  if (phone     !== undefined) updates.phone     = phone;
  if (location  !== undefined) updates.location  = location;
  const { data, error } = await supabase
    .from('users').update(updates).eq('id', id)
    .select('id, full_name, email, phone, role, location, updated_at').maybeSingle();
  if (error) throw error;
  return data || null;
};

export const emailExists = async (email, excludeId = null) => {
  let q = supabase.from('users').select('id').eq('email', email);
  if (excludeId) q = q.neq('id', excludeId);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).length > 0;
};
