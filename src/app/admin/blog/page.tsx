"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  readTime: string;
  authorName: string;
  isPublished: boolean;
  category: { id: string; name: string };
  publishedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: "",
    readTime: "6 min read",
    authorName: "Axion Research Group",
    tags: "AI, Architecture, Performance",
  });

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete article permanently?")) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || categories[0]?.id,
          tags: form.tags.split(",").map((s) => s.trim()),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setForm({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          categoryId: "",
          readTime: "6 min read",
          authorName: "Axion Research Group",
          tags: "AI, Architecture, Performance",
        });
        loadPosts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            PUBLICATIONS &amp; RESEARCH // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Technical Insights
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading publications...</span>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs divide-y divide-[#242424]">
            <thead className="bg-[#181818] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Read Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                      <span>{post.title}</span>
                      <Link
                        href={`/insights/${post.slug}`}
                        target="_blank"
                        className="text-[#666] hover:text-[#B6FF5C]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <span className="text-[10px] text-[#888]">/{post.slug}</span>
                  </td>
                  <td className="p-4 text-[#A5A5A5]">{post.category.name}</td>
                  <td className="p-4 text-[#888]">{post.authorName}</td>
                  <td className="p-4 text-[#888]">{post.readTime}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 bg-red-950/20 border border-red-800 text-red-400 hover:bg-red-900/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#333] bg-[#141414] p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">Publish Technical Article</h2>
              <button onClick={() => setShowModal(false)} className="text-xs text-[#888]">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-") })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Article Body (Markdown) *</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#333] text-[#888]">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#B6FF5C] text-[#101010] font-bold uppercase">
                  {saving ? "Publishing..." : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
