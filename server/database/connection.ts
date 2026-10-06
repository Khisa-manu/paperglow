import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index';

let pool: mysql.Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

// Initialize MySQL pool if host is configured
if (config.database.host) {
  try {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      waitForConnections: true,
      connectionLimit: config.database.connectionLimit,
      queueLimit: 0,
      ssl: config.database.ssl,
    });

    // Verify connection asynchronously
    pool.getConnection()
      .then((conn) => {
        isConnected = true;
        connectionError = null;
        console.log(`[Database] Successfully connected to MySQL at ${config.database.host}:${config.database.port}/${config.database.name}`);
        conn.release();
      })
      .catch((err) => {
        isConnected = false;
        connectionError = err.message;
        console.warn(`[Database] MySQL connection attempt failed (${err.message}). Using persistent local data store.`);
      });
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message;
    console.warn(`[Database] Could not initialize MySQL pool: ${err.message}.`);
  }
} else {
  console.log('[Database] DB_HOST not specified. Using embedded persistent data store for local/preview environment.');
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (pool && isConnected) {
    try {
      const [rows] = await pool.execute(sql, params);
      return rows as T[];
    } catch (err) {
      console.error('[Database Query Error]', sql, err);
      throw err;
    }
  }
  // Fallback to local store query processor
  return fallbackQuery<T>(sql, params);
}

export async function transaction<T>(callback: (connection: mysql.PoolConnection | null) => Promise<T>): Promise<T> {
  if (pool && isConnected) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await callback(conn);
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
  // Fallback transaction
  return callback(null);
}

export function getDbHealth() {
  return {
    status: isConnected ? 'connected' : 'local_storage_active',
    driver: pool && isConnected ? 'mysql2' : 'embedded_json',
    host: config.database.host || 'local',
    database: config.database.name,
    error: connectionError,
  };
}

// Fallback in-memory/JSON store for dev & when MySQL credentials aren't active yet
let localDataCache: Record<string, any[]> | null = null;

function loadLocalStore(): Record<string, any[]> {
  if (localDataCache) return localDataCache;
  try {
    if (!fs.existsSync(config.dataDir)) {
      fs.mkdirSync(config.dataDir, { recursive: true });
    }
    if (fs.existsSync(config.dbFilePath)) {
      const content = fs.readFileSync(config.dbFilePath, 'utf-8');
      localDataCache = JSON.parse(content);
      return localDataCache!;
    }
  } catch (e) {
    console.warn('[Database] Could not read JSON store, initializing empty store', e);
  }
  localDataCache = {};
  return localDataCache;
}

export function saveLocalStore(data: Record<string, any[]>) {
  localDataCache = data;
  try {
    if (!fs.existsSync(config.dataDir)) {
      fs.mkdirSync(config.dataDir, { recursive: true });
    }
    fs.writeFileSync(config.dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Database] Failed writing to local JSON store', e);
  }
}

export function getLocalTable(table: string): any[] {
  const store = loadLocalStore();
  if (!store[table]) {
    store[table] = [];
  }
  return store[table];
}

export function setLocalTable(table: string, records: any[]) {
  const store = loadLocalStore();
  store[table] = records;
  saveLocalStore(store);
}

// Simple query dispatcher for fallback store
function fallbackQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  // Returns empty or table content
  const match = sql.match(/FROM\s+[`"]?([a-zA-Z0-9_]+)[`"]?/i);
  if (match) {
    const table = match[1];
    const records = getLocalTable(table);
    return Promise.resolve(records as unknown as T[]);
  }
  return Promise.resolve([] as T[]);
}
