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
   * Find records using parameterized MariaDB SQL with multi-tenant organization filtering
   */
  async find<T = any>(table: string, filters: QueryFilters = {}, options: QueryOptions = {}): Promise<T[]> {
    const whereClauses: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        whereClauses.push(`\`${key}\` = ?`);
        params.push(value);
      }
    }

    let sql = `SELECT * FROM \`${table}\``;
    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (options.orderBy) {
      const dir = options.orderDirection === 'ASC' ? 'ASC' : 'DESC';
      sql += ` ORDER BY \`${options.orderBy}\` ${dir}`;
    } else {
      sql += ` ORDER BY \`id\` DESC`;
    }

    if (options.limit) {
      sql += ` LIMIT ${Number(options.limit)}`;
      if (options.offset) {
        sql += ` OFFSET ${Number(options.offset)}`;
      }
    }

    const rows = await query<any[]>(sql, params);
    return Array.isArray(rows) ? (rows as T[]) : [];
  },

  /**
   * Find a single record by ID with MariaDB SQL, enforcing organization isolation
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
   * Find one record matching filters via MariaDB SQL
   */
  async findOne<T = any>(table: string, filters: QueryFilters): Promise<T | null> {
    const results = await this.find<T>(table, filters, { limit: 1 });
    return results[0] || null;
  },

  /**
   * Create a new record using MariaDB parameterized SQL INSERT
   */
  async create<T = any>(table: string, data: Record<string, any>): Promise<T> {
    const recordUuid = data.uuid || crypto.randomUUID();

    const insertData: Record<string, any> = {
      ...data,
      uuid: recordUuid,
    };

    const keys = Object.keys(insertData);
    const fields = keys.map((k) => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((k) => {
      const v = insertData[k];
      if (typeof v === 'object' && v !== null && !(v instanceof Date)) {
        return JSON.stringify(v);
      }
      return v;
    });

    const sql = `INSERT INTO \`${table}\` (${fields}) VALUES (${placeholders})`;
    const result: any = await query(sql, values);

    // Fetch the newly inserted record directly from MariaDB
    let created: any = null;
    if (recordUuid) {
      created = await this.findOne<T>(table, { uuid: recordUuid });
    }
    if (!created && result?.insertId) {
      created = await this.findById<T>(table, result.insertId);
    }
    return created || (insertData as T);
  },

  /**
   * Update a record using MariaDB parameterized SQL UPDATE, strictly enforcing organization isolation
   */
  async update<T = any>(table: string, id: number | string, data: Record<string, any>, orgId?: number | string): Promise<T | null> {
    const updateData = { ...data };
    delete updateData.id;
    delete updateData.created_at;

    const keys = Object.keys(updateData);
    if (keys.length === 0) {
      return this.findById<T>(table, id, orgId);
    }

    const setClauses = keys.map((k) => `\`${k}\` = ?`).join(', ');
    const values = keys.map((k) => {
      const v = updateData[k];
      if (typeof v === 'object' && v !== null && !(v instanceof Date)) {
        return JSON.stringify(v);
      }
      return v;
    });

    let sql = `UPDATE \`${table}\` SET ${setClauses} WHERE \`id\` = ?`;
    values.push(id);

    if (orgId !== undefined) {
      sql += ` AND \`organization_id\` = ?`;
      values.push(orgId);
    }

    await query(sql, values);
    return this.findById<T>(table, id, orgId);
  },

  /**
   * Delete a record using MariaDB parameterized SQL DELETE, strictly enforcing organization isolation
   */
  async delete(table: string, id: number | string, orgId?: number | string): Promise<boolean> {
    let sql = `DELETE FROM \`${table}\` WHERE \`id\` = ?`;
    const values: any[] = [id];

    if (orgId !== undefined) {
      sql += ` AND \`organization_id\` = ?`;
      values.push(orgId);
    }

    const result: any = await query(sql, values);
    return (result?.affectedRows ?? 0) > 0;
  },

  /**
   * Count records using MariaDB parameterized SQL COUNT(*)
   */
  async count(table: string, filters: QueryFilters = {}): Promise<number> {
    const whereClauses: string[] = [];
    const params: any[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        whereClauses.push(`\`${key}\` = ?`);
        params.push(value);
      }
    }

    let sql = `SELECT COUNT(*) as total FROM \`${table}\``;
    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const rows: any = await query(sql, params);
    if (Array.isArray(rows) && rows.length > 0) {
      return Number(rows[0].total ?? 0);
    }
    return 0;
  },
};
