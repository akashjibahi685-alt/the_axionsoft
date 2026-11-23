"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Star,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  tags: string;
  isFeatured: boolean;
  isPublished: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  publishedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT" | null>(null);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "/images/blog/rag.svg",
    categoryId: "",
    readTime: "5 min read",
    authorName: "AxionSoft Engineering Team",
    authorRole: "Technical Research",
    tags: "AI, Architecture, Performance",
    isFeatured: false,
    isPublished: true,
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
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

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const openCreateModal = () => {
    setForm({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "/images/blog/rag.svg",
      categoryId: categories[0]?.id || "",
      readTime: "5 min read",
      authorName: "AxionSoft Engineering Team",
      authorRole: "Technical Research",
      tags: "AI, Distributed Systems, Performance",
      isFeatured: false,
      isPublished: true,
    });
    setActivePost(null);
    setModalMode("CREATE");
  };

  const openEditModal = (post: BlogPost) => {
    setActivePost(post);
    let tagStr = post.tags;
    try {
      const parsed = JSON.parse(post.tags);
      if (Array.isArray(parsed)) tagStr = parsed.join(", ");
    } catch {
      // keep raw string
    }

    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImage: post.coverImage || "/images/blog/rag.svg",
      categoryId: post.categoryId || categories[0]?.id || "",
      readTime: post.readTime || "5 min read",
      authorName: post.authorName || "AxionSoft Engineering Team",
      authorRole: post.authorRole || "Technical Research",
      tags: tagStr,
      isFeatured: post.isFeatured,
      isPublished: post.isPublished,
    });
    setModalMode("EDIT");
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !current }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: !current } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        showToast("Article deleted successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const tagList = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        tags: JSON.stringify(tagList),
        categoryId: form.categoryId || categories[0]?.id,
      };

      const endpoint = "/api/admin/blog";
      const method = modalMode === "CREATE" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(modalMode === "CREATE" ? "Article published successfully" : "Article updated successfully");
        setModalMode(null);
        loadPosts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save article");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred saving article");
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "ALL" || p.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && p.isPublished) ||
        (statusFilter === "DRAFT" && !p.isPublished);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, searchTerm, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter((p) => p.isPublished).length,
      featured: posts.filter((p) => p.isFeatured).length,
      drafts: posts.filter((p) => !p.isPublished).length,
    };
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-[#B6FF5C] text-[#F5F3EF] px-4 py-3 rounded shadow-2xl flex items-center gap-3 font-mono text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#B6FF5C]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            PUBLICATIONS &amp; RESEARCH // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Technical Insights
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPosts}
            title="Refresh publications"
            className="p-2.5 border border-[#2A2A2A] bg-[#141414] text-[#A5A5A5] hover:text-[#F5F3EF] hover:border-[#3D3D3D] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Total Articles</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{stats.total}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Published Live</span>
          <div className="text-2xl font-bold font-mono text-[#B6FF5C] mt-1">{stats.published}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Featured Insights</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{stats.featured}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Drafts</span>
          <div className="text-2xl font-bold font-mono text-[#888] mt-1">{stats.drafts}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="border border-[#262626] bg-[#141414] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search by article title, slug, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#181818] border border-[#2B2B2B] text-[#F5F3EF] pl-9 pr-3 py-2 font-mono text-xs focus:border-[#B6FF5C] outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#888]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#181818] border border-[#2B2B2B] text-[#F5F3EF] px-3 py-2 font-mono text-xs outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#181818] border border-[#2B2B2B] text-[#F5F3EF] px-3 py-2 font-mono text-xs outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading publications repository...</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-[#666] space-y-2">
            <div>NO ARTICLES MATCH SEARCH CRITERIA</div>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("ALL");
                setStatusFilter("ALL");
              }}
              className="text-[#B6FF5C] underline hover:text-[#fff]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs divide-y divide-[#242424]">
            <thead className="bg-[#181818] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#1f1f1f] border border-[#333] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-[#888]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                          <span>{post.title}</span>
                          <Link
                            href={`/insights/${post.slug}`}
                            target="_blank"
                            className="text-[#666] hover:text-[#B6FF5C]"
                            title="Preview article on live site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <span className="text-[10px] text-[#666] block mt-0.5">
                          /{post.slug} • {post.readTime}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[#A5A5A5] bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#2e2e2e]">
                      {post.category?.name || "General"}
                    </span>
                  </td>
                  <td className="p-4 text-[#888]">{post.authorName}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleFeatured(post.id, post.isFeatured)}
                      className={`p-1.5 border text-xs transition-colors rounded ${
                        post.isFeatured
                          ? "bg-[#B6FF5C]/20 border-[#B6FF5C] text-[#B6FF5C]"
                          : "border-[#333] text-[#555] hover:text-[#CCC]"
                      }`}
                      title={post.isFeatured ? "Unpin featured" : "Pin as featured"}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublished(post.id, post.isPublished)}
                      className="cursor-pointer"
                      title="Click to toggle publish status"
                    >
                      <Badge variant={post.isPublished ? "accent" : "neutral"}>
                        {post.isPublished ? "PUBLISHED" : "DRAFT"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="p-1.5 bg-[#1F1F1F] border border-[#333] text-[#CCC] hover:text-[#B6FF5C] hover:border-[#B6FF5C] transition-colors"
                      title="Edit article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-1.5 bg-red-950/20 border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
                      title="Delete Article"
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

      {/* Modal for Create/Edit */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-[#333] bg-[#141414] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <div>
                <span className="font-mono text-[10px] text-[#B6FF5C] uppercase tracking-widest block">
                  {modalMode === "CREATE" ? "NEW PUBLICATION" : `EDITING // ${activePost?.title}`}
                </span>
                <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">
                  {modalMode === "CREATE" ? "Write Technical Article" : "Edit Technical Article"}
                </h2>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-xs font-mono text-[#888] hover:text-[#F5F3EF] p-2"
              >
                ✕ CLOSE
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setForm({
                        ...form,
                        title: newTitle,
                        slug:
                          modalMode === "CREATE"
                            ? newTitle.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
                            : form.slug,
                      });
                    }}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none focus:border-[#B6FF5C]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none focus:border-[#B6FF5C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Read Time</label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                    placeholder="e.g. 6 min read"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Author Role</label>
                  <input
                    type="text"
                    value={form.authorRole}
                    onChange={(e) => setForm({ ...form, authorRole: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Excerpt (Short Abstract) *</label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="## Abstract\n\nDeep dive into system internals..."
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-[#B6FF5C]"
                  />
                  <span className="text-[#CCC]">Feature on Insights homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="accent-[#B6FF5C]"
                  />
                  <span className="text-[#CCC]">Publish Immediately</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#222] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#CCC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#B6FF5C] text-[#101010] font-bold uppercase hover:bg-[#a3f044] disabled:opacity-50"
                >
                  {saving ? "Saving..." : modalMode === "CREATE" ? "Publish Article" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
