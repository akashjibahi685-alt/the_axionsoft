# AXIONSOFT SOLUTION — INSTALLATION GUIDE

This document provides step-by-step instructions to install, initialize, and execute the Axion Technologies enterprise web application on your local workstation or server.

---

## 1. Prerequisites

Verify that your system has the following runtimes and packages installed:

- **Node.js**: v18.18.0 or higher (v20+ or v22 LTS recommended)
- **npm**: v9.0.0 or higher (or pnpm / bun)
- **Git**: Installed and configured

Verify runtime versions:
```bash
node -v
npm -v
git --version
```

---

## 2. Clone and Setup Environment

Clone the repository and enter the directory:
```bash
git clone <repository-url> axion-technologies
cd axion-technologies
```

Create your local environment file:
```bash
cp .env.example .env
```

Default configuration variables in `.env`:
```env
# Database connection: SQLite for instant local dev, or PostgreSQL for staging/prod
DATABASE_URL="file:./dev.db"

# JWT Secret for admin session cryptographic signing (min 32 characters)
JWT_SECRET="axion-technologies-enterprise-jwt-super-secret-key-2026-xyz"

# Application runtime environment
NODE_ENV="development"
PORT=3000
```

---

## 3. Install Dependencies

Install all core production and developer dependencies:
```bash
npm install
```

---

## 4. Initialize Database and Seed Production Artifacts

Generate the Prisma Client and synchronize the database schema:
```bash
npx prisma db push
```

Run the seed script to populate:
- Default `SUPER_ADMIN` and `EDITOR` roles
- Primary administrator account (`admin@axiontech.in`)
- Company identity & global settings (customizable from admin panel)
- All 7 core technology divisions
- Portfolio case studies with architecture metrics
- Proprietary software & AI tools
- Technical research papers & field notes

```bash
npx tsx prisma/seed.ts
```

Seed credentials:
- **Email:** `admin@axiontech.in`
- **Password:** `Admin@Axion2026!`

---

## 5. Generate Vector Assets

Generate static SVG architectural schematics and technical blueprints:
```bash
npx tsx scripts/generate-assets.ts
```

---

## 6. Run the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Run
```bash
npm run build
npm start
```

---

## 7. Verify Test Suite

Execute the automated security, validation, and configuration tests:
```bash
npx tsx tests/run-tests.ts
```
