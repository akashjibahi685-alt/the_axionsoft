"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, ExternalLink, Star, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Project {
  id: string;
  slug: string;
  title: string;
  clientName: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  category: { id: string; name: string };
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDesc: "",
    description: "",
    clientName: "Demonstration Case Study",
    challenge: "",
    solution: "",
    categoryId: "",
    technologies: "Next.js, TypeScript, PostgreSQL",
    isFeatured: false,
  });

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
      // Also fetch categories if needed
      const catRes = await fetch("/api/admin/services"); // or categories
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !current }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: !current } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project permanently?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || projects[0]?.category.id,
          technologies: form.technologies.split(",").map((s) => s.trim()),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({
          title: "",
          slug: "",
          shortDesc: "",
          description: "",
          clientName: "Demonstration Case Study",
          challenge: "",
          solution: "",
          categoryId: "",
          technologies: "Next.js, TypeScript, PostgreSQL",
          isFeatured: false,
        });
        loadData();
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
            PORTFOLIO &amp; ARTIFACTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Project Case Studies
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-[#666]">
            NO PROJECTS FOUND. CREATE ONE ABOVE.
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs divide-y divide-[#242424]">
            <thead className="bg-[#181818] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="p-4">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4 font-bold text-[#F5F3EF]">
                    <div className="flex items-center gap-2">
                      <span>{proj.title}</span>
                      <Link
                        href={`/work/${proj.slug}`}
                        target="_blank"
                        className="text-[#666] hover:text-[#B6FF5C]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <span className="text-[10px] text-[#777] block mt-0.5">/{proj.slug}</span>
                  </td>
                  <td className="p-4 text-[#A5A5A5]">{proj.category.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleFeatured(proj.id, proj.isFeatured)}
                      className={`p-1.5 border text-xs transition-colors ${
                        proj.isFeatured
                          ? "bg-[#B6FF5C]/20 border-[#B6FF5C] text-[#B6FF5C]"
                          : "border-[#333] text-[#555] hover:text-[#CCC]"
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublished(proj.id, proj.isPublished)}
                      className="cursor-pointer"
                    >
                      <Badge variant={proj.isPublished ? "accent" : "neutral"}>
                        {proj.isPublished ? "PUBLISHED" : "DRAFT"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(proj.id)}
                      className="p-1.5 bg-red-950/20 border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
                      title="Delete Project"
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

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#333] bg-[#141414] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4">
              <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">
                Create New Project
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs font-mono text-[#888] hover:text-[#F5F3EF]"
              >
                ✕ CLOSE
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      setForm({
                        ...form,
                        title: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                      });
                    }}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Short Description</label>
                <input
                  type="text"
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Architectural Challenge</label>
                  <textarea
                    rows={2}
                    value={form.challenge}
                    onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Delivered Solution</label>
                  <textarea
                    rows={2}
                    value={form.solution}
                    onChange={(e) => setForm({ ...form, solution: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="feat"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-[#B6FF5C]"
                />
                <label htmlFor="feat" className="text-xs text-[#CCC] cursor-pointer">
                  Feature this project on the homepage
                </label>
              </div>

              <div className="pt-4 border-t border-[#222] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#CCC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#B6FF5C] text-[#101010] font-bold uppercase hover:bg-[#a3f044]"
                >
                  {saving ? "Publishing..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
