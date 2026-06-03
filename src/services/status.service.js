import { pool } from '../config/db.js';

export async function updateMessageStatus(providerMessageId, status) {
  const result = await pool.query(
    `UPDATE messages
     SET status = $1
     WHERE provider_message_id = $2
     RETURNING *`,
    [status, providerMessageId]
  );

  return result.rows[0] || null;
}