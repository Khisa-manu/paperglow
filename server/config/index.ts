import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'paperglow_directadmin_super_secret_jwt_key_2026',
  jwtExpiresIn: '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
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
