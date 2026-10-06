import mysql from 'mysql2/promise';
import { config } from '../config/index';

let pool: mysql.Pool | null = null;
let isConnected = false;
let connectionError: string | null = null;

/**
 * Returns the active MariaDB/MySQL connection pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    const host = config.database.host || '127.0.0.1';
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
        console.error(`[MariaDB] Connection error: ${err.message}`);
      });
  }
  return pool;
}

// Eager initialization of MariaDB connection pool
getPool();

/**
 * Executes a parameterized MariaDB SQL query
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const p = getPool();
  try {
    const [result] = await p.execute(sql, params);
    return result as T;
  } catch (err: any) {
    console.error('[MariaDB Query Error]', sql, params, err.message);
    throw err;
  }
}

/**
 * Executes a MariaDB transaction
 */
export async function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const p = getPool();
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
 * Returns live MariaDB health diagnostics
 */
export async function getDbHealth() {
  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT 1 as alive, VERSION() as version, DATABASE() as db');
    isConnected = true;
    connectionError = null;
    return {
      status: 'connected',
      driver: 'mariadb_mysql2',
      dialect: 'MariaDB 10.11+ / MySQL 8.0+',
      host: config.database.host || '127.0.0.1',
      port: config.database.port || 3306,
      database: rows[0]?.db || config.database.name,
      serverVersion: rows[0]?.version,
      alive: true,
      error: null,
    };
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message;
    return {
      status: 'disconnected',
      driver: 'mariadb_mysql2',
      dialect: 'MariaDB 10.11+ / MySQL 8.0+',
      host: config.database.host || '127.0.0.1',
      port: config.database.port || 3306,
      database: config.database.name,
      alive: false,
      error: err.message,
    };
  }
}
