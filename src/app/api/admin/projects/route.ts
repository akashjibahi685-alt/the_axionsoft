import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      title,
      slug,
      shortDesc,
      description,
      clientName,
      coverImage,
      challenge,
      solution,
      technologies,
      results,
      categoryId,
      isFeatured,
      isPublished,
    } = body;

    if (!title || !slug || !description || !categoryId) {
      return NextResponse.json({ error: "Missing required project fields" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        shortDesc: shortDesc || title,
        description,
        clientName: clientName || null,
        coverImage: coverImage || "/images/projects/ledger.svg",
        challenge: challenge || "High concurrency requirements",
        solution: solution || "Engineered scalable architecture",
        technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies || []),
        results: results || null,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "CREATE",
        entityType: "Project",
        entityId: project.id,
        details: JSON.stringify({ slug: project.slug }),
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing project id" }, { status: 400 });

  try {
    await prisma.project.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "DELETE",
        entityType: "Project",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isFeatured, isPublished } = body;

    if (!id) return NextResponse.json({ error: "Missing project id" }, { status: 400 });

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}
