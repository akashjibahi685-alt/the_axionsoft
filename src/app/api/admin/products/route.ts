import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { features: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, slug, tagline, category, description, status, coverImage, features } = body;

    if (!name || !slug || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        tagline: tagline || "Enterprise AI Tooling",
        category: category || "AI & Automation",
        description,
        status: status || "Active Development",
        coverImage: coverImage || "/images/products/copilot.svg",
        isPublished: true,
      },
    });

    if (Array.isArray(features)) {
      for (let i = 0; i < features.length; i++) {
        if (features[i].title) {
          await prisma.productFeature.create({
            data: {
              productId: product.id,
              title: features[i].title,
              description: features[i].description || "",
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
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isPublished, status, isFeatured } = body;

    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(status ? { status } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
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
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
