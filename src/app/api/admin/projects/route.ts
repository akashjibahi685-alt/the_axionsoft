import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.projectCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({ projects, categories });
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
      projectDate,
      projectUrl,
      categoryId,
      isFeatured,
      isPublished,
      order,
    } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const project = await prisma.project.create({
      data: {
        title,
        slug: cleanSlug,
        shortDesc: shortDesc || title,
        description,
        clientName: clientName || null,
        coverImage: coverImage || "/images/projects/ledger.svg",
        challenge: challenge || "High concurrency requirements",
        solution: solution || "Engineered scalable architecture",
        technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies || []),
        results: results || null,
        projectDate: projectDate || "2026",
        projectUrl: projectUrl || null,
        categoryId,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: typeof order === "number" ? order : 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "CREATE",
        entityType: "Project",
        entityId: project.id,
        details: JSON.stringify({ title: project.title, slug: project.slug }),
      },
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      id,
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
      projectDate,
      projectUrl,
      categoryId,
      isFeatured,
      isPublished,
      order,
    } = body;

    if (!id) return NextResponse.json({ error: "Missing project id" }, { status: 400 });

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(slug ? { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : {}),
        ...(shortDesc !== undefined ? { shortDesc } : {}),
        ...(description ? { description } : {}),
        ...(clientName !== undefined ? { clientName } : {}),
        ...(coverImage ? { coverImage } : {}),
        ...(challenge !== undefined ? { challenge } : {}),
        ...(solution !== undefined ? { solution } : {}),
        ...(technologies !== undefined ? { technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies) } : {}),
        ...(results !== undefined ? { results } : {}),
        ...(projectDate !== undefined ? { projectDate } : {}),
        ...(projectUrl !== undefined ? { projectUrl } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "UPDATE",
        entityType: "Project",
        entityId: id,
        details: JSON.stringify({ title: updated.title, isPublished: updated.isPublished }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isFeatured, isPublished, order } = body;

    if (!id) return NextResponse.json({ error: "Missing project id" }, { status: 400 });

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Patch project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
