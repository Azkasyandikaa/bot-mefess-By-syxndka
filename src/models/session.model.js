import { pool } from '../config/db.js';

export async function findActiveSessionByTarget(targetWaId) {
  const result = await pool.query(
    `SELECT * FROM sessions
     WHERE target_wa_id = $1 AND status = 'active'
     ORDER BY started_at DESC
     LIMIT 1`,
    [targetWaId]
  );
  return result.rows[0] || null;
}