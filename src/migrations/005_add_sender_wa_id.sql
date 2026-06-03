ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS sender_wa_id VARCHAR(32);

CREATE INDEX IF NOT EXISTS idx_sessions_sender_wa_id
ON sessions(sender_wa_id);

CREATE INDEX IF NOT EXISTS idx_sessions_target_wa_id
ON sessions(target_wa_id);