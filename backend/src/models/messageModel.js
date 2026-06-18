import { supabase } from '../config/database.js';

export const findConversationsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      customer:users!conversations_customer_id_fkey(full_name),
      professional:users!conversations_professional_id_fkey(full_name)
    `)
    .or(`customer_id.eq.${userId},professional_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
  if (error) throw error;

  const convIds = (data || []).map(c => c.id);
  let lastMsgs = {};
  if (convIds.length > 0) {
    const { data: msgs } = await supabase
      .from('messages').select('conversation_id, text, created_at')
      .in('conversation_id', convIds)
      .order('created_at', { ascending: false });
    for (const m of msgs || []) {
      if (!lastMsgs[m.conversation_id]) lastMsgs[m.conversation_id] = m;
    }
  }

  return (data || []).map(c => ({
    ...c,
    other_user_name: c.customer_id === userId
      ? c.professional?.full_name
      : c.customer?.full_name,
    unread_count: c.customer_id === userId ? c.unread_customer : c.unread_professional,
    last_message:      lastMsgs[c.id]?.text       || null,
    last_message_time: lastMsgs[c.id]?.created_at || null,
    customer: undefined,
    professional: undefined,
  }));
};

export const findConversationById = async (id) => {
  const { data, error } = await supabase
    .from('conversations').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data || null;
};

export const findOrCreateConversation = async (customerId, professionalId, service) => {
  const { data: existing } = await supabase
    .from('conversations')
    .select('*').eq('customer_id', customerId).eq('professional_id', professionalId).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase
    .from('conversations')
    .insert({ customer_id: customerId, professional_id: professionalId, service })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const getMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!messages_sender_id_fkey(full_name)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(m => ({ ...m, sender_name: m.sender?.full_name, sender: undefined }));
};

export const sendMessage = async ({ conversation_id, sender_id, receiver_id, text }) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id, sender_id, receiver_id, text })
    .select('*').single();
  if (error) throw error;
  return data;
};

export const incrementUnread = async (conversationId, isCustomerSender) => {
  const col = isCustomerSender ? 'unread_professional' : 'unread_customer';
  const { data } = await supabase
    .from('conversations').select(col).eq('id', conversationId).single();
  if (data) {
    await supabase.from('conversations')
      .update({ [col]: (data[col] || 0) + 1 })
      .eq('id', conversationId);
  }
};

export const markAsRead = async (conversationId, userId) => {
  const conv = await findConversationById(conversationId);
  if (!conv) return;
  const col = conv.customer_id === userId ? 'unread_customer' : 'unread_professional';
  await supabase.from('conversations').update({ [col]: 0 }).eq('id', conversationId);
};

export const userBelongsToConversation = async (conversationId, userId) => {
  const { data, error } = await supabase
    .from('conversations').select('id').eq('id', conversationId)
    .or(`customer_id.eq.${userId},professional_id.eq.${userId}`)
    .maybeSingle();
  if (error) throw error;
  return !!data;
};
