# AXIONSOFT SOLUTION — REINFORCED DATABASE ARCHITECTURE

## Entity Relationship & Schema Design Overview

The database is built on **Prisma ORM** with strict foreign key constraints, cascade rules, composite query indices, and dual-driver runtime support for both **SQLite / LibSQL** (zero-config local development) and **PostgreSQL** (enterprise cloud deployments).

---

## 1. Relational Model Schema (All 18 Entities)

```mermaid
erDiagram
    Role ||--o{ AdminUser : "assigns"
    AdminUser ||--o{ AuditLog : "logs"
    ServiceCategory ||--o{ Service : "categorizes"
    ProjectCategory ||--o{ Project : "categorizes"
    Product ||--o{ ProductFeature : "contains"
    BlogCategory ||--o{ BlogPost : "classifies"
    Inquiry ||--o{ AuditLog : "triggers"
    CareerApplication ||--o{ AuditLog : "triggers"
    CompanySetting ||--o{ AuditLog : "records"
    NewsletterSubscriber {
        string id PK
        string email UK
        boolean isActive
        string source
    }
    SystemHealthMetric {
        string id PK
        string metricType
        float value
        string status
    }
    DatabaseBackupLog {
        string id PK
        string fileName
        int fileSize
        string checksum
        string status
    }
```

### Table Specifications

| Model | Purpose | Primary Keys & Indexes | Cascade Policy |
| :--- | :--- | :--- | :--- |
| `AdminUser` | System administrators & credentials | `id` (PK), `email` (UK), `isActive` | `roleId -> Restrict` (prevents deleting active roles) |
| `Role` | Role-based access control (RBAC) | `id` (PK), `name` (UK) | Protected |
| `ServiceCategory` | Divisions taxonomy | `id` (PK), `slug` (UK), `order` | Protected |
| `Service` | Core technology divisions & process | `id` (PK), `slug` (UK), `[isPublished, order]`, `[categoryId, isPublished]` | `categoryId -> Cascade` |
| `ProjectCategory` | Portfolio taxonomies | `id` (PK), `slug` (UK) | Protected |
| `Project` | Case studies, challenges & metrics | `id` (PK), `slug` (UK), `[isPublished, order]`, `[isPublished, isFeatured, order]` | `categoryId -> Cascade` |
| `Product` | Proprietary software & AI assets | `id` (PK), `slug` (UK), `[isPublished, order]`, `status`, `isFeatured` | Protected |
| `ProductFeature` | Granular product capabilities | `id` (PK), `productId`, `order` | `productId -> Cascade` |
| `BlogCategory` | Technical research disciplines | `id` (PK), `slug` (UK) | Protected |
| `BlogPost` | Technical insights & field notes | `id` (PK), `slug` (UK), `[isPublished, publishedAt]`, `[isFeatured]` | `categoryId -> Cascade` |
| `Inquiry` | Client briefs & inbound CRM leads | `id` (PK), `[status, createdAt]`, `businessEmail`, `isArchived` | Protected |
| `CareerApplication` | Job applicants & resume tracking | `id` (PK), `[status, createdAt]`, `email`, `createdAt` | Protected |
| `MediaAsset` | Indexed visual assets & schematics | `id` (PK), `mimeType`, `createdAt`, `checksum` | Protected |
| `CompanySetting` | Brand identity, video runner configs | `id` (PK), `key` (UK), `type` | Protected |
| `AuditLog` | Immutable administration audit trail | `id` (PK), `[adminUserId]`, `[entityType, createdAt]`, `action` | `adminUserId -> SetNull` (preserves trail) |
| `NewsletterSubscriber` | Email updates & subscriber records | `id` (PK), `email` (UK), `[isActive, subscribedAt]` | Protected |
| `SystemHealthMetric` | Latency, memory & telemetry audits | `id` (PK), `[metricType, recordedAt]`, `status` | Auto-recorded |
| `DatabaseBackupLog` | Snapshot verification logs | `id` (PK), `[status, createdAt]`, `checksum` | Immutable audit |

---

## 2. Indexing & Optimization Strategy

1. **Covering Composite Indices**:
   - High-throughput public reads (`isPublished = true`) utilize composite indexes `[isPublished, order]` and `[isPublished, publishedAt]` to avoid file-sorting.
   - Lead management views utilize `[status, createdAt]` for sub-millisecond inbox filtering.
2. **Deduplication Checksums**:
   - `MediaAsset` and `DatabaseBackupLog` enforce SHA-256 cryptographic hashes to eliminate duplicate file writes.
3. **Audit Trail Retention**:
   - `AuditLog` records maintain `onDelete: SetNull` so historical activity records are never purged if an admin user account is decommissioned.

---

## 3. Maintenance & Enterprise Database CLI Scripts

The project includes purpose-built automated diagnostic and backup tools:

### Run Full Database Diagnostic Suite
```bash
npx tsx scripts/db-diagnostics.ts
```
*Outputs table cardinality, verifies 100% native foreign key integrity, and tests index query benchmarks.*

### Create Verified Cryptographic Database Snapshot
```bash
npx tsx scripts/db-backup.ts
```
*Flushes WAL journal, copies snapshot to `backups/backup-[timestamp].db`, verifies SHA-256 checksum, logs metadata in `DatabaseBackupLog`, and prunes snapshots older than 10 iterations.*

### Defragment & Optimize Database Engine
```bash
npx tsx scripts/db-optimize.ts
```
*Executes `PRAGMA optimize`, `PRAGMA analyze`, and truncates the WAL journal.*

---

## 4. Production PostgreSQL Cutover Guide

To switch from the local SQLite/LibSQL database to enterprise PostgreSQL in staging or production:

1. Update your `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@postgres-host:5432/axionsoft_db?schema=public"
   ```
2. Apply the production schema:
   ```bash
   npx prisma db push --schema=prisma/schema.postgresql.prisma
   ```
3. Seed production records:
   ```bash
   npx tsx prisma/seed.ts
   ```
Prisma automatically detects the `postgresql://` protocol in `src/lib/prisma.ts` and mounts the `@prisma/adapter-pg` driver with connection pooling.
