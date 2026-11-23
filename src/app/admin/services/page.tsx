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
  Terminal,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  shortDesc: string;
  description: string;
  icon: string;
  businessProblems: string;
  solutions: string;
  process: string;
  technologies: string;
  faqs: string;
  order: number;
  isPublished: boolean;
  categoryId: string;
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "PAUSED">("ALL");

  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT" | null>(null);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    tagline: "",
    shortDesc: "",
    description: "",
    icon: "Code",
    businessProblems: "",
    solutions: "",
    technologies: "",
    categoryId: "",
    order: 0,
    isPublished: true,
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
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
      tagline: "Autonomous Enterprise Systems Engineering",
      shortDesc: "Scalable architecture tailored for low-latency operational environments.",
      description: "Engineered from first principles with deterministic state pipelines and automated resiliency.",
      icon: "Code",
      businessProblems: "High latency overhead, Architectural drift, Fragile orchestration pipelines",
      solutions: "Distributed resilient actors, Sub-millisecond event buses, Automated verification gates",
      technologies: "TypeScript, Go, Rust, PostgreSQL, Kubernetes",
      categoryId: categories[0]?.id || "",
      order: services.length,
      isPublished: true,
    });
    setActiveService(null);
    setModalMode("CREATE");
  };

  const openEditModal = (svc: Service) => {
    setActiveService(svc);

    const parseList = (raw: string) => {
      try {
        const p = JSON.parse(raw);
        if (Array.isArray(p)) return p.join(", ");
      } catch {
        // raw string
      }
      return raw || "";
    };

    setForm({
      id: svc.id,
      title: svc.title,
      slug: svc.slug,
      tagline: svc.tagline || "",
      shortDesc: svc.shortDesc || "",
      description: svc.description || "",
      icon: svc.icon || "Code",
      businessProblems: parseList(svc.businessProblems),
      solutions: parseList(svc.solutions),
      technologies: parseList(svc.technologies),
      categoryId: svc.categoryId || categories[0]?.id || "",
      order: svc.order ?? 0,
      isPublished: svc.isPublished,
    });
    setModalMode("EDIT");
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !current }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isPublished: !current } : s))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete division "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        showToast("Service division deleted successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parseComma = (str: string) =>
        str
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

      const payload = {
        ...form,
        businessProblems: JSON.stringify(parseComma(form.businessProblems)),
        solutions: JSON.stringify(parseComma(form.solutions)),
        technologies: JSON.stringify(parseComma(form.technologies)),
        order: Number(form.order) || 0,
        categoryId: form.categoryId || categories[0]?.id,
      };

      const endpoint = "/api/admin/services";
      const method = modalMode === "CREATE" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(modalMode === "CREATE" ? "Service created successfully" : "Service updated successfully");
        setModalMode(null);
        loadServices();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save service");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred saving service");
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.tagline && s.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "ALL" || s.categoryId === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && s.isPublished) ||
        (statusFilter === "PAUSED" && !s.isPublished);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: services.length,
      published: services.filter((s) => s.isPublished).length,
      paused: services.filter((s) => !s.isPublished).length,
      categoriesCount: categories.length,
    };
  }, [services, categories]);

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
            CORE DIVISIONS // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Services &amp; Capabilities
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadServices}
            title="Refresh services"
            className="p-2.5 border border-[#2A2A2A] bg-[#141414] text-[#A5A5A5] hover:text-[#F5F3EF] hover:border-[#3D3D3D] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Division</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Total Divisions</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{stats.total}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Active &amp; Visible</span>
          <div className="text-2xl font-bold font-mono text-[#B6FF5C] mt-1">{stats.published}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Paused</span>
          <div className="text-2xl font-bold font-mono text-[#888] mt-1">{stats.paused}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Categories</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{stats.categoriesCount}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="border border-[#262626] bg-[#141414] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search divisions by title, slug, tagline, or category..."
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
            <option value="PUBLISHED">Active Only</option>
            <option value="PAUSED">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading services directory...</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-[#666] space-y-2">
            <div>NO SERVICE DIVISIONS FOUND</div>
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
                <th className="p-4">Division</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tagline</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {filteredServices.map((svc) => (
                <tr key={svc.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#1f1f1f] border border-[#333] flex items-center justify-center flex-shrink-0">
                        <Terminal className="w-4 h-4 text-[#B6FF5C]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                          <span>{svc.title}</span>
                          <Link
                            href={`/services/${svc.slug}`}
                            target="_blank"
                            className="text-[#666] hover:text-[#B6FF5C]"
                            title="Preview service on live site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <span className="text-[10px] text-[#666] block mt-0.5">/{svc.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[#A5A5A5] bg-[#1e1e1e] px-2 py-0.5 rounded border border-[#2e2e2e]">
                      {svc.category?.name || "Division"}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs truncate text-[#888]">{svc.tagline || "—"}</td>
                  <td className="p-4 text-[#888]">#{svc.order}</td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePublish(svc.id, svc.isPublished)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={svc.isPublished ? "accent" : "neutral"}>
                        {svc.isPublished ? "ACTIVE" : "PAUSED"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(svc)}
                      className="p-1.5 bg-[#1F1F1F] border border-[#333] text-[#CCC] hover:text-[#B6FF5C] hover:border-[#B6FF5C] transition-colors"
                      title="Edit division specifications"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id, svc.title)}
                      className="p-1.5 bg-red-950/20 border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
                      title="Delete Division"
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
                  {modalMode === "CREATE" ? "NEW SERVICE DIVISION" : `EDITING // ${activeService?.title}`}
                </span>
                <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">
                  {modalMode === "CREATE" ? "Deploy New Capability" : "Edit Division Specifications"}
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
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Division Title *</label>
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
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Icon Identifier</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="e.g. Code, Server, Cpu"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Division Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="e.g. Autonomous AI Agents & Neural RAG Pipelines"
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Short Description (Summary) *</label>
                <input
                  type="text"
                  required
                  value={form.shortDesc}
                  onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Comprehensive Description *</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">
                    Business Problems Solved (Comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={form.businessProblems}
                    onChange={(e) => setForm({ ...form, businessProblems: e.target.value })}
                    placeholder="Slow data sync, High maintenance cost, Security compliance gaps"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">
                    Engineered Solutions (Comma separated)
                  </label>
                  <textarea
                    rows={2}
                    value={form.solutions}
                    onChange={(e) => setForm({ ...form, solutions: e.target.value })}
                    placeholder="Sub-millisecond event brokers, Zero-trust encryption, Automated self-healing"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">
                  Core Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="TypeScript, Python, LibSQL, Redis, Docker"
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="accent-[#B6FF5C]"
                />
                <label htmlFor="pub" className="text-xs text-[#CCC] cursor-pointer">
                  Activate and publish division immediately
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
                  {saving ? "Saving..." : modalMode === "CREATE" ? "Deploy Division" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
