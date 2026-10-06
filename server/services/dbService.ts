import crypto from 'crypto';
import { query } from '../database/connection';

export interface QueryFilters {
  organization_id?: number | string;
  [key: string]: any;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export const dbService = {
  /**
   * Find records using SQL with multi-tenant organization filtering
   */
  async find<T = any>(table: string, filters: QueryFilters = {}, options: QueryOptions = {}): Promise<T[]> {
    const whereClauses: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        whereClauses.push(`${key} = ?`);
        params.push(value);
      }
    }

    let sql = `SELECT * FROM ${table}`;
    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (options.orderBy) {
      const dir = options.orderDirection === 'ASC' ? 'ASC' : 'DESC';
      sql += ` ORDER BY ${options.orderBy} ${dir}`;
    } else {
      sql += ` ORDER BY id DESC`;
    }

    if (options.limit) {
      sql += ` LIMIT ${Number(options.limit)}`;
      if (options.offset) {
        sql += ` OFFSET ${Number(options.offset)}`;
      }
    }

    return query<T>(sql, params);
  },

  /**
   * Find a single record by ID with SQL, enforcing organization isolation
   */
  async findById<T = any>(table: string, id: number | string, orgId?: number | string): Promise<T | null> {
    const filters: QueryFilters = { id };
    if (orgId !== undefined) {
      filters.organization_id = orgId;
    }
    const results = await this.find<T>(table, filters, { limit: 1 });
    return results[0] || null;
  },

  /**
   * Find one record matching filters via SQL
   */
  async findOne<T = any>(table: string, filters: QueryFilters): Promise<T | null> {
    const results = await this.find<T>(table, filters, { limit: 1 });
    return results[0] || null;
  },

  /**
   * Create a new record using SQL INSERT
   */
  async create<T = any>(table: string, data: Record<string, any>): Promise<T> {
    const now = new Date().toISOString();
    const recordUuid = data.uuid || crypto.randomUUID();

    const insertData: Record<string, any> = {
      ...data,
      uuid: recordUuid,
      created_at: data.created_at || now,
    };

    const keys = Object.keys(insertData);
    const fields = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((k) => insertData[k]);

    const sql = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
    await query(sql, values);

    // Fetch the newly inserted record
    const created = await this.findOne<T>(table, { uuid: recordUuid });
    return created || (insertData as T);
  },

  /**
   * Update a record using SQL UPDATE, strictly enforcing organization isolation
   */
  async update<T = any>(table: string, id: number | string, data: Record<string, any>, orgId?: number | string): Promise<T | null> {
    const now = new Date().toISOString();
    const updateData = { ...data, updated_at: now };

    const keys = Object.keys(updateData);
    const setClauses = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => updateData[k]);

    let sql = `UPDATE ${table} SET ${setClauses} WHERE id = ?`;
    values.push(id);

    if (orgId !== undefined) {
      sql += ` AND organization_id = ?`;
      values.push(orgId);
    }

    await query(sql, values);
    return this.findById<T>(table, id, orgId);
  },

  /**
   * Delete a record using SQL DELETE, strictly enforcing organization isolation
   */
  async delete(table: string, id: number | string, orgId?: number | string): Promise<boolean> {
    let sql = `DELETE FROM ${table} WHERE id = ?`;
    const values: any[] = [id];

    if (orgId !== undefined) {
      sql += ` AND organization_id = ?`;
      values.push(orgId);
    }

    await query(sql, values);
    return true;
  },

  /**
   * Count records using SQL COUNT(*)
   */
  async count(table: string, filters: QueryFilters = {}): Promise<number> {
    const whereClauses: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        whereClauses.push(`${key} = ?`);
        params.push(value);
      }
    }

    let sql = `SELECT COUNT(*) as total FROM ${table}`;
    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const res: any = await query(sql, params);
    const totalRow = res[0];
    if (typeof totalRow === 'object' && totalRow !== null) {
      return Number(totalRow.total || totalRow['COUNT(*)'] || 0);
    }
    return Number(totalRow || 0);
  },
};
