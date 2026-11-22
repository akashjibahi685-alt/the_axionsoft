import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const services = await prisma.service.findMany({
    include: { category: true },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ services });
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isPublished, shortDesc, description, tagline } = body;

    if (!id) return NextResponse.json({ error: "Missing service id" }, { status: 400 });

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(shortDesc ? { shortDesc } : {}),
        ...(description ? { description } : {}),
        ...(tagline ? { tagline } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "UPDATE",
        entityType: "Service",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
