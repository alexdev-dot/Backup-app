import { query } from '../config/database.js';

export const findAllPublic = async ({ category, status = 'active' } = {}) => {
  let sql = `SELECT j.*, u.full_name AS customer_name
             FROM jobs j JOIN users u ON j.customer_id = u.id
             WHERE j.status = $1`;
  const params = [status];
  if (category) { params.push(category); sql += ` AND j.category = $${params.length}`; }
  sql += ' ORDER BY j.created_at DESC';
  const { rows } = await query(sql, params);
  return rows;
};

export const findByCustomerId = async (customerId) => {
  const { rows } = await query(
    `SELECT * FROM jobs WHERE customer_id = $1 ORDER BY created_at DESC`,
    [customerId]
  );
  return rows;
};

export const findByIdAndCustomer = async (id, customerId) => {
  const { rows } = await query(
    'SELECT * FROM jobs WHERE id = $1 AND customer_id = $2 LIMIT 1',
    [id, customerId]
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const { rows } = await query(
    `SELECT j.*, u.full_name AS customer_name
     FROM jobs j JOIN users u ON j.customer_id = u.id
     WHERE j.id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const create = async (customerId, { title, description, category, budget, location }) => {
  const { rows } = await query(
    `INSERT INTO jobs (customer_id, title, description, category, budget, location)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [customerId, title, description, category, budget, location]
  );
  return rows[0];
};

export const update = async (id, customerId, fields) => {
  const { title, description, category, budget, location, status } = fields;
  const { rows } = await query(
    `UPDATE jobs
     SET title       = COALESCE($1, title),
         description = COALESCE($2, description),
         category    = COALESCE($3, category),
         budget      = COALESCE($4, budget),
         location    = COALESCE($5, location),
         status      = COALESCE($6, status)
     WHERE id = $7 AND customer_id = $8
     RETURNING *`,
    [title, description, category, budget, location, status, id, customerId]
  );
  return rows[0] || null;
};

export const remove = async (id, customerId) => {
  const { rowCount } = await query(
    'DELETE FROM jobs WHERE id = $1 AND customer_id = $2',
    [id, customerId]
  );
  return rowCount > 0;
};

export const incrementViews = async (id) => {
  await query('UPDATE jobs SET views_count = views_count + 1 WHERE id = $1', [id]);
};
