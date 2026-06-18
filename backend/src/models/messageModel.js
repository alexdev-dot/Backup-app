import { query } from '../config/database.js';

export const findConversationsByUser = async (userId) => {
  const { rows } = await query(
    `SELECT c.*,
       CASE WHEN c.customer_id = $1 THEN pu.full_name ELSE cu.full_name END AS other_user_name,
       CASE WHEN c.customer_id = $1 THEN c.unread_customer ELSE c.unread_professional END AS unread_count,
       (SELECT text       FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
       (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_time
     FROM conversations c
     JOIN users cu ON c.customer_id      = cu.id
     JOIN users pu ON c.professional_id  = pu.id
     WHERE c.customer_id = $1 OR c.professional_id = $1
     ORDER BY last_message_time DESC NULLS LAST`,
    [userId]
  );
  return rows;
};

export const findConversationById = async (id) => {
  const { rows } = await query(
    'SELECT * FROM conversations WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

export const findOrCreateConversation = async (customerId, professionalId, service) => {
  const { rows: existing } = await query(
    'SELECT * FROM conversations WHERE customer_id = $1 AND professional_id = $2 LIMIT 1',
    [customerId, professionalId]
  );
  if (existing[0]) return existing[0];
  const { rows } = await query(
    `INSERT INTO conversations (customer_id, professional_id, service)
     VALUES ($1, $2, $3) RETURNING *`,
    [customerId, professionalId, service]
  );
  return rows[0];
};

export const getMessages = async (conversationId) => {
  const { rows } = await query(
    `SELECT m.*, u.full_name AS sender_name
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = $1
     ORDER BY m.created_at ASC`,
    [conversationId]
  );
  return rows;
};

export const sendMessage = async ({ conversation_id, sender_id, receiver_id, text }) => {
  const { rows } = await query(
    `INSERT INTO messages (conversation_id, sender_id, receiver_id, text)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [conversation_id, sender_id, receiver_id, text]
  );
  return rows[0];
};

export const incrementUnread = async (conversationId, isCustomerSender) => {
  const col = isCustomerSender ? 'unread_professional' : 'unread_customer';
  await query(
    `UPDATE conversations SET ${col} = ${col} + 1 WHERE id = $1`,
    [conversationId]
  );
};

export const markAsRead = async (conversationId, userId) => {
  const conv = await findConversationById(conversationId);
  if (!conv) return;
  const col = conv.customer_id === userId ? 'unread_customer' : 'unread_professional';
  await query(`UPDATE conversations SET ${col} = 0 WHERE id = $1`, [conversationId]);
};

export const userBelongsToConversation = async (conversationId, userId) => {
  const { rows } = await query(
    'SELECT id FROM conversations WHERE id = $1 AND (customer_id = $2 OR professional_id = $2) LIMIT 1',
    [conversationId, userId]
  );
  return rows.length > 0;
};
