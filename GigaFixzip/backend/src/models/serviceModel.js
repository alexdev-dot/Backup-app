import { query } from '../config/database.js';

export const findAll = async ({ category } = {}) => {
  let sql = 'SELECT * FROM services WHERE 1=1';
  const params = [];
  if (category) { params.push(category); sql += ` AND category = $${params.length}`; }
  sql += ' ORDER BY name ASC';
  const { rows } = await query(sql, params);
  return rows;
};

export const findById = async (id) => {
  const { rows } = await query('SELECT * FROM services WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
};

export const create = async ({ name, category, description }) => {
  const { rows } = await query(
    'INSERT INTO services (name, category, description) VALUES ($1, $2, $3) RETURNING *',
    [name, category, description]
  );
  return rows[0];
};
