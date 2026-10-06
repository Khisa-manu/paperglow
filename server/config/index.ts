import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (isProduction) {
    if (!secret || secret.trim().length < 32) {
      throw new Error(
        'FATAL: JWT_SECRET environment variable is missing or too short. A secure secret of at least 32 characters is required in production.'
      );
    }
    return secret.trim();
  }
  if (!secret) {
    console.warn('[Security Warning] JWT_SECRET not configured. Using development fallback key.');
    return 'paperglow_dev_only_ephemeral_jwt_secret_not_for_production_2026';
  }
  return secret.trim();
}

export const config = {
  port: isProduction ? (Number(process.env.PORT) || 3000) : 3000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv,
  jwtSecret: getJwtSecret(),
  jwtExpiresIn: '7d',
  frontendUrl: process.env.FRONTEND_URL || (isProduction ? 'https://paperglow.co.ke' : 'http://localhost:3000'),
  
  // Database settings (MySQL / MariaDB on DirectAdmin)
  database: {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'paperglow_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  },

  // Storage settings for documents & artwork
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    dir: process.env.STORAGE_DIR ? path.resolve(rootDir, process.env.STORAGE_DIR) : path.join(rootDir, 'uploads'),
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
};
