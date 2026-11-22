import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const careerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Valid email address is required").max(120),
  phone: z.string().max(30).optional().nullable(),
  roleApplied: z.string().min(2, "Role applied is required"),
  portfolioUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")).nullable(),
  resumeUrl: z.string().url("Please provide a valid URL").optional().or(z.literal("")).nullable(),
  coverNote: z.string().max(3000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = careerSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = result.data;

    const application = await prisma.careerApplication.create({
      data: {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        roleApplied: data.roleApplied,
        portfolioUrl: data.portfolioUrl?.trim() || null,
        resumeUrl: data.resumeUrl?.trim() || null,
        coverNote: data.coverNote?.trim() || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been received by our engineering directors.",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }
}
