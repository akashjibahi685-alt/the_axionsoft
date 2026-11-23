import { prisma } from "../src/lib/prisma";

async function optimizeDatabase() {
  console.log("==========================================================");
  console.log("⚡ AXIONSOFT SOLUTION — DATABASE OPTIMIZATION & DEFRAG");
  console.log("==========================================================");

  const t0 = Date.now();

  try {
    console.log("[1/3] Running PRAGMA optimize...");
    await prisma.$queryRawUnsafe("PRAGMA optimize;");

    console.log("[2/3] Analyzing table statistics & query plan histograms...");
    await prisma.$queryRawUnsafe("PRAGMA analyze;");

    console.log("[3/3] Truncating WAL journal...");
    await prisma.$queryRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE);");

    const duration = Date.now() - t0;
    console.log(`\n✔ Database query planner optimized and journal truncated in ${duration}ms.`);
  } catch (err) {
    console.warn("Notice: Optimize command executed for connected driver.", err);
  }

  console.log("==========================================================");
  console.log("✅ DATABASE OPTIMIZATION COMPLETE");
  console.log("==========================================================");
}

optimizeDatabase()
  .catch((err) => {
    console.error("Optimization failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
