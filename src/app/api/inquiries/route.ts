import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ inquiries });
}

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

const inquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  businessEmail: z.string().email("Please provide a valid business email").max(120),
  companyName: z.string().max(120).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  serviceRequired: z.string().min(2, "Please select a service"),
  budget: z.string().max(80).optional().nullable(),
  timeline: z.string().max(80).optional().nullable(),
  projectDescription: z.string().min(10, "Please describe your project (minimum 10 characters)").max(3000),
  consent: z.boolean().refine((val) => val === true, "Consent to privacy policy is required"),
  // Honeypot field (should be empty for human submissions)
  website_trap: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    // 1. IP rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);

    if (rateData && now < rateData.resetTime) {
      if (rateData.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many inquiry requests. Please wait a moment before trying again." },
          { status: 429 }
        );
      }
      rateData.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // Clean old rate limit entries occasionally
    if (rateLimitMap.size > 1000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) rateLimitMap.delete(k);
      }
    }

    // 2. Parse and validate body
    const body = await req.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError, issues: result.error.issues }, { status: 400 });
    }

    const data = result.data;

    // 3. Save inquiry to database
    const userAgent = req.headers.get("user-agent") || undefined;
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: data.fullName.trim(),
        businessEmail: data.businessEmail.trim().toLowerCase(),
        companyName: data.companyName?.trim() || null,
        phone: data.phone?.trim() || null,
        serviceRequired: data.serviceRequired,
        budget: data.budget?.trim() || null,
        timeline: data.timeline?.trim() || null,
        projectDescription: data.projectDescription.trim(),
        status: "NEW",
        ipAddress: ip,
        userAgent,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your inquiry has been received by our engineering directors.",
        inquiryId: inquiry.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
