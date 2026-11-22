# AXION TECHNOLOGIES — PRODUCTION DEPLOYMENT GUIDE

This document describes the procedures to deploy Axion Technologies into production environments using Docker, PostgreSQL, and Nginx.

---

## 1. Production Docker Stack

The provided `docker-compose.yml` orchestrates three containerized services:
1. `web`: Optimized Next.js production build running under non-root `nextjs` user.
2. `postgres`: PostgreSQL 16 database with healthcheck and persistent volume storage.
3. `nginx`: Reverse proxy with TLS 1.3, HTTP/2, Brotli/Gzip compression, and defensive HTTP security headers.

### Deployment Commands

1. Ensure SSL certificates are present in `./certs`:
   ```bash
   mkdir -p certs
   # Place fullchain.pem and privkey.pem in ./certs/
   ```

2. Build and start containers:
   ```bash
   docker compose build
   docker compose up -d
   ```

3. Run migrations and database seed inside the container:
   ```bash
   docker compose exec web npx prisma db push
   docker compose exec web npx tsx prisma/seed.ts
   ```

---

## 2. Standalone VPS / Ubuntu / Debian Deployment (Systemd + Node.js)

### Step 1: Install Node.js & PostgreSQL
```bash
sudo apt update && sudo apt install -y curl git nginx postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 2: Configure PostgreSQL
```bash
sudo -u postgres psql
CREATE DATABASE axion_production;
CREATE USER axion_user WITH ENCRYPTED PASSWORD 'your_strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE axion_production TO axion_user;
\q
```

### Step 3: Clone, Build and Migrate
```bash
git clone <repo-url> /var/www/axion-technologies
cd /var/www/axion-technologies
npm ci
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run build
```

### Step 4: Configure Systemd Service
Create `/etc/systemd/system/axion.service`:
```ini
[Unit]
Description=Axion Technologies Web Service
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/axion-technologies
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL="postgresql://axion_user:your_strong_password_here@localhost:5432/axion_production?schema=public"
Environment=JWT_SECRET="generate_a_cryptographically_secure_random_64_byte_string"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable axion
sudo systemctl start axion
```

### Step 5: Configure Nginx & Let's Encrypt SSL
Copy `nginx.conf` to `/etc/nginx/sites-available/axion`:
```bash
sudo ln -s /etc/nginx/sites-available/axion /etc/nginx/sites-enabled/
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d axiontech.in -d www.axiontech.in
sudo systemctl restart nginx
```
