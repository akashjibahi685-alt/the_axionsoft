import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | Axion Insights`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const settings = await getCompanySettings();

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  let tags: string[] = [];
  try {
    tags = JSON.parse(post.tags);
  } catch {
    tags = [];
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <Header companyName={settings.companyName} tagline={settings.tagline} />

      <main className="min-h-screen">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-[#222] bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 font-mono text-xs text-[#888]">
            <Link href="/insights" className="hover:text-[#B6FF5C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Insights</span>
            </Link>
            <span>/</span>
            <span className="text-[#F5F3EF] truncate">{post.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-16 sm:py-20 border-b border-[#262626]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="accent">{post.category.name}</Badge>
                <span className="font-mono text-xs text-[#888888] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readTime}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#F5F3EF] tracking-tight uppercase leading-[1.05]">
                {post.title}
              </h1>

              <p className="text-base sm:text-lg text-[#A5A5A5] leading-relaxed">
                {post.excerpt}
              </p>

              {/* Author bar */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#222] font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1E1E1E] border border-[#333] flex items-center justify-center text-[#B6FF5C]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#F5F3EF] block font-bold">{post.authorName}</span>
                    <span className="text-[#777] text-[11px]">{post.authorRole}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video w-full border border-[#2E2E2E] bg-[#141414] overflow-hidden">
              <Image
                src={post.coverImage || "/images/blog/rag.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Markdown Body */}
            <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base text-[#D1D5DB] leading-relaxed pt-4">
              {post.content.split("\n\n").map((para, i) => {
                if (para.startsWith("### ")) {
                  return (
                    <h2
                      key={i}
                      className="text-xl sm:text-2xl font-bold text-[#F5F3EF] uppercase pt-6 pb-2 border-b border-[#222]"
                    >
                      {para.replace("### ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("```")) {
                  const cleaned = para.replace(/```[a-z]*/g, "").trim();
                  return (
                    <pre
                      key={i}
                      className="p-5 bg-[#141414] border border-[#2A2A2A] font-mono text-xs text-[#B6FF5C] overflow-x-auto"
                    >
                      <code>{cleaned}</code>
                    </pre>
                  );
                }
                if (para.startsWith("1. ") || para.startsWith("2. ") || para.startsWith("3. ")) {
                  return (
                    <div key={i} className="pl-4 border-l-2 border-[#B6FF5C]/50 space-y-2 text-[#CCC]">
                      <p>{para}</p>
                    </div>
                  );
                }
                return <p key={i}>{para}</p>;
              })}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="pt-8 border-t border-[#222222] space-y-2">
                <span className="font-mono text-[10px] text-[#666] uppercase block">
                  INDEXED CONCEPTS &amp; TAXONOMY
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 font-mono text-[11px] bg-[#1A1A1A] border border-[#303030] text-[#A5A5A5]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-20 border-b border-[#262626] bg-[#111111]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
                  // FURTHER RESEARCH &amp; PUBLICATIONS
                </h3>
                <Link
                  href="/insights"
                  className="font-mono text-xs text-[#A5A5A5] hover:text-[#F5F3EF] uppercase"
                >
                  All Insights →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <div
                    key={rel.id}
                    className="border border-[#262626] bg-[#141414] p-6 space-y-3 hover:border-[#383838] transition-colors"
                  >
                    <span className="font-mono text-[11px] text-[#888]">{rel.readTime}</span>
                    <h4 className="text-base font-bold text-[#F5F3EF] uppercase hover:text-[#B6FF5C]">
                      <Link href={`/insights/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-xs text-[#888] line-clamp-2">{rel.excerpt}</p>
                    <div className="pt-2">
                      <Link
                        href={`/insights/${rel.slug}`}
                        className="font-mono text-xs text-[#B6FF5C] uppercase flex items-center gap-1"
                      >
                        <span>Examine Paper</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} />
    </>
  );
}
