import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.js",     // your schema file
  out: "./drizzle",                // folder for migrations
  dialect: "postgresql",           // keep as postgresql
  driver: "pglite",                // lightweight Postgres-like local DB
  dbCredentials: {
    url: "./database/",            // local folder where DB will live
  },

  extensionsFilters: [],           // optional
  schemaFilter: "public",
  tablesFilter: "*",

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  strict: true,
  verbose: true,
});