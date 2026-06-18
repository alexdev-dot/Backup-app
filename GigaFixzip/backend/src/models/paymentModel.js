import { query } from '../config/database.js';

export const getMethodsByUser = async (userId) => {
  const { rows } = await query(
    'SELECT id, user_id, type, number, is_default, expiry, created_at FROM payment_methods WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return rows;
};

export const addMethod = async (userId, { type, number, expiry }) => {
  const { rows } = await query(
    `INSERT INTO payment_methods (user_id, type, number, expiry)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, type, number, is_default, expiry, created_at`,
    [userId, type, number, expiry]
  );
  return rows[0];
};

export const setDefault = async (id, userId) => {
  await query('UPDATE payment_methods SET is_default = FALSE WHERE user_id = $1', [userId]);
  const { rows } = await query(
    'UPDATE payment_methods SET is_default = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return rows[0] || null;
};

export const removeMethod = async (id, userId) => {
  const { rowCount } = await query(
    'DELETE FROM payment_methods WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return rowCount > 0;
};

export const getTransactionsByUser = async (userId) => {
  const { rows } = await query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

export const createTransaction = async (userId, { description, amount, date, status, method }) => {
  const { rows } = await query(
    `INSERT INTO transactions (user_id, description, amount, date, status, method)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, description, amount, date, status, method]
  );
  return rows[0];
};

export const getInvoicesByUser = async (userId) => {
  const { rows } = await query(
    'SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

export const createInvoice = async (userId, { number, description, amount, date, due_date }) => {
  const { rows } = await query(
    `INSERT INTO invoices (user_id, number, description, amount, date, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, number, description, amount, date, due_date]
  );
  return rows[0];
};

export const updateInvoiceStatus = async (id, userId, status) => {
  const { rows } = await query(
    'UPDATE invoices SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [status, id, userId]
  );
  return rows[0] || null;
};
