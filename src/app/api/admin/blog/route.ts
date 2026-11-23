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
        { excerpt: { contains: search } },
        { authorName: { contains: search } },
      ];
    }

    const [posts, categories] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      }),
      prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ posts, categories });
  } catch (error) {
    console.error("Fetch blog error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
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
      excerpt,
      content,
      coverImage,
      categoryId,
      readTime,
      authorName,
      authorRole,
      tags,
      isFeatured,
      isPublished,
    } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 });
    }

    const cleanSlug = (slug || title).toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: cleanSlug,
        excerpt: excerpt || title,
        content,
        coverImage: coverImage || "/images/blog/rag.svg",
        readTime: readTime || "5 min read",
        authorName: authorName || "AxionSoft Engineering Team",
        authorRole: authorRole || "Technical Research",
        tags: typeof tags === "string" ? tags : JSON.stringify(tags || []),
        categoryId,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      },
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "CREATE",
        entityType: "BlogPost",
        entityId: post.id,
        details: JSON.stringify({ title: post.title, slug: post.slug }),
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
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
      excerpt,
      content,
      coverImage,
      categoryId,
      readTime,
      authorName,
      authorRole,
      tags,
      isFeatured,
      isPublished,
    } = body;

    if (!id) return NextResponse.json({ error: "Missing post id" }, { status: 400 });

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(slug ? { slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-") } : {}),
        ...(excerpt !== undefined ? { excerpt } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(coverImage !== undefined ? { coverImage } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(readTime !== undefined ? { readTime } : {}),
        ...(authorName !== undefined ? { authorName } : {}),
        ...(authorRole !== undefined ? { authorRole } : {}),
        ...(tags !== undefined ? { tags: typeof tags === "string" ? tags : JSON.stringify(tags) } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
      },
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "UPDATE",
        entityType: "BlogPost",
        entityId: id,
        details: JSON.stringify({ title: updated.title, isPublished: updated.isPublished }),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, isPublished, isFeatured } = body;

    if (!id) return NextResponse.json({ error: "Missing post id" }, { status: 400 });

    const data: any = {};
    if (isPublished !== undefined) data.isPublished = Boolean(isPublished);
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

    const updated = await prisma.blogPost.update({
      where: { id },
      data,
      include: { category: true },
    });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "TOGGLE",
        entityType: "BlogPost",
        entityId: id,
        details: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Toggle blog post error:", error);
    return NextResponse.json({ error: "Failed to update blog post status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const deleted = await prisma.blogPost.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        adminUserId: session.userId,
        action: "DELETE",
        entityType: "BlogPost",
        entityId: id,
        details: JSON.stringify({ title: deleted.title }),
      },
    });

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
