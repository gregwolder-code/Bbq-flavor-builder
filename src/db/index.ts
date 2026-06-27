import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Use Turso if configured, otherwise fall back to local SQLite
const url = process.env.TURSO_DATABASE_URL || 'file:./bbq-flavor-builder.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log('Initializing DB client with URL:', url);

const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });
