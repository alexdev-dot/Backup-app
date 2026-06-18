import { query } from '../config/database.js';

export const findAll = async ({ category, location } = {}) => {
  let sql = `
    SELECT p.*, u.full_name, u.email, u.phone, u.location AS user_location
    FROM professionals p
    JOIN users u ON p.user_id = u.id
    WHERE 1=1`;
  const params = [];
  if (category) { params.push(category); sql += ` AND p.service_category = $${params.length}`; }
  if (location) { params.push(`%${location}%`); sql += ` AND (p.location ILIKE $${params.length} OR u.location ILIKE $${params.length})`; }
  sql += ' ORDER BY p.rating DESC';
  const { rows } = await query(sql, params);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await query(
    `SELECT p.*, u.full_name, u.email, u.phone, u.location AS user_location
     FROM professionals p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const findByUserId = async (userId) => {
  const { rows } = await query(
    'SELECT * FROM professionals WHERE user_id = $1 LIMIT 1',
    [userId]
  );
  return rows[0] || null;
};

export const create = async (userId, { service_category, hourly_rate, response_time, location, description }) => {
  const { rows } = await query(
    `INSERT INTO professionals (user_id, service_category, hourly_rate, response_time, location, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, service_category, hourly_rate, response_time, location, description]
  );
  return rows[0];
};

export const updateByUserId = async (userId, fields) => {
  const { service_category, hourly_rate, response_time, location, description } = fields;
  const { rows } = await query(
    `UPDATE professionals
     SET service_category = COALESCE($1, service_category),
         hourly_rate      = COALESCE($2, hourly_rate),
         response_time    = COALESCE($3, response_time),
         location         = COALESCE($4, location),
         description      = COALESCE($5, description)
     WHERE user_id = $6
     RETURNING *`,
    [service_category, hourly_rate, response_time, location, description, userId]
  );
  return rows[0] || null;
};

export const updateRating = async (professionalUserId) => {
  await query(
    `UPDATE professionals
     SET rating        = COALESCE((SELECT AVG(rating) FROM reviews WHERE professional_id = $1), 0),
         reviews_count = (SELECT COUNT(*) FROM reviews WHERE professional_id = $1)
     WHERE user_id = $1`,
    [professionalUserId]
  );
};
