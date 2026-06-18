import { query } from '../config/database.js';

export const findByCustomerId = async (customerId) => {
  const { rows } = await query(
    `SELECT b.*, u.full_name AS professional_name
     FROM bookings b
     JOIN users u ON b.professional_id = u.id
     WHERE b.customer_id = $1
     ORDER BY b.created_at DESC`,
    [customerId]
  );
  return rows;
};

export const findByProfessionalId = async (professionalId) => {
  const { rows } = await query(
    `SELECT b.*, u.full_name AS customer_name
     FROM bookings b
     JOIN users u ON b.customer_id = u.id
     WHERE b.professional_id = $1
     ORDER BY b.created_at DESC`,
    [professionalId]
  );
  return rows;
};

export const findByIdAndOwner = async (id, userId) => {
  const { rows } = await query(
    `SELECT b.*, u.full_name AS professional_name
     FROM bookings b
     JOIN users u ON b.professional_id = u.id
     WHERE b.id = $1 AND (b.customer_id = $2 OR b.professional_id = $2)
     LIMIT 1`,
    [id, userId]
  );
  return rows[0] || null;
};

export const create = async (customerId, { professional_id, service, date, time, location, amount }) => {
  const { rows } = await query(
    `INSERT INTO bookings (customer_id, professional_id, service, date, time, location, amount)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [customerId, professional_id, service, date, time, location, amount]
  );
  return rows[0];
};

export const updateStatus = async (id, status, userId) => {
  const { rows } = await query(
    `UPDATE bookings SET status = $1
     WHERE id = $2 AND (customer_id = $3 OR professional_id = $3)
     RETURNING *`,
    [status, id, userId]
  );
  return rows[0] || null;
};
