import { createClient } from '@libsql/client';
import { writeFileSync } from 'fs';

const c = createClient({
  url: 'libsql://bbq-flavor-builder-gregwolder-code.aws-us-east-2.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI1NzI2ODMsImlkIjoiMDE5ZjA5OWItM2UwMS03ZDRkLWJjYjktNmYyNDYzZGNiZGYyIiwicmlkIjoiZGU3ZDliOTItZTBiYi00MjAzLTgzYmQtMWJkZGFmZjBhMTY2In0.Di_RflNL2V9Ic7-DbtjsFDLLgVp2rXDg4nFXfjs8gYXYmHdFX8yr-X5BcsdzhgeyySF2dNXsZh5RO8I8WDeCDw'
});

const [p, m, f, t] = await Promise.all([
  c.execute('SELECT COUNT(*) as c FROM proteins'),
  c.execute('SELECT COUNT(*) as c FROM cooking_methods'),
  c.execute('SELECT COUNT(*) as c FROM flavor_profiles'),
  c.execute('SELECT COUNT(*) as c FROM recipe_templates')
]);

const result = {
  proteins: p.rows[0].c,
  methods: m.rows[0].c,
  flavors: f.rows[0].c,
  templates: t.rows[0].c
};

writeFileSync('/home/team/shared/turso-result.txt', JSON.stringify(result));
console.log('Result:', JSON.stringify(result));
