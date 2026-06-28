import { createClient } from '@libsql/client';
import { readFileSync, existsSync, writeFileSync } from 'fs';

async function main() {
  const envContent = readFileSync('.env', 'utf-8');
  const vars: Record<string, string> = {};
  for (const line of envContent.split('\n')) {
    const eqIdx = line.indexOf('=');
    if (eqIdx > 0) {
      vars[line.substring(0, eqIdx).trim()] = line.substring(eqIdx + 1).trim();
    }
  }

  const url = vars['TURSO_DATABASE_URL'];
  const token = vars['TURSO_AUTH_TOKEN'];

  console.log('URL:', url?.substring(0, 50) + '...');
  console.log('Token set:', !!token);

  const client = createClient({ url, authToken: token });

  // Run schema SQL from drizzle migration
  const schemaSQL = readFileSync('drizzle/0000_lush_nomad.sql', 'utf-8');
  const statements = schemaSQL.split('--> statement-breakpoint');
  
  for (const stmt of statements) {
    const trimmed = stmt.trim();
    if (trimmed) {
      try {
        await client.execute(trimmed);
      } catch (e: any) {
        // Table already exists errors are ok
        if (!e.message?.includes('already exists')) {
          console.error('SQL Error:', e.message?.substring(0, 100));
        }
      }
    }
  }
  console.log('Schema pushed!');

  // Seed data
  const { execSync } = await import('child_process');
  execSync('npx tsx src/db/seed.ts', { 
    env: { ...process.env, TURSO_DATABASE_URL: url, TURSO_AUTH_TOKEN: token },
    stdio: 'inherit',
    cwd: process.cwd()
  });
}

main().catch(e => {
  console.error('Failed:', e.message);
  process.exit(1);
});
