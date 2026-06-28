// Script to push schema and seed Turso database
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Read env
const env = readFileSync('.env', 'utf-8');
const lines = env.split('\n');
const vars: Record<string, string> = {};
for (const line of lines) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    vars[key.trim()] = vals.join('=').trim();
  }
}

console.log('Connecting to Turso...');
const client = createClient({
  url: vars.TURSO_DATABASE_URL,
  authToken: vars.TURSO_AUTH_TOKEN,
});

// Test connection
const result = await client.execute('SELECT 1 as test');
console.log('Connected! Test result:', result.rows[0].test);
