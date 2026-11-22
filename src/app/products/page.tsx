import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export default async function ProductsPage() {
  const settings = await getCompanySettings();
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: {
      features: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
              // SOFTWARE ECOSYSTEM &amp; TOOLING
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95]">
              PROPRIETARY SOFTWARE &amp; AI ASSETS.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl leading-relaxed">
              We engineer our own specialized developer utilities, RAG orchestration frameworks, and continuous cybersecurity scanners to accelerate enterprise deployments.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-[#262626] bg-[#141414] p-8 sm:p-12 hover:border-[#383838] transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Visual Representation */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative aspect-video w-full bg-[#181818] border border-[#282828] overflow-hidden">
                      <Image
                        src={product.coverImage || "/images/products/copilot.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between font-mono text-xs text-[#888]">
                      <span>CATEGORY: {product.category.toUpperCase()}</span>
                      <Badge variant="accent" dot>
                        {product.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column: Copy & Features */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF] uppercase">
                        {product.name}
                      </h2>
                      <p className="font-mono text-xs sm:text-sm text-[#B6FF5C] uppercase tracking-wide mt-1">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features checklist */}
                    <div className="space-y-3 pt-2 border-t border-[#222]">
                      <span className="font-mono text-xs text-[#F5F3EF] uppercase tracking-wider block">
                        // Key Specifications
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.features.map((feat) => (
                          <div
                            key={feat.id}
                            className="p-3 bg-[#181818] border border-[#282828] space-y-1"
                          >
                            <div className="flex items-center gap-1.5 font-mono text-xs text-[#F5F3EF] font-bold">
                              <Check className="w-3.5 h-3.5 text-[#B6FF5C]" />
                              <span>{feat.title}</span>
                            </div>
                            <p className="text-[11px] text-[#888888] leading-relaxed">
                              {feat.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_15px_rgba(182,255,92,0.3)]"
                      >
                        <span>Product Dossier</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#1E1E1E] border border-[#333] hover:border-[#B6FF5C] text-[#F5F3EF] font-mono text-xs uppercase tracking-wider transition-colors"
                      >
                        <span>Request Access</span>
                        <ArrowRight className="w-4 h-4 text-[#888]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
              Looking for Bespoke Product Engineering?
            </h2>
            <p className="text-sm text-[#A5A5A5]">
              We customize and deploy our proprietary engines into private enterprise infrastructures.
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
