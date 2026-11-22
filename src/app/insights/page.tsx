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

async function InsightsContent({ searchParams }: Props) {
  const { category } = await searchParams;
  const settings = await getCompanySettings();

  const [categories, posts] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogPost.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: { slug: category } } : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    }),
  ]);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-20 border-b border-[#262626] bg-grid-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
              // TECHNICAL FIELD NOTES &amp; RESEARCH
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[0.95]">
              ENGINEERING INSIGHTS.
            </h1>
            <p className="text-base sm:text-lg text-[#A5A5A5] max-w-2xl leading-relaxed">
              In-depth research papers, architectural teardowns, and hard-won engineering principles from our distributed systems and AI laboratories.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-b border-[#262626] bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/insights"
                className={`px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider border transition-all ${
                  !category
                    ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold"
                    : "bg-[#181818] text-[#888] border-[#2A2A2A] hover:border-[#444] hover:text-[#F5F3EF]"
                }`}
              >
                All Papers ({posts.length})
              </Link>
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/insights?category=${cat.slug}`}
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

        {/* Featured Article Hero */}
        {featuredPost && (
          <section className="py-16 border-b border-[#262626] bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border border-[#262626] bg-[#141414] hover:border-[#383838] transition-colors overflow-hidden group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 relative aspect-video w-full bg-[#181818]">
                    <Image
                      src={featuredPost.coverImage || "/images/blog/rag.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      priority
                    />
                  </div>
                  <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="accent">FEATURED RESEARCH</Badge>
                      <span className="font-mono text-xs text-[#888]">
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase leading-snug">
                      <Link href={`/insights/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="pt-2 font-mono text-xs text-[#777]">
                      AUTHOR: <span className="text-[#CCC]">{featuredPost.authorName}</span>
                    </div>

                    <div className="pt-4">
                      <Link
                        href={`/insights/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
                      >
                        <span>Read Full Report</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="py-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="border border-[#262626] bg-[#141414] hover:border-[#383838] transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-video w-full bg-[#181818] overflow-hidden border-b border-[#262626]">
                      <Image
                        src={post.coverImage || "/images/blog/zero-trust.svg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-[#777]">
                        <span>{post.category.name}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase leading-snug">
                        <Link href={`/insights/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-[#A5A5A5] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#222222] mt-4 flex items-center justify-between font-mono text-xs">
                    <span className="text-[#666]">{post.authorName}</span>
                    <Link
                      href={`/insights/${post.slug}`}
                      className="text-[#B6FF5C] hover:underline uppercase inline-flex items-center gap-1"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
    </>
  );
}

export default function InsightsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#101010] flex items-center justify-center font-mono text-xs text-[#888]">Loading Research Publications...</div>}>
      <InsightsContent searchParams={searchParams} />
    </Suspense>
  );
}
