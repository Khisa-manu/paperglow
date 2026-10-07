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
// MOUNT FRONTEND / LARAVEL PHP PROXY
// ============================================================================
import http from 'http';
import { spawn } from 'child_process';

let phpProcess: any = null;

function ensurePhpServer() {
  if (!phpProcess) {
    try {
      phpProcess = spawn('php', ['-S', '127.0.0.1:8088', '-t', 'public', 'public/index.php'], {
        stdio: 'inherit',
      });
      phpProcess.on('exit', () => {
        phpProcess = null;
      });
    } catch (e) {
      console.error('[Laravel PHP] Failed to spawn php server:', e);
    }
  }
}

async function startServer() {
  ensurePhpServer();

  // Proxy non-API web traffic directly to Laravel 11 Blade + Livewire backend
  app.use((req: Request, res: Response, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }

    ensurePhpServer();

    const options: http.RequestOptions = {
      hostname: '127.0.0.1',
      port: 8088,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: 'localhost:3000',
        'x-forwarded-host': req.headers.host || 'localhost:3000',
        'x-forwarded-proto': 'http',
      },
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('[Proxy Error to Laravel PHP]:', err.message);
      res.status(502).send(`
        <html>
          <body style="font-family:sans-serif;padding:40px;background:#f8fafc;color:#1e293b;">
            <h2 style="color:#dc2626;">Paperglow SaaS — Initializing PHP 8.3 & MariaDB Engine</h2>
            <p>Starting Laravel services on Shujaa Host runtime...</p>
            <script>setTimeout(() => window.location.reload(), 2000);</script>
          </body>
        </html>
      `);
    });

    // Handle incoming body for POST/PUT if parsed
    if (req.body && Object.keys(req.body).length > 0) {
      const contentType = req.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const data = JSON.stringify(req.body);
        proxyReq.setHeader('content-length', Buffer.byteLength(data));
        proxyReq.write(data);
        proxyReq.end();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const params = new URLSearchParams(req.body as any).toString();
        proxyReq.setHeader('content-length', Buffer.byteLength(params));
        proxyReq.write(params);
        proxyReq.end();
      } else {
        req.pipe(proxyReq);
      }
    } else {
      req.pipe(proxyReq);
    }
  });

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`[Paperglow] Multi-Tenant SaaS Backend running on http://0.0.0.0:${config.port}`);
    console.log(`[Paperglow] Health Check: http://0.0.0.0:${config.port}/api/health`);
    console.log(`[Paperglow] DirectAdmin MariaDB Engine + Laravel 11 Livewire Active`);
  });
}

startServer().catch((err) => {
  console.error('[Paperglow] Server failed to start:', err);
  process.exit(1);
});

export default app;
