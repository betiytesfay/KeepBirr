import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Configure pool with sensible limits to prevent connection/memory leaks in serverless and long-running modes
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.VERCEL ? 3 : 10, // Avoid connection exhaustion on serverless
  idleTimeoutMillis: 30000, // Release idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail fast if DB is unreachable
  ssl: process.env.DATABASE_URL?.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined,
});

export const db = drizzle(pool);