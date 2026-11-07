import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { currentTenant } from '../tenant/tenant-context';

// Every query runs inside a transaction with app.tenant_id set,
// so PostgreSQL Row-Level Security enforces tenant isolation.
@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly pool = new Pool({ connectionString: process.env.DATABASE_URL });

  async withTenant<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const tenant = currentTenant();
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // set_config(..., true) = local to this transaction
      await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenant.tenantId]);
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
