import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Shield, Cpu, Terminal, Layers } from "lucide-react";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function AboutPage() {
  const settings = await getCompanySettings();

  const workingPrinciples = [
    {
      title: "First-Principles Decomposition",
      desc: "We do not accept cargo-cult software architecture. Every system requirement is broken down into fundamental latency, consistency, and security constraints.",
    },
    {
      title: "Deterministic Over Probabilistic",
      desc: "In AI and cloud engineering, reliability requires bounded execution. We enforce strict JSON schemas, citation groundings, and fallback state machines.",
    },
    {
      title: "Defensive by Default",
      desc: "Every API endpoint assumes an adversarial network environment. Least privilege, zero-trust cryptographic handshakes, and input sanitization are mandatory.",
    },
    {
      title: "Uncompromising Swiss Craft",
      desc: "We balance brutal computational rigor with high-density visual clarity, responsive typography, and sub-second operational speed.",
    },
  ];

  const engineeringDivisions = [
    {
      name: "Distributed Systems & Cloud",
      focus: "High-throughput transaction pipelines, Kubernetes clusters, event-sourcing engines, and zero-downtime database migrations.",
      icon: <Layers className="w-5 h-5 text-[#B6FF5C]" />,
    },
    {
      name: "Cognitive AI & Applied ML",
      focus: "Hybrid vector-lexical RAG pipelines, multi-agent orchestrators, domain fine-tuning, and air-gapped LLM deployments.",
      icon: <Cpu className="w-5 h-5 text-[#B6FF5C]" />,
    },
    {
      name: "Defensive Cybersecurity & VAPT",
      focus: "Authorized penetration testing, API logic auditing, BOLA detection, cryptosystem inspection, and DevSecOps gates.",
      icon: <Shield className="w-5 h-5 text-[#B6FF5C]" />,
    },
    {
      name: "Frontend & Interface Engineering",
      focus: "Next.js App Router flagships, WebGL/Canvas graphics, sub-second TTFB, and strict WCAG accessibility compliance.",
      icon: <Terminal className="w-5 h-5 text-[#B6FF5C]" />,
    },
  ];

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Hero Header */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-4">
              // STUDIO DOSSIER
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95] max-w-4xl">
              ENGINEERING DIGITAL INFRASTRUCTURE FOR THE NEXT ERA.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl mt-6 leading-relaxed">
              AxionSoft Solution operates at the intersection of rigorous systems engineering, production-grade artificial intelligence, and proactive defensive security.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="border border-[#262626] bg-[#161616] p-8 sm:p-10 space-y-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
                  OUR MISSION
                </span>
                <h2 className="text-2xl font-bold text-[#F5F3EF] uppercase">
                  Transform Complexity into Scalable Power
                </h2>
                <p className="text-sm text-[#A5A5A5] leading-relaxed">
                  {settings.mission}
                </p>
                <div className="pt-4 font-mono text-xs text-[#666]">
                  STATUS: EXECUTING GLOBALLY
                </div>
              </div>

              <div className="border border-[#262626] bg-[#161616] p-8 sm:p-10 space-y-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
                  OUR VISION
                </span>
                <h2 className="text-2xl font-bold text-[#F5F3EF] uppercase">
                  The Trusted Global Technology Partner
                </h2>
                <p className="text-sm text-[#A5A5A5] leading-relaxed">
                  {settings.vision}
                </p>
                <div className="pt-4 font-mono text-xs text-[#666]">
                  HORIZON: 2026 &amp; BEYOND
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Approach */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                01 // ENGINEERING APPROACH
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                How We Build: Strict Specifications Over Guesswork
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workingPrinciples.map((wp, idx) => (
                <div
                  key={wp.title}
                  className="border border-[#262626] bg-[#141414] p-8 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#B6FF5C]">
                      PRINCIPLE // 0{idx + 1}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#B6FF5C]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                    {wp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                    {wp.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organization & Core Disciplines */}
        <section className="py-20 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                02 // ORGANIZATIONAL ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Specialized Engineering Squads
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engineeringDivisions.map((div) => (
                <div
                  key={div.name}
                  className="border border-[#262626] bg-[#131313] p-8 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#1B1B1B] border border-[#333]">
                      {div.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                      {div.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                    {div.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Hubs & Location */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
                  HEADQUARTERS &amp; REACH
                </span>
                <h2 className="text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Rooted in India, Delivering Globally
                </h2>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  Headquartered in the technology hub of Bengaluru, India, AxionSoft Solution provides round-the-clock engineering coverage for clients across North America, Europe, Asia-Pacific, and the Middle East.
                </p>
                <div className="font-mono text-xs space-y-1 pt-2">
                  <div className="text-[#CCC]">HQ: {settings.officeLocation}</div>
                  <div className="text-[#CCC]">COORDINATION: 24/7 ASYNCHRONOUS PROTOCOL</div>
                </div>
              </div>

              <div className="lg:col-span-7 border border-[#262626] bg-[#141414] p-8 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#222] pb-3 text-[#B6FF5C]">
                  <span>NODE RECONCILIATION</span>
                  <span>SYNC STATUS: ACTIVE</span>
                </div>
                <div className="space-y-2 text-[#888]">
                  <div className="flex justify-between">
                    <span>NORTH AMERICA CLIENT SQUAD</span>
                    <span className="text-[#CCC]">EST / PST OVERLAP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EUROPEAN OPERATIONS</span>
                    <span className="text-[#CCC]">GMT / CET CONCURRENT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>APAC &amp; INDIA OPERATIONS</span>
                    <span className="text-[#CCC]">IST LEAD PLATFORM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
              Ready to Engineer What&apos;s Next?
            </h2>
            <p className="text-sm text-[#A5A5A5]">
              Contact our engineering leads directly to discuss your system requirements.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
              >
                <span>Initiate Consultation</span>
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
