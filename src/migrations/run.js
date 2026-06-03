import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id BIGSERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

async function run() {
  await ensureMigrationsTable();

  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const alreadyApplied = await pool.query(
      `SELECT 1 FROM migrations WHERE filename = $1 LIMIT 1`,
      [file]
    );

    if (alreadyApplied.rowCount > 0) {
      console.log(`Skipping migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

    console.log(`Running migration: ${file}`);

    await pool.query('BEGIN');
    try {
      await pool.query(sql);
      await pool.query(
        `INSERT INTO migrations (filename) VALUES ($1)`,
        [file]
      );
      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }

  await pool.end();
  console.log('Migrations completed');
}

run().catch(async (err) => {
  console.error('Migration failed:', err);
  await pool.end().catch(() => {});
  process.exit(1);
});