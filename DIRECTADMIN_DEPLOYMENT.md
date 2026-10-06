# Paperglow — DirectAdmin Production Deployment Guide

This guide details the exact process for deploying the Paperglow platform on DirectAdmin at `paperglow.co.ke` using Node.js, PM2, Apache reverse proxy, and MySQL/MariaDB.

---

## 1. Production `.env` File

Place this file at `/home/<user>/domains/paperglow.co.ke/app/.env` (or your application root):

```ini
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://paperglow.co.ke

DB_HOST=localhost
DB_PORT=3306
DB_NAME=papergl1_paperglow
DB_USER=papergl1_paperglow
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD_HERE

# Cryptographically secure random secret (at least 32 characters)
# Generate via: openssl rand -base64 48
JWT_SECRET=YOUR_SECURE_JWT_SECRET_AT_LEAST_32_CHARS_LONG_2026_PRODUCTION

STORAGE_DRIVER=local
STORAGE_DIR=./uploads
```

> **Security Note**: Never commit `.env` to Git. Ensure `.gitignore` contains `.env`.

---

## 2. SSH Terminal Deployment Commands

Run these commands in order from your SSH terminal on DirectAdmin:

```bash
# Navigate to application root
cd /home/<user>/domains/paperglow.co.ke/app

# 1. Install all dependencies (including devDependencies needed for build and tsx)
npm install

# 2. Build the production React frontend
npm run build

# 3. Run database migrations to provision tables and constraints
npm run db:migrate

# 4. Seed system roles, default applications, and initial superadmin
npm run db:seed

# 5. Start / Restart application with PM2
pm2 start tsx --name "paperglow" -- server.ts
# OR if using npm run start:
# pm2 start npm --name "paperglow" -- run start

# Save PM2 process list so it restarts automatically on server reboot
pm2 save
```

---

## 3. Apache Reverse Proxy Configuration (`.htaccess`)

Place this `.htaccess` file inside `/home/<user>/domains/paperglow.co.ke/public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. WebSocket Support
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]
  RewriteRule ^/?(.*) ws://127.0.0.1:3000/$1 [P,L]

  # 3. Reverse Proxy All Traffic to Node.js Backend on Port 3000
  RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
</IfModule>

<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyRequests Off
  ProxyTimeout 300
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

---

## 4. Health Check Command

Verify your live production deployment:

```bash
curl -i https://paperglow.co.ke/api/health
```

Expected JSON response:

```json
{
  "status": "healthy",
  "timestamp": "2026-10-06T...",
  "uptimeSeconds": 15.2,
  "environment": "production",
  "platform": "Paperglow SaaS Multi-Tenant Platform",
  "database": {
    "status": "connected",
    "driver": "mariadb_mysql2",
    "dialect": "MariaDB 10.11+ / MySQL 8.0+",
    "host": "localhost",
    "port": 3306,
    "database": "papergl1_paperglow",
    "alive": true,
    "error": null
  },
  "version": "1.0.0"
}
```
