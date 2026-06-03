import { pool } from '../config/db.js';

export async function createMessage({
  sessionId,
  direction,
  messageType,
  body = null,
  mediaUrl = null,
  providerMessageId = null,
  status = 'queued'
}) {
  const result = await pool.query(
    `
    INSERT INTO messages
      (session_id, direction, message_type, body, media_url, provider_message_id, status)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [sessionId, direction, messageType, body, mediaUrl, providerMessageId, status]
  );

  return result.rows[0];
}

export async function getMessageById(id) {
  const result = await pool.query(
    `SELECT * FROM messages WHERE id = $1 LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
}

export async function getMessageByProviderMessageId(providerMessageId) {
  const result = await pool.query(
    `SELECT * FROM messages WHERE provider_message_id = $1 LIMIT 1`,
    [providerMessageId]
  );

  return result.rows[0] || null;
}

export async function updateMessageProviderMessageId(id, providerMessageId) {
  const result = await pool.query(
    `
    UPDATE messages
    SET provider_message_id = $1
    WHERE id = $2
    RETURNING *
    `,
    [providerMessageId, id]
  );

  return result.rows[0] || null;
}

export async function updateMessageStatusById(id, status) {
  const result = await pool.query(
    `
    UPDATE messages
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, id]
  );

  return result.rows[0] || null;
}