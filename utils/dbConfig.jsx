import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '/schema'
const sql = 'postgresql://neondb_owner:npg_uU1BOgmvG3iS@ep-bold-cherry-aifnrxoj-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const db = drizzle({ client: sql }, { schema });