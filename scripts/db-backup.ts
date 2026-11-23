import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";
import crypto from "crypto";

async function executeDatabaseBackup() {
  console.log("==========================================================");
  console.log("💾 AXIONSOFT SOLUTION — DATABASE BACKUP & SNAPSHOT ENGINE");
  console.log("==========================================================");

  const backupDir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sourceDb = path.resolve(process.cwd(), "dev.db");

  if (!fs.existsSync(sourceDb)) {
    console.error("Source database dev.db does not exist.");
    process.exit(1);
  }

  const backupFileName = `backup-${timestamp}.db`;
  const targetBackupPath = path.join(backupDir, backupFileName);

  console.log(`[1/4] Snapshotting active database to: backups/${backupFileName}`);

  // Flush WAL checkpoint to ensure consistent snapshot
  try {
    await prisma.$queryRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE);");
    console.log("  ✔ WAL journal checkpoint flushed to disk.");
  } catch {
    // If not in WAL mode
  }

  // Copy database file
  fs.copyFileSync(sourceDb, targetBackupPath);
  const stats = fs.statSync(targetBackupPath);

  // Compute SHA-256 Checksum
  const fileBuffer = fs.readFileSync(targetBackupPath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  const checksum = hashSum.digest("hex");
  console.log(`[2/4] Cryptographic Verification: SHA-256 Checksum ${checksum}`);

  // Record total active entities
  const [projects, services, products, blogPosts, settings] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.companySetting.count(),
  ]);
  const totalEntities = projects + services + products + blogPosts + settings;

  // Log to DatabaseBackupLog table
  console.log("[3/4] Recording snapshot metadata in DatabaseBackupLog audit registry...");
  const logRecord = await prisma.databaseBackupLog.create({
    data: {
      fileName: backupFileName,
      fileSize: stats.size,
      checksum,
      driver: "sqlite",
      status: "COMPLETED",
      recordCount: totalEntities,
    },
  });

  console.log(`  ✔ Snapshot logged with ID: ${logRecord.id}`);

  // Cleanup old backups: keep latest 10 snapshots
  console.log("[4/4] Automated Lifecycle Retention: Pruning snapshots older than 10 iterations...");
  const files = fs.readdirSync(backupDir).filter((f) => f.startsWith("backup-") && f.endsWith(".db"));
  if (files.length > 10) {
    const sorted = files.sort();
    const toDelete = sorted.slice(0, sorted.length - 10);
    toDelete.forEach((f) => {
      fs.unlinkSync(path.join(backupDir, f));
      console.log(`  - Pruned archived snapshot: ${f}`);
    });
  }

  console.log("==========================================================");
  console.log(`✅ BACKUP COMPLETED: ${backupFileName} (${(stats.size / 1024).toFixed(2)} KB)`);
  console.log("==========================================================");
}

executeDatabaseBackup()
  .catch((err) => {
    console.error("Backup failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
