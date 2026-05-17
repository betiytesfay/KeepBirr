import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default defineConfig({
  schema: "./db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  strict: true,
  verbose: true,
});