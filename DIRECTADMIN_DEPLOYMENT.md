# Paperglow Platform — DirectAdmin Production Deployment Guide

This guide details the complete process for deploying the Paperglow multi-tenant SaaS application on DirectAdmin web hosting (with CloudLinux Node.js Selector, Passenger, or PM2, and MySQL/MariaDB).

---

## 1. System Requirements & Architecture

- **Runtime**: Node.js 20+ or 22+ (LTS)
- **Web Server**: Apache or Nginx with Phusion Passenger or reverse proxy (port forwarding)
- **Database**: MySQL 8.0+ or MariaDB 10.5+
- **Control Panel**: DirectAdmin (with "NodeJS Selector" or SSH Terminal access)
- **Default Country & Currency**: Kenya (KE) · Kenyan Shillings (KES)

---

## 2. Directory Structure on DirectAdmin

Deploy files to your DirectAdmin user domain folder, e.g.:

```text
/home/username/domains/paperglow.co.ke/
├── public_html/             <-- Static production assets (dist) & .htaccess
│   ├── assets/
│   ├── index.html
│   └── .htaccess
├── app/                     <-- Node.js application root
│   ├── server.ts
│   ├── package.json
│   ├── .env
│   ├── server/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── uploads/
│   └── dist/
```

---

## 3. Database Setup in DirectAdmin

1. Log into your **DirectAdmin** panel.
2. Navigate to **MySQL Management** -> **Create New Database**.
3. Create:
   - **Database Name**: `username_paperglow`
   - **Database User**: `username_pguser`
   - **Password**: Generate a strong password (minimum 16 characters)
4. Open **phpMyAdmin** from DirectAdmin.
5. Select the database `username_paperglow`.
6. Click **Import** and choose `/server/database/schema.sql` (or `/database/paperglow_directadmin_mysql_schema.sql`).
7. Click **Go** to execute all table schemas, constraints, foreign keys, and indexes.

Alternatively, you can run the CLI migration command after configuring `.env`:
```bash
npm run db:migrate
npm run db:seed
```

---

## 4. Environment Variables (`.env`)

In your application root (`/home/username/domains/paperglow.co.ke/app/.env`), configure:

```ini
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
FRONTEND_URL=https://paperglow.co.ke

# DirectAdmin MySQL Credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=username_paperglow
DB_USER=username_pguser
DB_PASSWORD=YourStrongDatabasePassword123!
DB_CONNECTION_LIMIT=15

# Security Secrets
JWT_SECRET=paperglow_directadmin_super_secret_jwt_key_at_least_32_characters_long

# File Storage
STORAGE_DRIVER=local
STORAGE_DIR=./uploads
```

---

## 5. Build & Installation Commands

From your SSH terminal or DirectAdmin terminal:

```bash
cd /home/username/domains/paperglow.co.ke/app

# 1. Install production dependencies
npm install --production=false

# 2. Build frontend React SPA bundle into ./dist
npm run build

# 3. Run database migrations
npm run db:migrate

# 4. Optional: Seed initial system roles and superadmin
npm run db:seed
```

---

## 6. Configuring DirectAdmin Node.js App (Passenger)

1. Open **DirectAdmin** -> **Setup Node.js App**.
2. Click **Create Application**.
3. Configure the following fields:
   - **Node.js Version**: 22.x (or 20.x)
   - **Application Mode**: `Production`
   - **Application Root**: `domains/paperglow.co.ke/app`
   - **Application URL**: `paperglow.co.ke`
   - **Application Startup File**: `server.ts` (or `dist/server.js` if compiled)
4. Under **Environment Variables**, add the keys defined in `.env` (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`).
5. Click **Create** then click **Run JS Script** or **Restart**.

---

## 7. Apache / OpenLiteSpeed `.htaccess` Configuration

Create or update `/home/username/domains/paperglow.co.ke/public_html/.htaccess` to ensure all API calls proxy to Node.js on port 3000 and SPA routes fallback to `index.html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Proxy API routes to Node.js backend
  RewriteRule ^api/(.*)$ http://127.0.0.1:3000/api/$1 [P,L]
  RewriteRule ^uploads/(.*)$ http://127.0.0.1:3000/uploads/$1 [P,L]

  # 2. Serve static files directly if they exist
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 3. Fallback to SPA index.html for frontend routing
  RewriteRule ^ index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

---

## 8. Health Check Verification

Test your backend health:

```bash
curl -i https://paperglow.co.ke/api/health
```

Expected JSON response:

```json
{
  "status": "healthy",
  "timestamp": "2026-10-06T12:00:00.000Z",
  "uptimeSeconds": 142.8,
  "environment": "production",
  "platform": "Paperglow SaaS Multi-Tenant Platform",
  "database": {
    "status": "connected",
    "driver": "mysql2",
    "host": "localhost",
    "database": "username_paperglow",
    "error": null
  },
  "version": "1.0.0"
}
```

---

## 9. DirectAdmin Cron Job for Automated Reminders

Paperglow includes an automated reminder dispatcher for:
- Rent due dates
- Chama loan repayments
- Booking confirmations
- Invoices past due

In **DirectAdmin** -> **Cron Jobs**, add:
```text
0 8 * * * curl -s -X POST https://paperglow.co.ke/api/v1/notifications/cron -H "Authorization: Bearer <API_KEY>" > /dev/null 2>&1
```

---

## 10. Summary of Production Scripts

| Command | Action |
|---|---|
| `npm run dev` | Runs full-stack dev server with Vite middleware on port 3000 |
| `npm run build` | Compiles TypeScript and builds production frontend bundle |
| `npm run db:migrate` | Runs MySQL schema migration against `DB_HOST` |
| `npm run db:seed` | Populates default system roles and admin account |
| `npm run start` | Boots backend with Node.js in production mode |
| `GET /api/health` | Diagnostic endpoint verifying server & MySQL connection status |
