import { Client } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Applies migrations/*.sql in order using the admin connection.
async function run(): Promise<void> {
  const client = new Client({ connectionString: process.env.DATABASE_ADMIN_URL });
  await client.connect();
  try {
    const dir = join(__dirname, '..', '..', '..', 'migrations');
    const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    for (const f of files) {
      console.log('Applying ' + f);
      await client.query(readFileSync(join(dir, f), 'utf8'));
    }
  } finally {
    await client.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
