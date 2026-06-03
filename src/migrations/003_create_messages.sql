CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL,
  message_type VARCHAR(20) NOT NULL,
  body TEXT NULL,
  media_url TEXT NULL,
  provider_message_id VARCHAR(128) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);