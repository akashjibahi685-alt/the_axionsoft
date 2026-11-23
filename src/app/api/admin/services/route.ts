import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const categoryId = url.searchParams.get("categoryId");

    const where: any = {};
    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } },
        { tagline: { contains: search } },
        { shortDesc: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [services, categories] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { category: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      }),
      prisma.serviceCategory.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    return NextResponse.json({ services, categories });
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      title,
      slug,
      tagline,
      shortDesc,
      description,
      icon,
      businessProblems,
      solutions,
      process,
      technologies,
      faqs,
      order,
      isPublished,
      categoryId,
    } = body;

    if (!title || !description || !categoryId) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const service = await prisma.service.create({
      data: {
        title,
        slug: cleanSlug,
        tagline: tagline || null,
        shortDesc: shortDesc || title,
        description,
        icon: icon || "Code",
        businessProblems: typeof businessProblems === "string" ? businessProblems : JSON.stringify(businessProblems || []),
        solutions: typeof solutions === "string" ? solutions : JSON.stringify(solutions || []),
        process: typeof process === "string" ? process : JSON.stringify(process || []),
        technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies || []),
        faqs: typeof faqs === "string" ? faqs : JSON.stringify(faqs || []),
        order: typeof order === "number" ? order : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        categoryId,
      },
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "CREATE",
        entityType: "Service",
        entityId: service.id,
        details: JSON.stringify({ title: service.title, slug: service.slug }),
      },
    });

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
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
      tagline,
      shortDesc,
      description,
      icon,
      businessProblems,
      solutions,
      process,
      technologies,
      faqs,
      order,
      isPublished,
      categoryId,
    } = body;

    if (!id) return NextResponse.json({ error: "Missing service id" }, { status: 400 });

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(slug ? { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : {}),
        ...(tagline !== undefined ? { tagline } : {}),
        ...(shortDesc !== undefined ? { shortDesc } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(icon !== undefined ? { icon } : {}),
        ...(businessProblems !== undefined ? { businessProblems: typeof businessProblems === "string" ? businessProblems : JSON.stringify(businessProblems) } : {}),
        ...(solutions !== undefined ? { solutions: typeof solutions === "string" ? solutions : JSON.stringify(solutions) } : {}),
        ...(process !== undefined ? { process: typeof process === "string" ? process : JSON.stringify(process) } : {}),
        ...(technologies !== undefined ? { technologies: typeof technologies === "string" ? technologies : JSON.stringify(technologies) } : {}),
        ...(faqs !== undefined ? { faqs: typeof faqs === "string" ? faqs : JSON.stringify(faqs) } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "UPDATE",
        entityType: "Service",
        entityId: id,
        details: JSON.stringify({ title: updated.title, isPublished: updated.isPublished }),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isPublished, shortDesc, description, tagline, order } = body;

    if (!id) return NextResponse.json({ error: "Missing service id" }, { status: 400 });

    const data: any = {};
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (shortDesc !== undefined) data.shortDesc = shortDesc;
    if (description !== undefined) data.description = description;
    if (tagline !== undefined) data.tagline = tagline;
    if (order !== undefined) data.order = Number(order);

    const updated = await prisma.service.update({
      where: { id },
      data,
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "TOGGLE",
        entityType: "Service",
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing service id" }, { status: 400 });

  try {
    const deleted = await prisma.service.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "DELETE",
        entityType: "Service",
        entityId: id,
        details: JSON.stringify({ title: deleted.title }),
      },
    });

    return NextResponse.json({ success: true, message: "Service deleted" });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
