import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const url = 'libsql://bbq-flavor-builder-gregwolder-code.aws-us-east-2.turso.io';
const token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI1NzI2ODMsImlkIjoiMDE5ZjA5OWItM2UwMS03ZDRkLWJjYjktNmYyNDYzZGNiZGYyIiwicmlkIjoiZGU3ZDliOTItZTBiYi00MjAzLTgzYmQtMWJkZGFmZjBhMTY2In0.Di_RflNL2V9Ic7-DbtjsFDLLgVp2rXDg4nFXfjs8gYXYmHdFX8yr-X5BcsdzhgeyySF2dNXsZh5RO8I8WDeCDw';

const client = createClient({ url, authToken: token });

try {
  // Run the migration SQL
  const schemaSQL = readFileSync('/home/team/shared/bbq-flavor-builder/drizzle/0000_lush_nomad.sql', 'utf-8');
  const statements = schemaSQL.split('--> statement-breakpoint;').map(s => s.trim()).filter(Boolean);
  
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (e: any) {
      if (!e.message?.includes('already exists')) {
        // Ignore "already exists" errors
      }
    }
  }
  
  // Verify schema exists
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Tables:', tables.rows.map(r => r.name).join(', '));
  
} catch (e: any) {
  console.error('Error:', e.message);
}
