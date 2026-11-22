# AXION TECHNOLOGIES — DATABASE ARCHITECTURE

## Entity Relationship Overview

The database is managed via Prisma ORM with strict referential integrity, indexes, and support for both PostgreSQL and SQLite.

---

## 1. Schema Entities

### Core Entities

| Model | Purpose | Key Attributes |
|---|---|---|
| `AdminUser` | System administrators | `id`, `email`, `passwordHash`, `roleId`, `isActive` |
| `Role` | Role-based access control | `id`, `name` (SUPER_ADMIN, EDITOR), `permissions` |
| `ServiceCategory` | Service taxonomies | `id`, `name`, `slug` |
| `Service` | 7 core engineering divisions | `id`, `slug`, `title`, `tagline`, `businessProblems`, `solutions`, `process`, `technologies`, `faqs`, `order` |
| `ProjectCategory` | Portfolio taxonomies | `id`, `name`, `slug` |
| `Project` | Case studies & solutions | `id`, `slug`, `title`, `challenge`, `solution`, `process`, `technologies`, `results`, `isFeatured` |
| `Product` | Proprietary software & AI assets | `id`, `slug`, `name`, `tagline`, `category`, `status` |
| `ProductFeature` | Granular product capabilities | `id`, `productId`, `title`, `description`, `order` |
| `BlogCategory` | Research disciplines | `id`, `name`, `slug` |
| `BlogPost` | Technical insights & field notes | `id`, `slug`, `title`, `excerpt`, `content`, `readTime`, `authorName`, `tags` |
| `Inquiry` | Client briefs & leads | `id`, `fullName`, `businessEmail`, `companyName`, `serviceRequired`, `budget`, `timeline`, `status`, `internalNotes` |
| `CareerApplication` | Engineering job candidacies | `id`, `fullName`, `email`, `roleApplied`, `portfolioUrl`, `resumeUrl`, `status` |
| `MediaAsset` | Indexed visual assets & schematics | `id`, `filename`, `url`, `mimeType`, `size` |
| `CompanySetting` | Dynamic brand configuration | `id`, `key`, `value`, `description` |
| `AuditLog` | Immutable administration audit trail | `id`, `adminUserId`, `action`, `entityType`, `entityId`, `details`, `createdAt` |

---

## 2. Dual Database Driver Adapter

Axion Technologies features an intelligent, multi-driver database adapter located in `src/lib/prisma.ts`:

- When `DATABASE_URL` starts with `postgres://` or `postgresql://`:
  Automatically connects via `@prisma/adapter-pg` with connection pooling.
- Otherwise:
  Initializes high-speed `@prisma/adapter-libsql` with the local SQLite file.

This provides zero-configuration local development and native PostgreSQL performance in staging and production.

---

## 3. Database Commands

```bash
# Push schema changes to database
npx prisma db push

# Re-generate Prisma Client types
npx prisma generate

# Populate default seed data
npx tsx prisma/seed.ts
```
