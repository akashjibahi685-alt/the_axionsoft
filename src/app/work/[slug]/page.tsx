import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Case Study | Axion Technologies`,
    description: project.shortDesc,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const settings = await getCompanySettings();

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!project) {
    notFound();
  }

  let processSteps: Array<{ step: string; title: string; desc: string }> = [];
  let techList: string[] = [];
  try {
    processSteps = JSON.parse(project.process);
    techList = JSON.parse(project.technologies);
  } catch {
    // defaults
  }

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[#222] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-mono text-xs text-[#888]">
            <Link href="/work" className="hover:text-[#B6FF5C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </Link>
            <span>/</span>
            <span className="text-[#F5F3EF] uppercase">{project.title}</span>
          </div>
        </div>

        {/* Hero Header */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">{project.category.name}</Badge>
              {project.clientName && (
                <span className="font-mono text-xs text-[#888888]">
                  STATUS: {project.clientName.toUpperCase()}
                </span>
              )}
              {project.projectDate && (
                <span className="font-mono text-xs text-[#666666]">
                  DEPLOYED: {project.projectDate}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95] max-w-4xl">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>
        </section>

        {/* Cover Image Showcase */}
        <section className="border-b border-[#262626] bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="relative aspect-video w-full border border-[#2E2E2E] bg-[#141414] overflow-hidden">
              <Image
                src={project.coverImage || "/images/projects/ledger.svg"}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Technical Deep Dive: Challenge vs Solution */}
        <section className="py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* The Challenge */}
              <div className="border border-[#2E2020] bg-[#171212] p-8 sm:p-10 space-y-4">
                <span className="font-mono text-xs text-[#EF4444] uppercase tracking-widest block">
                  01 // THE ARCHITECTURAL CHALLENGE
                </span>
                <h2 className="text-2xl font-bold text-[#F5F3EF] uppercase">
                  Problem Constraints &amp; Friction
                </h2>
                <p className="text-sm text-[#CCCCCC] leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* The Solution */}
              <div className="border border-[#202E20] bg-[#121712] p-8 sm:p-10 space-y-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
                  02 // THE DELIVERED SOLUTION
                </span>
                <h2 className="text-2xl font-bold text-[#F5F3EF] uppercase">
                  Engineered Blueprint &amp; System
                </h2>
                <p className="text-sm text-[#CCCCCC] leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Execution Process */}
        {processSteps.length > 0 && (
          <section className="py-20 border-b border-[#262626]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  03 // IMPLEMENTATION TIMELINE
                </span>
                <h2 className="text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Development Execution Protocol
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {processSteps.map((s) => (
                  <div
                    key={s.step}
                    className="border border-[#262626] bg-[#141414] p-8 space-y-3"
                  >
                    <div className="font-mono text-2xl font-black text-[#B6FF5C]">
                      {s.step}
                    </div>
                    <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#A5A5A5] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Verified Results & Technology Stack */}
        <section className="py-20 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Results */}
              <div className="lg:col-span-7 space-y-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
                  04 // VERIFIED OUTCOMES
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Demonstrated Production Metrics
                </h2>
                <div className="border border-[#262626] bg-[#141414] p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#B6FF5C]">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="font-mono text-xs uppercase font-bold">
                      VERIFIED SPECIFICATION
                    </span>
                  </div>
                  <p className="text-sm text-[#E5E5E5] leading-relaxed">
                    {project.results || "Performance targets benchmarked under concurrent multi-region load testing with zero data corruption."}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="lg:col-span-5 space-y-4">
                <span className="font-mono text-xs text-[#A5A5A5] uppercase tracking-widest block">
                  05 // ARCHITECTURAL STACK
                </span>
                <h3 className="text-xl font-bold text-[#F5F3EF] uppercase">
                  Production Technologies
                </h3>
                <div className="flex flex-wrap gap-2 pt-2">
                  {techList.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 font-mono text-xs bg-[#1A1A1A] border border-[#333] text-[#F5F3EF]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
              Ready to Build Your System?
            </h2>
            <p className="text-sm text-[#A5A5A5]">
              Contact our engineering leads directly to discuss your system requirements.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
              >
                <span>Initiate Project Inquiry</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
