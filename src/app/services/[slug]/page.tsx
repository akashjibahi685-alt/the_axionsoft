import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) return { title: "Service Not Found" };

  return {
    title: `${service.title} | Axion Technologies`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const settings = await getCompanySettings();

  const service = await prisma.service.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!service) {
    notFound();
  }

  // Parse JSON data structures
  let problems: string[] = [];
  let solutions: string[] = [];
  let processSteps: Array<{ step: string; title: string; desc: string }> = [];
  let techList: string[] = [];
  let faqs: Array<{ q: string; a: string }> = [];

  try {
    problems = JSON.parse(service.businessProblems);
    solutions = JSON.parse(service.solutions);
    processSteps = JSON.parse(service.process);
    techList = JSON.parse(service.technologies);
    faqs = JSON.parse(service.faqs);
  } catch {
    // defaults
  }

  // Related projects
  const relatedProjects = await prisma.project.findMany({
    where: { isPublished: true },
    include: { category: true },
    take: 2,
  });

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[#222] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-mono text-xs text-[#888]">
            <Link href="/services" className="hover:text-[#B6FF5C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Services</span>
            </Link>
            <span>/</span>
            <span className="text-[#F5F3EF] uppercase">{service.title}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">DIVISION 0{service.order}</Badge>
              <span className="font-mono text-xs text-[#A5A5A5]">
                {service.category.name.toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95] max-w-4xl">
              {service.title}
            </h1>

            {service.tagline && (
              <p className="font-mono text-sm sm:text-base text-[#B6FF5C] uppercase tracking-wide">
                // {service.tagline}
              </p>
            )}

            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-3xl leading-relaxed">
              {service.description}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
              >
                <span>Initiate Division Inquiry</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a
                href="#process"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#181818] border border-[#333] hover:border-[#B6FF5C] text-[#F5F3EF] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>View Methodology</span>
              </a>
            </div>
          </div>
        </section>

        {/* Business Problems & Architectural Solutions */}
        <section className="py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Business Problems Eliminated */}
              <div className="border border-[#2E2020] bg-[#171212] p-8 sm:p-10 space-y-6">
                <div className="flex items-center justify-between border-b border-[#2E2020] pb-4">
                  <h2 className="font-mono text-sm font-bold text-[#EF4444] uppercase tracking-wider">
                    // Business Problems Solved
                  </h2>
                  <span className="font-mono text-xs text-[#888]">OBSTACLES</span>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-[#CCCCCC]">
                  {problems.map((prob, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#EF4444] font-mono font-bold mt-0.5">✕</span>
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architectural Solutions Delivered */}
              <div className="border border-[#202E20] bg-[#121712] p-8 sm:p-10 space-y-6">
                <div className="flex items-center justify-between border-b border-[#202E20] pb-4">
                  <h2 className="font-mono text-sm font-bold text-[#B6FF5C] uppercase tracking-wider">
                    // Solutions We Engineer
                  </h2>
                  <span className="font-mono text-xs text-[#888]">CAPABILITIES</span>
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-[#CCCCCC]">
                  {solutions.map((sol, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#B6FF5C] font-mono font-bold mt-0.5">✓</span>
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Process */}
        <section id="process" className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                02 // EXECUTION PROTOCOL
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Engineering Lifecycle for {service.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="border border-[#262626] bg-[#141414] p-8 space-y-3"
                >
                  <div className="font-mono text-2xl font-black text-[#B6FF5C]">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#A5A5A5] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Grid */}
        <section className="py-20 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                03 // TECHNICAL STACK
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Verified Production Technologies
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {techList.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 font-mono text-xs bg-[#171717] border border-[#2D2D2D] text-[#CCCCCC]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Related Projects Case Studies */}
        {relatedProjects.length > 0 && (
          <section className="py-20 border-b border-[#262626]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                    04 // DEMONSTRATED CASE STUDIES
                  </span>
                  <h2 className="text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                    Related Engineering Projects
                  </h2>
                </div>
                <Link
                  href="/work"
                  className="font-mono text-xs text-[#B6FF5C] uppercase tracking-wider hover:underline flex items-center gap-1"
                >
                  <span>All Projects</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="border border-[#262626] bg-[#141414] hover:border-[#383838] transition-colors"
                  >
                    <div className="relative aspect-video w-full bg-[#181818] overflow-hidden border-b border-[#262626]">
                      <Image
                        src={p.coverImage || "/images/projects/ledger.svg"}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <Badge variant="neutral">{p.category.name}</Badge>
                      <h3 className="text-xl font-bold text-[#F5F3EF] uppercase hover:text-[#B6FF5C] transition-colors">
                        <Link href={`/work/${p.slug}`}>{p.title}</Link>
                      </h3>
                      <p className="text-xs text-[#A5A5A5] leading-relaxed">
                        {p.shortDesc}
                      </p>
                      <div className="pt-2">
                        <Link
                          href={`/work/${p.slug}`}
                          className="font-mono text-xs text-[#B6FF5C] uppercase tracking-wider inline-flex items-center gap-1"
                        >
                          <span>Review Architecture</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Frequently Asked Questions */}
        {faqs.length > 0 && (
          <section className="py-20 border-b border-[#262626] bg-[#111111]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div>
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  05 // FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Technical Inquiries &amp; Protocols
                </h2>
              </div>

              <FaqAccordion items={faqs} />
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-24 text-center bg-grid-pattern bg-[#0E0E0E]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
              // LET&apos;S ENGAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F5F3EF] uppercase tracking-tight leading-tight">
              Ready to Engineer Your {service.title}?
            </h2>
            <p className="text-sm text-[#A5A5A5] leading-relaxed">
              Submit your technical brief or schedule an architectural discovery session with our engineering directors.
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
