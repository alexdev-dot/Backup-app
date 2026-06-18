import { query } from '../config/database.js';

export const findByEmail = async (email) => {
  const { rows } = await query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

export const findById = async (id) => {
  const { rows } = await query(
    'SELECT id, full_name, email, phone, role, location, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

export const create = async ({ fullName, email, phone, password, role }) => {
  const { rows } = await query(
    `INSERT INTO users (full_name, email, phone, password, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, full_name, email, phone, role, created_at`,
    [fullName, email, phone, password, role]
  );
  return rows[0];
};

export const updateById = async (id, { full_name, email, phone, location }) => {
  const { rows } = await query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         email     = COALESCE($2, email),
         phone     = COALESCE($3, phone),
         location  = COALESCE($4, location)
     WHERE id = $5
     RETURNING id, full_name, email, phone, role, location, updated_at`,
    [full_name, email, phone, location, id]
  );
  return rows[0] || null;
};

export const emailExists = async (email, excludeId = null) => {
  const { rows } = await query(
    'SELECT id FROM users WHERE email = $1 AND id != $2',
    [email, excludeId || 0]
  );
  return rows.length > 0;
};
