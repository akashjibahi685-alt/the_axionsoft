import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Code2, Cpu, Globe, Smartphone, ShieldCheck, Cloud, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export default async function ServicesIndexPage() {
  const settings = await getCompanySettings();
  const services = await prisma.service.findMany({
    where: { isPublished: true },
    include: { category: true },
    orderBy: { order: "asc" },
  });

  const iconMap: Record<string, React.ReactNode> = {
    software: <Code2 className="w-6 h-6 text-[#B6FF5C]" />,
    "ai-ml": <Cpu className="w-6 h-6 text-[#B6FF5C]" />,
    "web-development": <Globe className="w-6 h-6 text-[#B6FF5C]" />,
    "mobile-development": <Smartphone className="w-6 h-6 text-[#B6FF5C]" />,
    cybersecurity: <ShieldCheck className="w-6 h-6 text-[#B6FF5C]" />,
    cloud: <Cloud className="w-6 h-6 text-[#B6FF5C]" />,
  };

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-4">
              // ENGINEERING CAPABILITIES &amp; DIVISIONS
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95] max-w-4xl">
              MISSION-CRITICAL SOFTWARE, COGNITIVE AI &amp; DEFENSIVE SECURITY.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl mt-6 leading-relaxed">
              We architect, engineer, and secure foundational software systems designed to run reliably under heavy enterprise load.
            </p>
          </div>
        </section>

        {/* Divisions Detailed Grid */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {services.map((svc) => {
              let problems: string[] = [];
              let solutions: string[] = [];
              let techList: string[] = [];
              try {
                problems = JSON.parse(svc.businessProblems);
                solutions = JSON.parse(svc.solutions);
                techList = JSON.parse(svc.technologies);
              } catch {
                // fallbacks
              }

              return (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className="border border-[#262626] bg-[#141414] p-8 sm:p-12 hover:border-[#333] transition-colors"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Title, Icon, Tagline */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#1B1B1B] border border-[#303030] flex items-center justify-center">
                          {iconMap[svc.slug] || <Layers className="w-6 h-6 text-[#B6FF5C]" />}
                        </div>
                        <Badge variant="accent">DIVISION 0{svc.order}</Badge>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF] uppercase">
                        {svc.title}
                      </h2>

                      {svc.tagline && (
                        <p className="font-mono text-xs text-[#B6FF5C] uppercase tracking-wider">
                          {svc.tagline}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                        {svc.description}
                      </p>

                      <div className="pt-4">
                        <Link
                          href={`/services/${svc.slug}`}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_15px_rgba(182,255,92,0.3)]"
                        >
                          <span>Detailed Specifications</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Problems Solved & Solutions Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t lg:border-t-0 lg:border-l border-[#262626] pt-6 lg:pt-0 lg:pl-8">
                      <div className="space-y-3">
                        <h3 className="font-mono text-xs text-[#EF4444] uppercase tracking-wider flex items-center gap-1.5">
                          <span>// Problems We Eliminate</span>
                        </h3>
                        <ul className="space-y-2 text-xs text-[#A5A5A5]">
                          {problems.slice(0, 4).map((prob, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#EF4444] font-mono">✕</span>
                              <span>{prob}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-mono text-xs text-[#B6FF5C] uppercase tracking-wider flex items-center gap-1.5">
                          <span>// Architecture Delivered</span>
                        </h3>
                        <ul className="space-y-2 text-xs text-[#A5A5A5]">
                          {solutions.slice(0, 4).map((sol, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#B6FF5C] font-mono">✓</span>
                              <span>{sol}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech stack row */}
                      <div className="sm:col-span-2 pt-4 border-t border-[#222222]">
                        <span className="font-mono text-[10px] text-[#666] uppercase block mb-2">
                          Production Technologies
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {techList.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 font-mono text-[10px] bg-[#1C1C1C] border border-[#2D2D2D] text-[#888]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 text-center bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
              Require a Custom Architecture Brief?
            </h2>
            <p className="text-sm text-[#A5A5A5]">
              Our engineering directors review technical requirements and provide formal architectural roadmaps.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
              >
                <span>Initiate Project Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}
