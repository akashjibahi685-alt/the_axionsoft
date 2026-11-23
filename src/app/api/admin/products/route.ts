import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const status = url.searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { tagline: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { features: { orderBy: { order: "asc" } } },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name,
      slug,
      tagline,
      category,
      description,
      status,
      coverImage,
      demoUrl,
      docsUrl,
      pricingInfo,
      isFeatured,
      isPublished,
      order,
      features,
    } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Product name and description are required" }, { status: 400 });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        tagline: tagline || "Enterprise AI Tooling",
        category: category || "AI & Automation",
        description,
        status: status || "Active Development",
        coverImage: coverImage || "/images/products/copilot.svg",
        demoUrl: demoUrl || null,
        docsUrl: docsUrl || null,
        pricingInfo: pricingInfo || "Enterprise Custom",
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        order: typeof order === "number" ? order : 0,
      },
    });

    if (Array.isArray(features) && features.length > 0) {
      for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        if (typeof feat === "string" ? feat.trim() : feat.title) {
          await prisma.productFeature.create({
            data: {
              productId: product.id,
              title: typeof feat === "string" ? feat.trim() : feat.title,
              description: typeof feat === "string" ? "" : (feat.description || ""),
              order: i + 1,
            },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "CREATE",
        entityType: "Product",
        entityId: product.id,
        details: JSON.stringify({ name: product.name, slug: product.slug }),
      },
    });

    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { features: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ success: true, product: fullProduct }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      tagline,
      category,
      description,
      status,
      coverImage,
      demoUrl,
      docsUrl,
      pricingInfo,
      isFeatured,
      isPublished,
      order,
      features,
    } = body;

    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(slug ? { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : {}),
        ...(tagline !== undefined ? { tagline } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(coverImage !== undefined ? { coverImage } : {}),
        ...(demoUrl !== undefined ? { demoUrl } : {}),
        ...(docsUrl !== undefined ? { docsUrl } : {}),
        ...(pricingInfo !== undefined ? { pricingInfo } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(order !== undefined ? { order: Number(order) } : {}),
      },
    });

    // Re-sync features if provided
    if (Array.isArray(features)) {
      await prisma.productFeature.deleteMany({ where: { productId: id } });
      for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        const title = typeof feat === "string" ? feat.trim() : feat.title;
        if (title) {
          await prisma.productFeature.create({
            data: {
              productId: id,
              title,
              description: typeof feat === "string" ? "" : (feat.description || ""),
              order: i + 1,
            },
          });
        }
      }
    }

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "UPDATE",
        entityType: "Product",
        entityId: id,
        details: JSON.stringify({ name: updated.name, status: updated.status }),
      },
    });

    const fullProduct = await prisma.product.findUnique({
      where: { id },
      include: { features: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json({ success: true, product: fullProduct });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isPublished, status, isFeatured, order } = body;

    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const data: any = {};
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (status !== undefined) data.status = status;
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
    if (order !== undefined) data.order = Number(order);

    const updated = await prisma.product.update({
      where: { id },
      data,
      include: { features: { orderBy: { order: "asc" } } },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "TOGGLE",
        entityType: "Product",
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

  try {
    const deleted = await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "DELETE",
        entityType: "Product",
        entityId: id,
        details: JSON.stringify({ name: deleted.name }),
      },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
