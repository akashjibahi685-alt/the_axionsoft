import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const targetPath = body.path || "/";

    revalidatePath(targetPath);
    revalidatePath("/work");
    revalidatePath("/services");
    revalidatePath("/products");
    revalidatePath("/insights");

    return NextResponse.json({
      success: true,
      revalidated: targetPath,
      timestamp: new Date().toISOString(),
      message: `Edge cache purged and route "${targetPath}" successfully revalidated.`,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to purge cache" },
      { status: 500 }
    );
  }
}
