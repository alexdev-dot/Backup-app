import { query } from '../config/database.js';

export const findByProfessional = async (professionalId) => {
  const { rows } = await query(
    `SELECT r.*, u.full_name AS customer_name
     FROM reviews r
     JOIN users u ON r.customer_id = u.id
     WHERE r.professional_id = $1
     ORDER BY r.created_at DESC`,
    [professionalId]
  );
  return rows;
};

export const findByCustomer = async (customerId) => {
  const { rows } = await query(
    `SELECT r.*, u.full_name AS professional_name
     FROM reviews r
     JOIN users u ON r.professional_id = u.id
     WHERE r.customer_id = $1
     ORDER BY r.created_at DESC`,
    [customerId]
  );
  return rows;
};

export const create = async (customerId, { professional_id, booking_id, rating, comment }) => {
  const { rows } = await query(
    `INSERT INTO reviews (customer_id, professional_id, booking_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [customerId, professional_id, booking_id || null, rating, comment || null]
  );
  return rows[0];
};
