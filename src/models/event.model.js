import { pool } from '../config/db.js';

export async function insertEvent({ sessionId = null, messageId = null, eventType, payload }) {
  const result = await pool.query(
    `INSERT INTO events (session_id, message_id, event_type, payload)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [sessionId, messageId, eventType, payload]
  );
  return result.rows[0];
}