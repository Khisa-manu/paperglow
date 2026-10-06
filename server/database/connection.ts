import mysql from 'mysql2/promise';
import { config } from '../config/index';

let pool: mysql.Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

export function isDbConnected(): boolean {
  return isConnected;
}

/**
 * Returns the active MariaDB/MySQL connection pool if host configured
 */
export function getPool(): mysql.Pool | null {
  if (!pool && config.database.host) {
    const host = config.database.host;
    try {
      pool = mysql.createPool({
        host,
        port: config.database.port || 3306,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        waitForConnections: true,
        connectionLimit: config.database.connectionLimit || 10,
        queueLimit: 0,
        ssl: config.database.ssl,
        charset: 'utf8mb4',
        dateStrings: true,
      });

      pool.getConnection()
        .then((conn) => {
          isConnected = true;
          connectionError = null;
          console.log(`[MariaDB] Pool successfully connected to MariaDB server at ${host}:${config.database.port}/${config.database.name}`);
          conn.release();
        })
        .catch((err) => {
          isConnected = false;
          connectionError = err.message;
          console.warn(`[MariaDB] Database connection offline (${err.message}). Using in-memory fallback store.`);
        });
    } catch (err: any) {
      isConnected = false;
      connectionError = err.message;
      console.warn(`[MariaDB] Pool creation failed (${err.message}). Using in-memory fallback store.`);
    }
  }
  return pool;
}

// Initialize if database host is configured
if (config.database.host) {
  getPool();
} else {
  console.log('[MariaDB] No DB_HOST configured. Using active in-memory fallback store.');
}

/**
 * Executes a parameterized MariaDB SQL query if connected
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = getPool();
  if (!p) {
    throw new Error('Database pool not configured');
  }
  const [result] = await p.execute(sql, params);
  return result as T;
}

/**
 * Executes a MariaDB transaction
 */
export async function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const p = getPool();
  if (!p) {
    throw new Error('Database pool not configured');
  }
  const conn = await p.getConnection();
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

/**
 * Returns live database health diagnostics
 */
export async function getDbHealth() {
  const p = getPool();
  if (p && isConnected) {
    try {
      const [rows]: any = await p.query('SELECT 1 as alive, VERSION() as version, DATABASE() as db');
      return {
        status: 'connected',
        driver: 'mariadb_mysql2',
        dialect: 'MariaDB 10.11+ / MySQL 8.0+',
        host: config.database.host,
        port: config.database.port || 3306,
        database: rows[0]?.db || config.database.name,
        serverVersion: rows[0]?.version,
        alive: true,
        error: null,
      };
    } catch (err: any) {
      isConnected = false;
      connectionError = err.message;
    }
  }

  return {
    status: 'connected (in-memory mock)',
    driver: 'in_memory_mock',
    dialect: 'In-Memory Store (Active)',
    host: config.database.host || 'local-memory',
    port: config.database.port || 3306,
    database: config.database.name,
    serverVersion: 'Paperglow-Mock-1.0',
    alive: true,
    error: connectionError,
  };
}
