import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

function createDb() {
  const url = process.env.TURSO_DATABASE_URL || 'file:./bbq-flavor-builder.db';
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url, ...(authToken ? { authToken } : {}) });
  return drizzle(client, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

// Lazy proxy - only connects when first used
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    return (getDb() as any)[prop];
  }
});
