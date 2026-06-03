import { pool } from '../config/db.js';

export async function insertMessage(data) {
  const result = await pool.query(
    `INSERT INTO messages
     (session_id, direction, message_type, body, media_url, provider_message_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      data.sessionId,
      data.direction,
      data.messageType,
      data.body || null,
      data.mediaUrl || null,
      data.providerMessageId || null,
      data.status || 'queued'
    ]
  );
  return result.rows[0];
}