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
  Cpu,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Feature {
  id?: string;
  title: string;
  description: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  status: string;
  coverImage: string | null;
  demoUrl: string | null;
  docsUrl: string | null;
  pricingInfo: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  features: Feature[];
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [publishFilter, setPublishFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT" | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    slug: "",
    tagline: "",
    category: "AI & Automation",
    description: "",
    status: "Active Development",
    coverImage: "/images/products/copilot.svg",
    demoUrl: "",
    docsUrl: "",
    pricingInfo: "Enterprise Custom",
    order: 0,
    isFeatured: false,
    isPublished: true,
    features: [{ title: "Autonomous Orchestration", description: "Sub-second task delegation" }] as Feature[],
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const openCreateModal = () => {
    setForm({
      id: "",
      name: "",
      slug: "",
      tagline: "Proprietary Enterprise Software Core",
      category: "AI & Automation",
      description: "Engineered for deterministic sub-millisecond workflows across cloud infrastructure.",
      status: "Active Development",
      coverImage: "/images/products/copilot.svg",
      demoUrl: "https://axionsoft.solution",
      docsUrl: "",
      pricingInfo: "Enterprise Tier / Custom Deployment",
      order: products.length,
      isFeatured: false,
      isPublished: true,
      features: [
        { title: "Deterministic State Machine", description: "Zero drift across distributed clusters" },
        { title: "Real-time Telemetry", description: "Sub-millisecond latency monitoring" },
      ],
    });
    setActiveProduct(null);
    setModalMode("CREATE");
  };

  const openEditModal = (prod: Product) => {
    setActiveProduct(prod);
    setForm({
      id: prod.id,
      name: prod.name,
      slug: prod.slug,
      tagline: prod.tagline || "",
      category: prod.category || "AI & Automation",
      description: prod.description || "",
      status: prod.status || "Active Development",
      coverImage: prod.coverImage || "/images/products/copilot.svg",
      demoUrl: prod.demoUrl || "",
      docsUrl: prod.docsUrl || "",
      pricingInfo: prod.pricingInfo || "Enterprise Custom",
      order: prod.order ?? 0,
      isFeatured: prod.isFeatured,
      isPublished: prod.isPublished,
      features: prod.features && prod.features.length > 0
        ? prod.features.map((f) => ({ title: f.title, description: f.description || "" }))
        : [{ title: "", description: "" }],
    });
    setModalMode("EDIT");
  };

  const addFeatureRow = () => {
    setForm({
      ...form,
      features: [...form.features, { title: "", description: "" }],
    });
  };

  const removeFeatureRow = (index: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const updateFeatureRow = (index: number, field: "title" | "description", val: string) => {
    const updated = [...form.features];
    updated[index] = { ...updated[index], [field]: val };
    setForm({ ...form, features: updated });
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured: !current }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePublished = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: !current }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPublished: !current } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete product "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast("Product deleted successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const validFeatures = form.features.filter((f) => f.title.trim() !== "");

      const payload = {
        ...form,
        features: validFeatures,
        order: Number(form.order) || 0,
      };

      const endpoint = "/api/admin/products";
      const method = modalMode === "CREATE" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(modalMode === "CREATE" ? "Product created successfully" : "Product updated successfully");
        setModalMode(null);
        loadProducts();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save product");
      }
    } catch (e) {
      console.error(e);
      alert("Error occurred saving product");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      const matchesPublish =
        publishFilter === "ALL" ||
        (publishFilter === "PUBLISHED" && p.isPublished) ||
        (publishFilter === "DRAFT" && !p.isPublished);

      return matchesSearch && matchesStatus && matchesPublish;
    });
  }, [products, searchTerm, statusFilter, publishFilter]);

  const stats = useMemo(() => {
    return {
      total: products.length,
      live: products.filter((p) => p.status === "Live" || p.status === "ACTIVE").length,
      inDev: products.filter((p) => p.status.includes("Development") || p.status === "Alpha").length,
      beta: products.filter((p) => p.status === "Beta").length,
    };
  }, [products]);

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
            PROPRIETARY ASSETS // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Software &amp; AI Products
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            title="Refresh products list"
            className="p-2.5 border border-[#2A2A2A] bg-[#141414] text-[#A5A5A5] hover:text-[#F5F3EF] hover:border-[#3D3D3D] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Total Suite Assets</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{stats.total}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Live Deployments</span>
          <div className="text-2xl font-bold font-mono text-[#B6FF5C] mt-1">{stats.live}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">In Active Dev</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{stats.inDev}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Beta Preview</span>
          <div className="text-2xl font-bold font-mono text-[#888] mt-1">{stats.beta}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="border border-[#262626] bg-[#141414] p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search products by title, slug, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#181818] border border-[#2B2B2B] text-[#F5F3EF] pl-9 pr-3 py-2 font-mono text-xs focus:border-[#B6FF5C] outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#888]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#181818] border border-[#2B2B2B] text-[#F5F3EF] px-3 py-2 font-mono text-xs outline-none"
            >
              <option value="ALL">All Lifecycle Stages</option>
              <option value="Active Development">Active Development</option>
              <option value="Live">Live</option>
              <option value="Beta">Beta</option>
              <option value="Concept">Concept</option>
            </select>
          </div>

          <select
            value={publishFilter}
            onChange={(e) => setPublishFilter(e.target.value as any)}
            className="bg-[#181818] border border-[#2B2B2B] text-[#F5F3EF] px-3 py-2 font-mono text-xs outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading product modules...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-[#666] space-y-2">
            <div>NO PRODUCTS FOUND MATCHING CRITERIA</div>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setPublishFilter("ALL");
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
                <th className="p-4">Product Name</th>
                <th className="p-4">Lifecycle Stage</th>
                <th className="p-4">Category</th>
                <th className="p-4">Features</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#1f1f1f] border border-[#333] flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-4 h-4 text-[#B6FF5C]" />
                      </div>
                      <div>
                        <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                          <span>{prod.name}</span>
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="text-[#666] hover:text-[#B6FF5C]"
                            title="Preview on live site"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <span className="text-[10px] text-[#666] block mt-0.5">
                          {prod.tagline}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        prod.status === "Live"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800"
                          : prod.status === "Beta"
                          ? "bg-amber-950/40 text-amber-400 border-amber-800"
                          : "bg-blue-950/40 text-blue-400 border-blue-800"
                      }`}
                    >
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#888]">{prod.category}</td>
                  <td className="p-4 text-[#A5A5A5]">
                    <span className="bg-[#1f1f1f] border border-[#333] px-2 py-0.5 text-[10px]">
                      {prod.features?.length || 0} capabilities
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleFeatured(prod.id, prod.isFeatured)}
                      className={`p-1.5 border text-xs transition-colors rounded ${
                        prod.isFeatured
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
                      onClick={() => togglePublished(prod.id, prod.isPublished)}
                      className="cursor-pointer"
                      title="Click to toggle status"
                    >
                      <Badge variant={prod.isPublished ? "accent" : "neutral"}>
                        {prod.isPublished ? "PUBLISHED" : "DRAFT"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 bg-[#1F1F1F] border border-[#333] text-[#CCC] hover:text-[#B6FF5C] hover:border-[#B6FF5C] transition-colors"
                      title="Edit product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-1.5 bg-red-950/20 border border-red-800 text-red-400 hover:bg-red-900/30 transition-colors"
                      title="Delete Product"
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
                  {modalMode === "CREATE" ? "NEW PRODUCT MODULE" : `EDITING // ${activeProduct?.name}`}
                </span>
                <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">
                  {modalMode === "CREATE" ? "Deploy New Product" : "Edit Product Specifications"}
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
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setForm({
                        ...form,
                        name: newName,
                        slug:
                          modalMode === "CREATE"
                            ? newName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
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
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Lifecycle Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  >
                    <option value="Active Development">Active Development</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Beta">Beta</option>
                    <option value="Live">Live</option>
                    <option value="Concept">Concept</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Pricing Model</label>
                  <input
                    type="text"
                    value={form.pricingInfo}
                    onChange={(e) => setForm({ ...form, pricingInfo: e.target.value })}
                    placeholder="e.g. Enterprise Tier"
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Demo / Application URL</label>
                  <input
                    type="text"
                    value={form.demoUrl}
                    onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Documentation URL</label>
                  <input
                    type="text"
                    value={form.docsUrl}
                    onChange={(e) => setForm({ ...form, docsUrl: e.target.value })}
                    placeholder="https://docs..."
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none font-mono"
                />
              </div>

              {/* Dynamic Features Manager */}
              <div className="border border-[#262626] bg-[#111] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#F5F3EF] uppercase">
                    Key Features &amp; Capabilities ({form.features.length})
                  </span>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#B6FF5C] hover:text-[#fff]"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {form.features.map((feat, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Feature title..."
                        value={feat.title}
                        onChange={(e) => updateFeatureRow(idx, "title", e.target.value)}
                        className="flex-1 bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2 text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Feature description (optional)..."
                        value={feat.description}
                        onChange={(e) => updateFeatureRow(idx, "description", e.target.value)}
                        className="flex-1 bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2 text-xs outline-none"
                      />
                      {form.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeatureRow(idx)}
                          className="p-2 text-red-400 hover:text-red-300"
                          title="Remove feature"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="accent-[#B6FF5C]"
                  />
                  <span className="text-[#CCC]">Feature on Showcase</span>
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
                  {saving ? "Saving..." : modalMode === "CREATE" ? "Deploy Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
