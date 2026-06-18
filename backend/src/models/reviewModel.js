import { supabase } from '../config/database.js';

export const findByProfessional = async (professionalUserId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, customer:users!reviews_customer_id_fkey(full_name)')
    .eq('professional_id', professionalUserId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(r => ({ ...r, customer_name: r.customer?.full_name, customer: undefined }));
};

export const findByCustomer = async (customerId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, professional:users!reviews_professional_id_fkey(full_name)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(r => ({ ...r, professional_name: r.professional?.full_name, professional: undefined }));
};

export const create = async (customerId, { professional_id, booking_id, rating, comment }) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      customer_id: customerId,
      professional_id,
      booking_id: booking_id || null,
      rating,
      comment: comment || null,
    })
    .select('*').single();
  if (error) throw error;
  return data;
};
