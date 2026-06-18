import { supabase } from '../config/database.js';

export const findByCustomerId = async (customerId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, professional:users!bookings_professional_id_fkey(full_name)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(r => ({ ...r, professional_name: r.professional?.full_name, professional: undefined }));
};

export const findByProfessionalId = async (professionalId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, customer:users!bookings_customer_id_fkey(full_name)')
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(r => ({ ...r, customer_name: r.customer?.full_name, customer: undefined }));
};

export const findByIdAndOwner = async (id, userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, professional:users!bookings_professional_id_fkey(full_name)')
    .eq('id', id)
    .or(`customer_id.eq.${userId},professional_id.eq.${userId}`)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { ...data, professional_name: data.professional?.full_name, professional: undefined };
};

export const create = async (customerId, { professional_id, service, date, time, location, amount }) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ customer_id: customerId, professional_id, service, date, time, location, amount })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const updateStatus = async (id, status, userId) => {
  const { data: existing } = await supabase
    .from('bookings').select('id')
    .eq('id', id)
    .or(`customer_id.eq.${userId},professional_id.eq.${userId}`)
    .maybeSingle();
  if (!existing) return null;
  const { data, error } = await supabase
    .from('bookings').update({ status }).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
};
