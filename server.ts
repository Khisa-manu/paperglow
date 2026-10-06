import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './server/config/index';
import { apiRouter } from './server/routes/apiRouter';
import { errorHandler } from './server/middleware/errorHandler';
import { healthController } from './server/controllers/healthController';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// CORS Configuration
const isProduction = config.nodeEnv === 'production';
const allowedOrigins = isProduction
  ? [
      config.frontendUrl,
      'https://paperglow.co.ke',
      'https://www.paperglow.co.ke',
    ].filter(Boolean)
  : true;

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. curl, server-to-server, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins === true) {
      return callback(null, true);
    }

    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

// Uploads Static Directory
if (!fs.existsSync(config.storage.dir)) {
  fs.mkdirSync(config.storage.dir, { recursive: true });
}
app.use('/uploads', express.static(config.storage.dir));

// Health Check Root & API Endpoints
app.get('/api/health', healthController.check);
app.get('/health', healthController.check);

// DirectAdmin MySQL DDL Exporter endpoint
app.get('/api/v1/export/directadmin-schema.sql', (_req: Request, res: Response) => {
  const schemaPath = path.join(__dirname, 'server', 'database', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    res.setHeader('Content-Type', 'application/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="paperglow_directadmin_mysql_schema.sql"');
    return res.send(fs.readFileSync(schemaPath, 'utf-8'));
  }
  return res.status(404).send('-- Schema file not found');
});

// Mount Main REST API Router
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter); // Alias for convenience

// API Global Error Handler
app.use('/api', errorHandler);
app.use('/api/v1', errorHandler);

// ============================================================================
// MOUNT FRONTEND (Vite in Dev / Static in Production)
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[Paperglow] Multi-Tenant SaaS Backend running on http://0.0.0.0:${config.port}`);
    console.log(`[Paperglow] Health Check: http://0.0.0.0:${config.port}/api/health`);
    console.log(`[Paperglow] Database Driver: MariaDB / MySQL (mysql2 pool)`);
  });
}

startServer().catch((err) => {
  console.error('[Paperglow] Server failed to start:', err);
  process.exit(1);
});

export default app;
