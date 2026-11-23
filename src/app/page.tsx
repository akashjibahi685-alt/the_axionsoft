import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, ShieldCheck, Cpu, Code2, Globe, Smartphone, Cloud, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { ArtemiiHero } from "@/components/sections/ArtemiiHero";
import { WebInMotionGallery } from "@/components/sections/WebInMotionGallery";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export default async function HomePage() {
  const settings = await getCompanySettings();

  // Fetch featured projects, services, products, and articles from database
  const [projects, services, products, blogPosts] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }],
      take: 4,
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { order: "asc" },
    }),
    prisma.product.findMany({
      where: { isPublished: true },
      include: { features: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const serviceIcons: Record<string, React.ReactNode> = {
    software: <Code2 className="w-5 h-5 text-[#B6FF5C]" />,
    "ai-ml": <Cpu className="w-5 h-5 text-[#B6FF5C]" />,
    "web-development": <Globe className="w-5 h-5 text-[#B6FF5C]" />,
    "mobile-development": <Smartphone className="w-5 h-5 text-[#B6FF5C]" />,
    cybersecurity: <ShieldCheck className="w-5 h-5 text-[#B6FF5C]" />,
    cloud: <Cloud className="w-5 h-5 text-[#B6FF5C]" />,
  };

  const processSteps = [
    {
      num: "01",
      title: "Discover",
      desc: "Deconstruct operational bottlenecks, domain models, and technical requirements through rigorous architectural discovery.",
    },
    {
      num: "02",
      title: "Strategize",
      desc: "Design deterministic system blueprints, security boundaries, fault tolerance models, and interface contracts.",
    },
    {
      num: "03",
      title: "Design",
      desc: "Engineer Swiss minimalist typography, high-density ergonomics, responsive layouts, and typed component primitives.",
    },
    {
      num: "04",
      title: "Develop",
      desc: "Implement test-driven, statically typed codebases with CI/CD automation, distributed tracing, and zero-trust principles.",
    },
    {
      num: "05",
      title: "Deploy",
      desc: "Execute blue/green canary deployments to containerized cloud topologies with automated disaster recovery cutover.",
    },
    {
      num: "06",
      title: "Support",
      desc: "Continuous reliability engineering, vulnerability assessments, runtime observability, and SLA-backed maintenance.",
    },
  ];

  const technologies = [
    { name: "React", cat: "Frontend" },
    { name: "Next.js", cat: "Framework" },
    { name: "TypeScript", cat: "Language" },
    { name: "Node.js", cat: "Runtime" },
    { name: "Python", cat: "AI / Data" },
    { name: "Java", cat: "Enterprise" },
    { name: "PostgreSQL", cat: "Database" },
    { name: "Docker", cat: "Container" },
    { name: "Kubernetes", cat: "Orchestration" },
    { name: "PyTorch", cat: "Machine Learning" },
    { name: "TensorFlow", cat: "Neural Nets" },
    { name: "Linux", cat: "Operating System" },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* SECTION 1: ARTEMII LEBEDEV SIGNATURE EDITORIAL HERO       */}
      {/* ========================================================= */}
      <ArtemiiHero
        companyName={settings.companyName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        officeLocation={settings.officeLocation}
        heroVideoUrl={settings.heroVideoUrl}
        heroClipSpan={settings.heroClipSpan}
        heroPlaylist={settings.heroPlaylist}
        projects={projects}
      />

      {/* ========================================================= */}
      {/* SECTION 2: FULL ENTERPRISE DOSSIER (EXPANDED BELOW HERO)   */}
      {/* ========================================================= */}
      <main id="full-dossier" className="min-h-screen bg-[#101010]">
        {/* COMPANY INTRODUCTION */}
        <section className="py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  01 // CAPABILITY STATEMENT
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Engineered with Swiss Rigor, Built for Global Scale.
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-6 text-[#A5A5A5] text-sm sm:text-base leading-relaxed">
                <p>
                  <strong className="text-[#F5F3EF]">Who we are:</strong> AxionSoft Solution is an independent software engineering, artificial intelligence, and cybersecurity technology studio operating from India and delivering for forward-thinking enterprises worldwide.
                </p>
                <p>
                  <strong className="text-[#F5F3EF]">What we build:</strong> Mission-critical distributed systems, deterministic Retrieval-Augmented Generation (RAG) agent platforms, high-concurrency web platforms, native cross-platform mobile apps, and authorized defensive cybersecurity defenses.
                </p>
                <p>
                  <strong className="text-[#F5F3EF]">Who we work with:</strong> Fast-scaling venture-backed technology startups, regulated financial institutions, industrial automation leaders, and enterprises modernizing mission-critical legacy monoliths.
                </p>
                <p>
                  <strong className="text-[#F5F3EF]">How we solve business problems:</strong> We replace fragile abstractions with clean domain models, verified code correctness, immutable infrastructure as code, and continuous vulnerability verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE 3D PERSPECTIVE SHOWCASE (WEB, IN MOTION)      */}
        {/* ========================================================= */}
        <WebInMotionGallery />

        {/* SELECTED WORK (CASE STUDIES) */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  02 // SELECTED CASE STUDIES
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Engineered Solutions &amp; Case Studies
                </h2>
              </div>
              <Link
                href="/work"
                className="font-mono text-xs text-[#B6FF5C] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, idx) => {
                let techList: string[] = [];
                try {
                  techList = JSON.parse(project.technologies);
                } catch {
                  techList = ["Enterprise"];
                }

                return (
                  <article
                    key={project.id}
                    className={`border border-[#262626] bg-[#141414] hover:border-[#383838] transition-all group flex flex-col justify-between ${idx === 0 ? "md:col-span-2" : ""
                      }`}
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-[#181818] overflow-hidden border-b border-[#262626]">
                        <Image
                          src={project.coverImage || "/images/projects/ledger.svg"}
                          alt={project.title}
                          fill
                          className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <Badge variant="accent">
                            {project.category.name}
                          </Badge>
                        </div>
                        {project.clientName && (
                          <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-[#A5A5A5] bg-[#101010]/90 px-2.5 py-1 border border-[#333]">
                            STATUS: {project.clientName.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="p-6 sm:p-8 space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase">
                          <Link href={`/work/${project.slug}`}>
                            {project.title}
                          </Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                          {project.shortDesc}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {techList.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 font-mono text-[10px] bg-[#1E1E1E] border border-[#2D2D2D] text-[#888888]"
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
                        <span>Inspect Case Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#B6FF5C]" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7 CORE DIVISIONS */}
        <section className="py-20 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                03 // CORE DIVISIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Seven Pillars of Modern Technology
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="border border-[#262626] bg-[#131313] hover:border-[#B6FF5C]/50 p-6 sm:p-8 flex flex-col justify-between transition-colors group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-[#1A1A1A] border border-[#303030] flex items-center justify-center">
                        {serviceIcons[svc.slug] || <Layers className="w-5 h-5 text-[#B6FF5C]" />}
                      </div>
                      <span className="font-mono text-xs text-[#666]">
                        DIV // 0{svc.order}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase">
                      {svc.title}
                    </h3>

                    {svc.tagline && (
                      <p className="font-mono text-xs text-[#888888]">
                        {svc.tagline}
                      </p>
                    )}

                    <p className="text-xs text-[#A5A5A5] leading-relaxed">
                      {svc.shortDesc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#202020] mt-6">
                    <Link
                      href={`/services/${svc.slug}`}
                      className="font-mono text-xs text-[#F5F3EF] group-hover:text-[#B6FF5C] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Capability</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* 7th Division: AI Products */}
              <div className="border border-[#B6FF5C]/40 bg-[#171A14] p-6 sm:p-8 flex flex-col justify-between group md:col-span-2 lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="accent">PROPRIETARY R&amp;D</Badge>
                    <span className="font-mono text-xs text-[#B6FF5C]">DIV // 07</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase">
                    AI Products &amp; SaaS
                  </h3>

                  <p className="font-mono text-xs text-[#888888]">
                    Internal Tools Built for Global Deployments
                  </p>

                  <p className="text-xs text-[#A5A5A5] leading-relaxed">
                    We turn repeating engineering patterns into dedicated enterprise software assets: RAG orchestration engines, automated VAPT scanners, and high-frequency event stream processors.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#262D22] mt-6">
                  <Link
                    href="/products"
                    className="font-mono text-xs text-[#B6FF5C] uppercase tracking-wider inline-flex items-center gap-1.5 hover:underline"
                  >
                    <span>View Product Suite</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROPRIETARY PRODUCTS */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  04 // SOFTWARE PRODUCTS &amp; TOOLS
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Proprietary AI &amp; Developer Tooling
                </h2>
              </div>
              <Link
                href="/products"
                className="font-mono text-xs text-[#B6FF5C] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="border border-[#262626] bg-[#141414] p-6 sm:p-8 flex flex-col justify-between hover:border-[#383838] transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[#A5A5A5] uppercase">
                        {prod.category}
                      </span>
                      <Badge variant="accent" dot>
                        {prod.status}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold text-[#F5F3EF] uppercase">
                      {prod.name}
                    </h3>

                    <p className="font-mono text-xs text-[#B6FF5C]">
                      {prod.tagline}
                    </p>

                    <p className="text-xs text-[#888888] leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#222222]">
                      <span className="font-mono text-[10px] text-[#666] uppercase block">
                        Core Capabilities
                      </span>
                      <ul className="space-y-1 text-xs text-[#CCC]">
                        {prod.features.slice(0, 3).map((f) => (
                          <li key={f.id} className="flex items-start gap-1.5">
                            <span className="text-[#B6FF5C] font-mono">•</span>
                            <span>{f.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#202020] mt-6">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="font-mono text-xs text-[#F5F3EF] hover:text-[#B6FF5C] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Product Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECHNOLOGY CAPABILITIES */}
        <section className="py-20 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                05 // TECHNOLOGY FOUNDATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight mb-4">
                Verified Production Stacks
              </h2>
              <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                We only claim technologies in which our core engineering leads maintain demonstrated mastery, benchmarked performance profiles, and defensive hardening experience.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="p-4 border border-[#262626] bg-[#141414] hover:border-[#B6FF5C] transition-colors"
                >
                  <span className="font-mono text-[10px] text-[#666] uppercase block">
                    {tech.cat}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#F5F3EF] mt-1 block">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6-STAGE PROCESS */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                06 // METHODOLOGY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Our 6-Stage Delivery Protocol
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step) => (
                <div
                  key={step.num}
                  className="border border-[#262626] bg-[#131313] p-6 sm:p-8 space-y-3 relative group"
                >
                  <div className="font-mono text-2xl font-black text-[#B6FF5C]">
                    {step.num}
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

        {/* ENGINEERING PHILOSOPHY */}
        <section className="py-24 border-b border-[#262626] bg-[#111111]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
              // ENGINEERING PHILOSOPHY
            </span>
            <blockquote className="text-2xl sm:text-4xl font-bold text-[#F5F3EF] leading-snug tracking-tight">
              &ldquo;Software should be mathematically resilient, visually undeniable, and architected to withstand the adversarial realities of production.&rdquo;
            </blockquote>
            <p className="font-mono text-xs text-[#666666] uppercase tracking-widest">
              AXIONSOFT SOLUTION // PRINCIPLE #01
            </p>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  07 // TECHNICAL INSIGHTS
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Engineering Research &amp; Field Notes
                </h2>
              </div>
              <Link
                href="/insights"
                className="font-mono text-xs text-[#B6FF5C] hover:underline uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>Read All Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="border border-[#262626] bg-[#141414] hover:border-[#383838] transition-colors p-6 sm:p-8 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-[#777]">
                      <span>{post.category.name}</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5F3EF] hover:text-[#B6FF5C] transition-colors uppercase leading-snug">
                      <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs text-[#A5A5A5] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#222222] mt-6">
                    <Link
                      href={`/insights/${post.slug}`}
                      className="font-mono text-xs text-[#F5F3EF] hover:text-[#B6FF5C] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Research Paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="py-24 bg-grid-pattern bg-[#121212]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
              // LET&apos;S COLLABORATE
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-[#F5F3EF] uppercase tracking-tight leading-none">
              HAVE AN IDEA? <br />
              <span className="text-[#B6FF5C]">LET&apos;S MAKE IT REAL.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A5A5A5] max-w-xl mx-auto leading-relaxed">
              Whether you need to architect a new high-throughput platform, audit the defensive security of your APIs, or deploy autonomous AI agents, we are ready.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_25px_rgba(182,255,92,0.4)]"
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
