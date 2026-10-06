import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query, isDbConnected } from '../database/connection';

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

// ============================================================================
// IN-MEMORY DATA STORE (ACTIVE WHEN MARIADB / MYSQL IS OFFLINE)
// ============================================================================
const memoryStore = new Map<string, any[]>();
let autoIncrementCounters = new Map<string, number>();

function initMemoryStore() {
  const adminPasswordHash = bcrypt.hashSync('Paperglow@2026', 10);

  // 1. Roles
  memoryStore.set('roles', [
    { id: 1, name: 'owner', display_name: 'Owner', description: 'Full account and billing ownership', is_system: 1 },
    { id: 2, name: 'admin', display_name: 'Administrator', description: 'Full access to organization applications and settings', is_system: 1 },
    { id: 3, name: 'billing_manager', display_name: 'Billing Manager', description: 'Manage subscriptions, invoices and payments', is_system: 1 },
    { id: 4, name: 'member', display_name: 'Member', description: 'Standard application user', is_system: 1 },
  ]);

  // 2. Users
  memoryStore.set('users', [
    {
      id: 1,
      uuid: 'usr_admin_paperglow_001',
      name: 'Wanjiku Kamau',
      email: 'admin@paperglow.co.ke',
      password_hash: adminPasswordHash,
      phone: '+254712345678',
      two_factor_enabled: 0,
      status: 'active',
      default_organization_id: 1,
      created_at: new Date().toISOString(),
    },
  ]);

  // 3. Organizations
  memoryStore.set('organizations', [
    {
      id: 1,
      uuid: 'org_paperglow_creative_001',
      name: 'Paperglow Creative Group Ltd',
      slug: 'paperglow-creative',
      billing_email: 'billing@paperglow.co.ke',
      phone: '+254712345678',
      tax_id: 'P051289192K',
      city: 'Nairobi',
      county_state: 'Nairobi County',
      country_code: 'KE',
      preferred_currency: 'KES',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ]);

  // 4. Organization Members
  memoryStore.set('organization_members', [
    {
      id: 1,
      organization_id: 1,
      user_id: 1,
      role_id: 1,
      role_name: 'owner',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ]);

  // 5. Default Subscriptions
  const defaultApps = [
    'paperglow-business-manager',
    'paperglow-property-manager',
    'paperglow-pharmacy-manager',
    'paperglow-party-manager',
    'paperglow-ticketing',
    'paperglow-booking',
    'paperglow-stock-inventory',
    'paperglow-legal-practice',
    'paperglow-school-manager',
    'paperglow-chama-manager',
    'paperglow-clinic-manager',
    'paperglow-invoice-generator',
    'paperglow-crm',
  ];

  const subscriptions = defaultApps.map((slug, idx) => ({
    id: idx + 1,
    uuid: `sub_${slug}_001`,
    organization_id: 1,
    app_slug: slug,
    plan_slug: 'professional',
    billing_cadence: 'monthly',
    status: 'active',
    price_kes: 3800,
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  }));

  memoryStore.set('subscriptions', subscriptions);

  // Counters
  autoIncrementCounters.set('roles', 10);
  autoIncrementCounters.set('users', 10);
  autoIncrementCounters.set('organizations', 10);
  autoIncrementCounters.set('organization_members', 10);
  autoIncrementCounters.set('subscriptions', 50);
}

// Seed on module load
initMemoryStore();

function getMemoryTable(table: string): any[] {
  if (!memoryStore.has(table)) {
    memoryStore.set(table, []);
    autoIncrementCounters.set(table, 1);
  }
  return memoryStore.get(table)!;
}

export const dbService = {
  /**
   * Find records with multi-tenant organization filtering
   */
  async find<T = any>(table: string, filters: QueryFilters = {}, options: QueryOptions = {}): Promise<T[]> {
    if (isDbConnected()) {
      try {
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
      } catch (err: any) {
        console.warn(`[MariaDB] Query error in find(${table}): ${err.message}. Falling back to memory store.`);
      }
    }

    // In-memory fallback
    const rows = getMemoryTable(table);
    let filtered = rows.filter((item) => {
      for (const [key, val] of Object.entries(filters)) {
        if (val !== undefined && val !== null) {
          if (String(item[key]) !== String(val)) {
            return false;
          }
        }
      }
      return true;
    });

    if (options.orderBy) {
      const field = options.orderBy;
      const asc = options.orderDirection === 'ASC';
      filtered = [...filtered].sort((a, b) => {
        if (a[field] < b[field]) return asc ? -1 : 1;
        if (a[field] > b[field]) return asc ? 1 : -1;
        return 0;
      });
    } else {
      filtered = [...filtered].sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
    }

    if (options.offset || options.limit) {
      const offset = Number(options.offset) || 0;
      const limit = Number(options.limit) || filtered.length;
      filtered = filtered.slice(offset, offset + limit);
    }

    return filtered as T[];
  },

  /**
   * Find a single record by ID, enforcing organization isolation
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
    const recordUuid = data.uuid || crypto.randomUUID();

    if (isDbConnected()) {
      try {
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

        let created: any = null;
        if (recordUuid) {
          created = await this.findOne<T>(table, { uuid: recordUuid });
        }
        if (!created && result?.insertId) {
          created = await this.findById<T>(table, result.insertId);
        }
        return created || (insertData as T);
      } catch (err: any) {
        console.warn(`[MariaDB] Create error in create(${table}): ${err.message}. Falling back to memory store.`);
      }
    }

    // In-memory fallback
    const rows = getMemoryTable(table);
    const nextId = (autoIncrementCounters.get(table) || 1) + 1;
    autoIncrementCounters.set(table, nextId);

    const newRecord: any = {
      id: data.id || nextId,
      uuid: recordUuid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };

    rows.push(newRecord);
    return newRecord as T;
  },

  /**
   * Update a record, strictly enforcing organization isolation
   */
  async update<T = any>(table: string, id: number | string, data: Record<string, any>, orgId?: number | string): Promise<T | null> {
    if (isDbConnected()) {
      try {
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
      } catch (err: any) {
        console.warn(`[MariaDB] Update error in update(${table}): ${err.message}. Falling back to memory store.`);
      }
    }

    // In-memory fallback
    const rows = getMemoryTable(table);
    const index = rows.findIndex((r) => String(r.id) === String(id) && (orgId === undefined || String(r.organization_id) === String(orgId)));
    if (index === -1) {
      return null;
    }

    const updated = {
      ...rows[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    rows[index] = updated;
    return updated as T;
  },

  /**
   * Delete a record, strictly enforcing organization isolation
   */
  async delete(table: string, id: number | string, orgId?: number | string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        let sql = `DELETE FROM \`${table}\` WHERE \`id\` = ?`;
        const values: any[] = [id];

        if (orgId !== undefined) {
          sql += ` AND \`organization_id\` = ?`;
          values.push(orgId);
        }

        const result: any = await query(sql, values);
        return (result?.affectedRows ?? 0) > 0;
      } catch (err: any) {
        console.warn(`[MariaDB] Delete error in delete(${table}): ${err.message}. Falling back to memory store.`);
      }
    }

    // In-memory fallback
    const rows = getMemoryTable(table);
    const index = rows.findIndex((r) => String(r.id) === String(id) && (orgId === undefined || String(r.organization_id) === String(orgId)));
    if (index !== -1) {
      rows.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Count records
   */
  async count(table: string, filters: QueryFilters = {}): Promise<number> {
    if (isDbConnected()) {
      try {
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
      } catch (err: any) {
        console.warn(`[MariaDB] Count error in count(${table}): ${err.message}. Falling back to memory store.`);
      }
    }

    // In-memory fallback
    const rows = await this.find(table, filters);
    return rows.length;
  },
};
