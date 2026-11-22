import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

async function WorkContent({ searchParams }: Props) {
  const { category } = await searchParams;
  const settings = await getCompanySettings();

  const [categories, projects] = await Promise.all([
    prisma.projectCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.project.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: { slug: category } } : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
    }),
  ]);

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
              // ARCHITECTURAL PORTFOLIO &amp; CASE STUDIES
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95]">
              ENGINEERED ARTIFACTS &amp; SYSTEMS.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl leading-relaxed">
              Explore our demonstrated engineering solutions spanning autonomous AI agent graphs, high-throughput financial ledgers, and zero-trust cloud security perimeters.
            </p>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="py-6 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/work"
                className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider border transition-all ${
                  !category
                    ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold"
                    : "bg-[#181818] text-[#888] border-[#2A2A2A] hover:border-[#444] hover:text-[#F5F3EF]"
                }`}
              >
                All Projects ({projects.length})
              </Link>
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/work?category=${cat.slug}`}
                    className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider border transition-all ${
                      isActive
                        ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold"
                        : "bg-[#181818] text-[#888] border-[#2A2A2A] hover:border-[#444] hover:text-[#F5F3EF]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Project Grid */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => {
                let techList: string[] = [];
                try {
                  techList = JSON.parse(project.technologies);
                } catch {
                  techList = [];
                }

                return (
                  <article
                    key={project.id}
                    className="border border-[#262626] bg-[#141414] hover:border-[#383838] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Blueprint Graphic */}
                      <div className="relative aspect-video w-full bg-[#181818] overflow-hidden border-b border-[#262626]">
                        <Image
                          src={project.coverImage || "/images/projects/ledger.svg"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <Badge variant="accent">{project.category.name}</Badge>
                        </div>
                        {project.clientName && (
                          <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-[#A5A5A5] bg-[#101010]/90 px-2.5 py-1 border border-[#333]">
                            STATUS: {project.clientName.toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8 space-y-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase">
                          <Link href={`/work/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h2>

                        <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                          {project.shortDesc}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {techList.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 font-mono text-[10px] bg-[#1C1C1C] border border-[#2D2D2D] text-[#888888]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 pt-0">
                      <Link
                        href={`/work/${project.slug}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-[#F5F3EF] group-hover:text-[#B6FF5C] uppercase tracking-wider transition-colors"
                      >
                        <span>Examine Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#B6FF5C]" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
              Have a Similar Challenge to Solve?
            </h2>
            <p className="text-sm text-[#A5A5A5]">
              Let our technical architects deconstruct your requirements and propose a resilient blueprint.
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

export default function WorkPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#101010] flex items-center justify-center font-mono text-xs text-[#888]">Loading Case Studies...</div>}>
      <WorkContent searchParams={searchParams} />
    </Suspense>
  );
}
