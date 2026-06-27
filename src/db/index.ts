import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

function createDb() {
  const url = process.env.TURSO_DATABASE_URL || 'file:./bbq-flavor-builder.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url, ...(authToken ? { authToken } : {}) });
  return drizzle(client, { schema });
}

export const db = createDb();
