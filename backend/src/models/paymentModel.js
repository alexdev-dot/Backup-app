import { supabase } from '../config/database.js';

export const getMethodsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('id, user_id, type, number, is_default, expiry, created_at')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addMethod = async (userId, { type, number, expiry }) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .insert({ user_id: userId, type, number, expiry })
    .select('id, user_id, type, number, is_default, expiry, created_at')
    .single();
  if (error) throw error;
  return data;
};

export const setDefault = async (id, userId) => {
  await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', userId);
  const { data, error } = await supabase
    .from('payment_methods').update({ is_default: true })
    .eq('id', id).eq('user_id', userId).select('*').maybeSingle();
  if (error) throw error;
  return data || null;
};

export const removeMethod = async (id, userId) => {
  const { data, error } = await supabase
    .from('payment_methods').delete().eq('id', id).eq('user_id', userId).select('id');
  if (error) throw error;
  return (data || []).length > 0;
};

export const getTransactionsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('transactions').select('*').eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createTransaction = async (userId, { description, amount, date, status, method }) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ user_id: userId, description, amount, date, status, method })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const getInvoicesByUser = async (userId) => {
  const { data, error } = await supabase
    .from('invoices').select('*').eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createInvoice = async (userId, { number, description, amount, date, due_date }) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert({ user_id: userId, number, description, amount, date, due_date })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const updateInvoiceStatus = async (id, userId, status) => {
  const { data, error } = await supabase
    .from('invoices').update({ status }).eq('id', id).eq('user_id', userId)
    .select('*').maybeSingle();
  if (error) throw error;
  return data || null;
};
