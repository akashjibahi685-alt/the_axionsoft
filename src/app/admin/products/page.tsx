"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  status: string;
  isPublished: boolean;
  features: Array<{ id: string; title: string }>;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    tagline: "",
    category: "AI & Automation",
    description: "",
    status: "Active Development",
    feature1: "",
    feature2: "",
  });

  const loadProducts = async () => {
    try {
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete product permanently?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const features = [];
      if (form.feature1) features.push({ title: form.feature1 });
      if (form.feature2) features.push({ title: form.feature2 });

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          tagline: form.tagline,
          category: form.category,
          description: form.description,
          status: form.status,
          features,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setForm({
          name: "",
          slug: "",
          tagline: "",
          category: "AI & Automation",
          description: "",
          status: "Active Development",
          feature1: "",
          feature2: "",
        });
        loadProducts();
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
            PROPRIETARY ASSETS // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Software &amp; AI Products
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading products...</span>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs divide-y divide-[#242424]">
            <thead className="bg-[#181818] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stage / Status</th>
                <th className="p-4">Published</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                      <span>{prod.name}</span>
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="text-[#666] hover:text-[#B6FF5C]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <span className="text-[10px] text-[#888]">{prod.tagline}</span>
                  </td>
                  <td className="p-4 text-[#A5A5A5]">{prod.category}</td>
                  <td className="p-4">
                    <Badge variant="accent" dot>
                      {prod.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <button onClick={() => togglePublished(prod.id, prod.isPublished)}>
                      <Badge variant={prod.isPublished ? "success" : "neutral"}>
                        {prod.isPublished ? "LIVE" : "DRAFT"}
                      </Badge>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(prod.id)}
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
          <div className="max-w-xl w-full border border-[#333] bg-[#141414] p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="text-xs text-[#888]">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-") })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Feature 1</label>
                  <input
                    type="text"
                    value={form.feature1}
                    onChange={(e) => setForm({ ...form, feature1: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-[#888] uppercase mb-1">Feature 2</label>
                  <input
                    type="text"
                    value={form.feature2}
                    onChange={(e) => setForm({ ...form, feature2: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#333] text-[#888]">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#B6FF5C] text-[#101010] font-bold uppercase">
                  {saving ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
