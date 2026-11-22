import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Server, Shield } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Axion Technologies Tooling`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const settings = await getCompanySettings();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      features: { orderBy: { order: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[#222] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-mono text-xs text-[#888]">
            <Link href="/products" className="hover:text-[#B6FF5C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>
            <span>/</span>
            <span className="text-[#F5F3EF] uppercase">{product.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent" dot>
                {product.status}
              </Badge>
              <span className="font-mono text-xs text-[#A5A5A5]">
                CATEGORY: {product.category.toUpperCase()}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95] max-w-4xl">
              {product.name}
            </h1>

            <p className="font-mono text-sm sm:text-base text-[#B6FF5C] uppercase tracking-wide">
              // {product.tagline}
            </p>

            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-3xl leading-relaxed">
              {product.description}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
              >
                <span>Request Technical Demo / License</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Product Visual Blueprint */}
        <section className="border-b border-[#262626] bg-[#0C0C0C] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-video w-full border border-[#2E2E2E] bg-[#141414] overflow-hidden">
              <Image
                src={product.coverImage || "/images/products/copilot.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Deep Dive Features */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                01 // ARCHITECTURAL FEATURES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Engineered Capabilities &amp; Specifications
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feat, idx) => (
                <div
                  key={feat.id}
                  className="border border-[#262626] bg-[#141414] p-8 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#B6FF5C]">
                      SPEC // 0{idx + 1}
                    </span>
                    <Check className="w-4 h-4 text-[#B6FF5C]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deployment Options */}
        <section className="py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block mb-2">
                02 // ENTERPRISE DEPLOYMENT MODELS
              </span>
              <h2 className="text-3xl font-bold text-[#F5F3EF] uppercase tracking-tight">
                Zero Cloud-Telemetry Guarantee
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-[#262626] bg-[#161616] p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1F1F1F] border border-[#333] text-[#B6FF5C]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                    Air-Gapped On-Premises Cluster
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  Deployable directly on your private bare-metal GPU clusters or air-gapped private subnets. Zero telemetry, zero external token calls, 100% compliant with strict regulatory mandates.
                </p>
              </div>

              <div className="border border-[#262626] bg-[#161616] p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#1F1F1F] border border-[#333] text-[#B6FF5C]">
                    <Server className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F5F3EF] uppercase">
                    Dedicated Single-Tenant Cloud VPC
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  Provisioned inside an isolated VPC on AWS, GCP, or DigitalOcean with private peering, encrypted database endpoints, and dedicated autoscaling Kubernetes worker nodes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 text-center bg-[#111111]">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F5F3EF] uppercase tracking-tight">
              Ready to Pilot {product.name}?
            </h2>
            <p className="text-sm text-[#A5A5A5]">
              Contact our engineering team to arrange access credentials or discuss custom enterprise integration.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
              >
                <span>Initiate Access Request</span>
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
