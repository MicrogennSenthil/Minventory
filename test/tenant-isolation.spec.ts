import { Client } from 'pg';

// Proves Row-Level Security isolates tenants. Needs the Docker DB + migration.
// Skipped automatically when DATABASE_URL / DATABASE_ADMIN_URL are not set.
const run = process.env.DATABASE_URL && process.env.DATABASE_ADMIN_URL ? describe : describe.skip;

run('tenant isolation (RLS)', () => {
  const admin = new Client({ connectionString: process.env.DATABASE_ADMIN_URL });
  const app = new Client({ connectionString: process.env.DATABASE_URL });
  let tenantA = '';
  let tenantB = '';

  beforeAll(async () => {
    await admin.connect();
    await app.connect();
    const a = await admin.query("INSERT INTO tenant (code,name) VALUES ('T_A_' || gen_random_uuid(),'A') RETURNING id");
    const b = await admin.query("INSERT INTO tenant (code,name) VALUES ('T_B_' || gen_random_uuid(),'B') RETURNING id");
    tenantA = a.rows[0].id;
    tenantB = b.rows[0].id;
  });

  afterAll(async () => {
    await admin.query('DELETE FROM item_category WHERE tenant_id IN ($1,$2)', [tenantA, tenantB]);
    await admin.query('DELETE FROM tenant WHERE id IN ($1,$2)', [tenantA, tenantB]);
    await admin.end();
    await app.end();
  });

  async function asTenant(id: string, sql: string, params: any[] = []) {
    await app.query('BEGIN');
    try {
      await app.query("SELECT set_config('app.tenant_id', $1, true)", [id]);
      const r = await app.query(sql, params);
      await app.query('COMMIT');
      return r;
    } catch (e) {
      await app.query('ROLLBACK');
      throw e;
    }
  }

  it('tenant B cannot see tenant A rows', async () => {
    await asTenant(tenantA, 'INSERT INTO item_category (tenant_id,code,name) VALUES ($1,$2,$3)', [tenantA, 'FOOD', 'Food']);
    const seenByB = await asTenant(tenantB, 'SELECT * FROM item_category');
    expect(seenByB.rows.length).toBe(0);
    const seenByA = await asTenant(tenantA, 'SELECT * FROM item_category');
    expect(seenByA.rows.length).toBe(1);
  });

  it('tenant B cannot insert a row for tenant A', async () => {
    await expect(
      asTenant(tenantB, 'INSERT INTO item_category (tenant_id,code,name) VALUES ($1,$2,$3)', [tenantA, 'X', 'X']),
    ).rejects.toThrow();
  });

  it('no tenant set returns nothing', async () => {
    const r = await app.query('SELECT * FROM item_category');
    expect(r.rows.length).toBe(0);
  });
});
