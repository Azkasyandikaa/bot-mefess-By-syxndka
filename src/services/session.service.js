import { pool } from '../config/db.js';

export async function createSession({
  senderUserId,
  senderWaId,
  targetWaId,
  targetName = null,
  sourceType = 'confess'
}) {
  const result = await pool.query(
    `
    INSERT INTO sessions
      (sender_user_id, sender_wa_id, target_wa_id, target_name, status, source_type, started_at, last_activity_at)
    VALUES
      ($1, $2, $3, $4, 'active', $5, NOW(), NOW())
    RETURNING *
    `,
    [senderUserId, senderWaId, targetWaId, targetName, sourceType]
  );

  return result.rows[0];
}

export async function getSessionById(id) {
  const result = await pool.query(
    `SELECT * FROM sessions WHERE id = $1 LIMIT 1`,
    [id]
  );

  return result.rows[0] || null;
}

export async function getActiveSessionBySenderWaId(senderWaId) {
  const result = await pool.query(
    `
    SELECT *
    FROM sessions
    WHERE sender_wa_id = $1
      AND status = 'active'
    ORDER BY started_at DESC
    LIMIT 1
    `,
    [senderWaId]
  );

  return result.rows[0] || null;
}

export async function getActiveSessionByTargetWaId(targetWaId) {
  const result = await pool.query(
    `
    SELECT *
    FROM sessions
    WHERE target_wa_id = $1
      AND status = 'active'
    ORDER BY started_at DESC
    LIMIT 1
    `,
    [targetWaId]
  );

  return result.rows[0] || null;
}

export async function updateSessionActivity(sessionId) {
  const result = await pool.query(
    `
    UPDATE sessions
    SET last_activity_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [sessionId]
  );

  return result.rows[0] || null;
}

export async function closeSession(sessionId) {
  const result = await pool.query(
    `
    UPDATE sessions
    SET status = 'closed',
        closed_at = NOW(),
        last_activity_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [sessionId]
  );

  return result.rows[0] || null;
}