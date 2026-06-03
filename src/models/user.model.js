import { pool } from '../config/db.js';

export async function findUserByWaId(waId) {
  const result = await pool.query(
    `SELECT * FROM users WHERE wa_id = $1 LIMIT 1`,
    [waId]
  );
  return result.rows[0] || null;
}

export async function createUser({ waId, displayName, role = 'user' }) {
  const result = await pool.query(
    `INSERT INTO users (wa_id, display_name, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [waId, displayName, role]
  );
  return result.rows[0];
}