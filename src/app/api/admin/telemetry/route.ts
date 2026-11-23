import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startPing = Date.now();
  let dbStatus = "HEALTHY";
  let dbLatency = 0;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startPing;
  } catch (err) {
    dbStatus = "DEGRADED";
    dbLatency = -1;
  }

  const [
    projectCount,
    serviceCount,
    productCount,
    postCount,
    inquiryCount,
    userCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.inquiry.count(),
    prisma.adminUser.count(),
  ]);

  const memoryUsage = process.memoryUsage();

  return NextResponse.json({
    status: "NOMINAL",
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
      driver: process.env.DATABASE_URL?.startsWith("file:") ? "LibSQL / SQLite (Embedded Zero-Config)" : "PostgreSQL (Enterprise)",
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
    },
    cmsCounts: {
      projects: projectCount,
      services: serviceCount,
      products: productCount,
      posts: postCount,
      inquiries: inquiryCount,
      users: userCount,
    },
    dxFeatures: {
      turbopack: true,
      partialPrerendering: true,
      cacheComponents: true,
      multiVideoCrossfade: true,
      keyboardRunner60fps: true,
    },
  });
}
