import { NotFoundException } from '@nestjs/common';
import { DbService } from '../../common/db/db.service';
import { currentTenant } from '../../common/tenant/tenant-context';

// Reusable CRUD for tenant-scoped masters. Table and column names are fixed
// in code by each subclass (never from user input); values are parameterised.
export abstract class BaseMasterService {
  protected abstract readonly table: string;
  protected abstract readonly columns: string[]; // editable columns

  constructor(protected readonly db: DbService) {}

  list(): Promise<any[]> {
    return this.db.withTenant(async (c) => {
      const r = await c.query('SELECT * FROM ' + this.table + ' ORDER BY code');
      return r.rows;
    });
  }

  async get(id: string): Promise<any> {
    const rows = await this.db.withTenant(async (c) => {
      const r = await c.query('SELECT * FROM ' + this.table + ' WHERE id = $1', [id]);
      return r.rows;
    });
    if (rows.length === 0) throw new NotFoundException('Not found');
    return rows[0];
  }

  create(data: any): Promise<any> {
    const tenantId = currentTenant().tenantId;
    const cols = this.columns.filter((k) => data[k] !== undefined);
    const names = ['tenant_id'].concat(cols);
    const values: any[] = [tenantId].concat(cols.map((k) => data[k]));
    const params = names.map((_, i) => '$' + (i + 1));
    return this.db.withTenant(async (c) => {
      const r = await c.query(
        'INSERT INTO ' + this.table + ' (' + names.join(',') + ') VALUES (' + params.join(',') + ') RETURNING *',
        values,
      );
      return r.rows[0];
    });
  }

  async update(id: string, data: any): Promise<any> {
    const cols = this.columns.filter((k) => data[k] !== undefined);
    if (cols.length === 0) return this.get(id);
    const sets = cols.map((k, i) => k + ' = $' + (i + 1));
    const values: any[] = cols.map((k) => data[k]);
    values.push(id);
    const rows = await this.db.withTenant(async (c) => {
      const r = await c.query(
        'UPDATE ' + this.table + ' SET ' + sets.join(',') + ', updated_at = now() WHERE id = $' + values.length + ' RETURNING *',
        values,
      );
      return r.rows;
    });
    if (rows.length === 0) throw new NotFoundException('Not found');
    return rows[0];
  }

  async remove(id: string): Promise<void> {
    const count = await this.db.withTenant(async (c) => {
      const r = await c.query('DELETE FROM ' + this.table + ' WHERE id = $1', [id]);
      return r.rowCount;
    });
    if (!count) throw new NotFoundException('Not found');
  }
}
