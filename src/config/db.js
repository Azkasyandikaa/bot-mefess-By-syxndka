import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  host: env.dbHost,
  port: Number(env.dbPort),
  database: env.dbName,
  user: env.dbUser,
  password: env.dbPassword,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('error', (err) => {
  console.error('Unexpected PG pool error', err);
});