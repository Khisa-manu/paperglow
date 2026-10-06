import crypto from 'crypto';
import { query, getLocalTable, setLocalTable, getDbHealth } from '../database/connection';

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
   * Find records with multi-tenant organization filtering
   */
  async find<T = any>(table: string, filters: QueryFilters = {}, options: QueryOptions = {}): Promise<T[]> {
    const health = getDbHealth();
    
    // When real MySQL is connected
    if (health.driver === 'mysql2') {
      const whereClauses: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
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
        sql += ` ORDER BY id DESC`;
      }

      if (options.limit) {
        sql += ` LIMIT ${Number(options.limit)}`;
        if (options.offset) {
          sql += ` OFFSET ${Number(options.offset)}`;
        }
      }

      return query<T>(sql, params);
    }

    // Embedded store fallback
    const rows = getLocalTable(table);
    let result = rows.filter((row) => {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && row[key] !== value && String(row[key]) !== String(value)) {
          return false;
        }
      }
      return true;
    });

    if (options.orderBy) {
      const col = options.orderBy;
      const dir = options.orderDirection === 'ASC' ? 1 : -1;
      result.sort((a, b) => {
        if (a[col] < b[col]) return -1 * dir;
        if (a[col] > b[col]) return 1 * dir;
        return 0;
      });
    } else {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    if (options.offset || options.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      result = result.slice(start, end);
    }

    return result as T[];
  },

  /**
   * Find a single record by ID, enforcing organization isolation if orgId is provided
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
   * Find one record matching filters
   */
  async findOne<T = any>(table: string, filters: QueryFilters): Promise<T | null> {
    const results = await this.find<T>(table, filters, { limit: 1 });
    return results[0] || null;
  },

  /**
   * Create a new record
   */
  async create<T = any>(table: string, data: Record<string, any>): Promise<T> {
    const health = getDbHealth();
    const now = new Date().toISOString();
    
    // Auto-generate UUID if table typically uses it and not supplied
    const newRecord: Record<string, any> = {
      uuid: data.uuid || crypto.randomUUID(),
      ...data,
      created_at: data.created_at || now,
    };

    if (health.driver === 'mysql2') {
      const keys = Object.keys(newRecord);
      const fields = keys.map((k) => `\`${k}\``).join(', ');
      const placeholders = keys.map(() => '?').join(', ');
      const values = keys.map((k) => newRecord[k]);

      const sql = `INSERT INTO \`${table}\` (${fields}) VALUES (${placeholders})`;
      const result: any = await query(sql, values);
      newRecord.id = result.insertId;
      return newRecord as T;
    }

    // Embedded store fallback
    const rows = getLocalTable(table);
    const maxId = rows.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0);
    newRecord.id = data.id || (maxId + 1);
    rows.push(newRecord);
    setLocalTable(table, rows);
    return newRecord as T;
  },

  /**
   * Update a record, strictly enforcing organization isolation
   */
  async update<T = any>(table: string, id: number | string, data: Record<string, any>, orgId?: number | string): Promise<T | null> {
    const health = getDbHealth();
    const now = new Date().toISOString();
    const updateData = { ...data, updated_at: now };

    if (health.driver === 'mysql2') {
      const keys = Object.keys(updateData);
      const setClauses = keys.map((k) => `\`${k}\` = ?`).join(', ');
      const values = keys.map((k) => updateData[k]);
      
      let sql = `UPDATE \`${table}\` SET ${setClauses} WHERE \`id\` = ?`;
      values.push(id);

      if (orgId !== undefined) {
        sql += ` AND \`organization_id\` = ?`;
        values.push(orgId);
      }

      await query(sql, values);
      return this.findById<T>(table, id, orgId);
    }

    // Embedded store fallback
    const rows = getLocalTable(table);
    const index = rows.findIndex((r) => {
      const matchesId = String(r.id) === String(id);
      const matchesOrg = orgId === undefined || String(r.organization_id) === String(orgId);
      return matchesId && matchesOrg;
    });

    if (index === -1) return null;

    rows[index] = { ...rows[index], ...updateData };
    setLocalTable(table, rows);
    return rows[index] as T;
  },

  /**
   * Delete a record, strictly enforcing organization isolation
   */
  async delete(table: string, id: number | string, orgId?: number | string): Promise<boolean> {
    const health = getDbHealth();

    if (health.driver === 'mysql2') {
      let sql = `DELETE FROM \`${table}\` WHERE \`id\` = ?`;
      const values: any[] = [id];

      if (orgId !== undefined) {
        sql += ` AND \`organization_id\` = ?`;
        values.push(orgId);
      }

      const res: any = await query(sql, values);
      return (res.affectedRows || 0) > 0;
    }

    // Embedded store fallback
    const rows = getLocalTable(table);
    const initialLength = rows.length;
    const filtered = rows.filter((r) => {
      const matchesId = String(r.id) === String(id);
      const matchesOrg = orgId === undefined || String(r.organization_id) === String(orgId);
      return !(matchesId && matchesOrg);
    });

    setLocalTable(table, filtered);
    return filtered.length < initialLength;
  },

  /**
   * Count records
   */
  async count(table: string, filters: QueryFilters = {}): Promise<number> {
    const health = getDbHealth();

    if (health.driver === 'mysql2') {
      const whereClauses: string[] = [];
      const params: any[] = [];

      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
          whereClauses.push(`\`${key}\` = ?`);
          params.push(value);
        }
      }

      let sql = `SELECT COUNT(*) as total FROM \`${table}\``;
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      const res: any = await query(sql, params);
      return Number(res[0]?.total || 0);
    }

    // Embedded store fallback
    const results = await this.find(table, filters);
    return results.length;
  },
};
