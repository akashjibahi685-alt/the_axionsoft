# AXION TECHNOLOGIES — ENVIRONMENT CONFIGURATION

This document details all environment variables supported by the Axion Technologies application.

---

## Environment Variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Yes | `file:./dev.db` | Database connection string. Supports SQLite (`file:./...`) or PostgreSQL (`postgresql://user:pass@host:5432/db`). |
| `JWT_SECRET` | Yes (in Prod) | `axion-technologies-...` | Cryptographic secret used by `jose` to sign and verify administrative session JWT tokens. Must be at least 32 characters in production. |
| `NODE_ENV` | No | `development` | Set to `production` for optimized builds, secure cookie flags, and disabled debug logs. |
| `PORT` | No | `3000` | HTTP port on which the Next.js server listens. |

---

## Example `.env` File

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# Administrative Session Security
JWT_SECRET="axion-enterprise-production-jwt-key-2026-b92e71c99f"

# Application Environment
NODE_ENV="production"
PORT=3000
```
