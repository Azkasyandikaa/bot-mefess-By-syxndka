CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  sender_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_wa_id VARCHAR(32) NOT NULL,
  target_name VARCHAR(128),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  source_type VARCHAR(20) NOT NULL DEFAULT 'confess',
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP NULL,
  last_activity_at TIMESTAMP NOT NULL DEFAULT NOW()
);