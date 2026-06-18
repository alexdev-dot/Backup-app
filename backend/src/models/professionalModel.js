import { supabase } from '../config/database.js';

export const findAll = async ({ category, location } = {}) => {
  let q = supabase
    .from('professionals')
    .select('*, users!professionals_user_id_fkey(full_name, email, phone, location)')
    .order('rating', { ascending: false });
  if (category) q = q.eq('service_category', category);
  if (location) q = q.ilike('location', `%${location}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []).map(flattenUser);
};

export const findById = async (id) => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*, users!professionals_user_id_fkey(full_name, email, phone, location)')
    .eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? flattenUser(data) : null;
};

export const findByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('professionals').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data || null;
};

export const create = async (userId, { service_category, hourly_rate, response_time, location, description }) => {
  const { data, error } = await supabase
    .from('professionals')
    .insert({ user_id: userId, service_category, hourly_rate, response_time, location, description })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const updateByUserId = async (userId, fields) => {
  const { service_category, hourly_rate, response_time, location, description } = fields;
  const updates = {};
  if (service_category !== undefined) updates.service_category = service_category;
  if (hourly_rate       !== undefined) updates.hourly_rate       = hourly_rate;
  if (response_time     !== undefined) updates.response_time     = response_time;
  if (location          !== undefined) updates.location          = location;
  if (description       !== undefined) updates.description       = description;
  const { data, error } = await supabase
    .from('professionals').update(updates).eq('user_id', userId)
    .select('*').maybeSingle();
  if (error) throw error;
  return data || null;
};

export const updateRating = async (professionalUserId) => {
  const { data: reviews, error } = await supabase
    .from('reviews').select('rating').eq('professional_id', professionalUserId);
  if (error) throw error;
  const count  = (reviews || []).length;
  const rating = count > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / count
    : 0;
  await supabase
    .from('professionals')
    .update({ rating: parseFloat(rating.toFixed(2)), reviews_count: count })
    .eq('user_id', professionalUserId);
};

const flattenUser = (row) => {
  const { users, ...rest } = row;
  return {
    ...rest,
    full_name:     users?.full_name,
    email:         users?.email,
    phone:         users?.phone,
    user_location: users?.location,
  };
};
