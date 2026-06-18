import { supabase } from '../config/database.js';

export const findAllPublic = async ({ category, status = 'active' } = {}) => {
  let q = supabase
    .from('jobs')
    .select('*, customer:users!jobs_customer_id_fkey(full_name)')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(r => ({ ...r, customer_name: r.customer?.full_name, customer: undefined }));
};

export const findByCustomerId = async (customerId) => {
  const { data, error } = await supabase
    .from('jobs').select('*').eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const findById = async (id) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, customer:users!jobs_customer_id_fkey(full_name)')
    .eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...data, customer_name: data.customer?.full_name, customer: undefined };
};

export const create = async (customerId, { title, description, category, budget, location }) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ customer_id: customerId, title, description, category, budget, location })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const update = async (id, customerId, fields) => {
  const { title, description, category, budget, location, status } = fields;
  const updates = {};
  if (title       !== undefined) updates.title       = title;
  if (description !== undefined) updates.description = description;
  if (category    !== undefined) updates.category    = category;
  if (budget      !== undefined) updates.budget      = budget;
  if (location    !== undefined) updates.location    = location;
  if (status      !== undefined) updates.status      = status;
  const { data: existing } = await supabase
    .from('jobs').select('id').eq('id', id).eq('customer_id', customerId).maybeSingle();
  if (!existing) return null;
  const { data, error } = await supabase
    .from('jobs').update(updates).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
};

export const remove = async (id, customerId) => {
  const { data, error } = await supabase
    .from('jobs').delete().eq('id', id).eq('customer_id', customerId).select('id');
  if (error) throw error;
  return (data || []).length > 0;
};

export const incrementViews = async (id) => {
  const { data } = await supabase.from('jobs').select('views_count').eq('id', id).single();
  if (data) {
    await supabase.from('jobs').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id);
  }
};
