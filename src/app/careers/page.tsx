"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2, Terminal, Shield, Cpu } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { DEFAULT_SETTINGS } from "@/lib/settings-types";

const OPEN_POSITIONS = [
  {
    id: "dist-sys-eng",
    title: "Senior Distributed Systems Engineer",
    division: "Core Engineering",
    location: "Bengaluru, India / Hybrid / Remote Global",
    type: "Full-Time",
    stack: ["Go", "PostgreSQL", "Kafka", "Kubernetes", "gRPC"],
    desc: "Architect low-latency event-sourced transaction ledgers, distributed state machines, and fault-tolerant consensus systems handling hundreds of thousands of operations per second.",
  },
  {
    id: "ai-rag-eng",
    title: "Lead AI & RAG Research Engineer",
    division: "Artificial Intelligence",
    location: "Bengaluru, India / Hybrid",
    type: "Full-Time",
    stack: ["Python", "PyTorch", "FastAPI", "pgvector", "LangGraph"],
    desc: "Design deterministic Retrieval-Augmented Generation (RAG) engines, autonomous multi-agent tool execution graphs, and quantized model deployment pipelines for high-compliance environments.",
  },
  {
    id: "sec-vapt-spec",
    title: "Application Security & VAPT Specialist",
    division: "Cybersecurity",
    location: "Bengaluru, India / Remote",
    type: "Full-Time",
    stack: ["Burp Suite", "OWASP ZAP", "Static/Dynamic Analysis", "Linux", "Cryptosystems"],
    desc: "Execute authorized defensive penetration testing (VAPT), API logic fuzzing, BOLA discovery, and code-level vulnerability remediation roadmaps under strict bilateral legal rules of engagement.",
  },
];

export function CareersContent() {
  const [selectedRole, setSelectedRole] = useState(OPEN_POSITIONS[0].title);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleApplied: OPEN_POSITIONS[0].title,
    portfolioUrl: "",
    resumeUrl: "",
    coverNote: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, roleApplied: selectedRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
              // ENGINEERING RECRUITMENT
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95]">
              JOIN THE SQUAD.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl leading-relaxed">
              We look for engineers who care about formal correctness, sub-millisecond efficiency, and uncompromising Swiss visual execution. No bureaucracy, just pure craft.
            </p>
          </div>
        </section>

        {/* Culture & Standards */}
        <section className="py-16 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-[#262626] bg-[#161616] space-y-2">
                <div className="w-8 h-8 bg-[#202020] border border-[#333] flex items-center justify-center text-[#B6FF5C]">
                  <Terminal className="w-4 h-4" />
                </div>
                <h3 className="font-mono text-sm font-bold text-[#F5F3EF] uppercase">
                  Zero Technical Compromise
                </h3>
                <p className="text-xs text-[#888] leading-relaxed">
                  We write test-driven code, verify latency profiles, and enforce static typing and peer reviews across all pull requests.
                </p>
              </div>

              <div className="p-6 border border-[#262626] bg-[#161616] space-y-2">
                <div className="w-8 h-8 bg-[#202020] border border-[#333] flex items-center justify-center text-[#B6FF5C]">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-mono text-sm font-bold text-[#F5F3EF] uppercase">
                  Production Research
                </h3>
                <p className="text-xs text-[#888] leading-relaxed">
                  Our engineers regularly publish field research papers, benchmark new algorithms, and open-source developer tooling.
                </p>
              </div>

              <div className="p-6 border border-[#262626] bg-[#161616] space-y-2">
                <div className="w-8 h-8 bg-[#202020] border border-[#333] flex items-center justify-center text-[#B6FF5C]">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-mono text-sm font-bold text-[#F5F3EF] uppercase">
                  Defensive Mindset
                </h3>
                <p className="text-xs text-[#888] leading-relaxed">
                  Security is treated as a fundamental property of our system design, not an audit check at the end of the sprint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions List */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                  01 // CURRENT VACANCIES
                </span>
                <h2 className="text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                  Open Engineering Positions
                </h2>
              </div>
              <span className="font-mono text-xs text-[#888]">
                {OPEN_POSITIONS.length} ROLES ACTIVE
              </span>
            </div>

            <div className="space-y-4">
              {OPEN_POSITIONS.map((pos) => {
                const isChosen = selectedRole === pos.title;
                return (
                  <div
                    key={pos.id}
                    className={`border p-6 sm:p-8 transition-colors ${
                      isChosen ? "border-[#B6FF5C] bg-[#161A14]" : "border-[#262626] bg-[#141414]"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="accent">{pos.division}</Badge>
                          <span className="font-mono text-xs text-[#888]">{pos.location}</span>
                          <span className="font-mono text-xs text-[#666]">• {pos.type}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#F5F3EF] uppercase">
                          {pos.title}
                        </h3>
                        <p className="text-xs text-[#A5A5A5] leading-relaxed">
                          {pos.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {pos.stack.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 font-mono text-[10px] bg-[#1E1E1E] border border-[#2D2D2D] text-[#888]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => {
                            setSelectedRole(pos.title);
                            const formElement = document.getElementById("apply-form");
                            formElement?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`px-5 py-3 font-mono text-xs uppercase font-bold tracking-wider border transition-all ${
                            isChosen
                              ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C]"
                              : "bg-[#1E1E1E] text-[#F5F3EF] border-[#333] hover:border-[#B6FF5C]"
                          }`}
                        >
                          {isChosen ? "Selected for Application" : "Apply For Role →"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section id="apply-form" className="py-20 bg-[#101010]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-[#262626] bg-[#141414] p-8 sm:p-12 space-y-6">
              <div className="border-b border-[#222] pb-4">
                <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-1">
                  02 // DIRECT APPLICATION
                </span>
                <h3 className="text-2xl font-bold text-[#F5F3EF] uppercase">
                  Apply for: {selectedRole}
                </h3>
              </div>

              {success ? (
                <div className="p-8 bg-[#161616] border border-[#B6FF5C]/30 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#B6FF5C] mx-auto" />
                  <h4 className="text-xl font-bold text-[#F5F3EF]">Application Received</h4>
                  <p className="text-xs text-[#A5A5A5] max-w-sm mx-auto">
                    Our engineering leads review all candidate profiles. If there is a strong alignment, we will contact you within 5 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 bg-red-950/20 border border-red-800 text-red-400 font-mono text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                        GitHub / Portfolio URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/your-handle"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                      Link to Resume / CV (PDF or LinkedIn)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or linkedin.com/in/..."
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                      Brief Engineering Note
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Highlight a complex technical problem you solved, a latency bottleneck you diagnosed, or why you want to build with Axion..."
                      value={formData.coverNote}
                      onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Dossier...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Engineering Candidacy</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={DEFAULT_SETTINGS} />
    </>
  );
}

export default function CareersPage() {
  return <CareersContent />;
}
