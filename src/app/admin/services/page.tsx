"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  shortDesc: string;
  order: number;
  isPublished: boolean;
  category: { name: string };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ tagline: "", shortDesc: "" });

  const loadServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
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

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...editForm } : s))
        );
        setEditingId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            CORE DIVISIONS // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Services &amp; Capabilities
          </h1>
        </div>
        <div className="font-mono text-xs text-[#888]">
          7 TECHNOLOGY DIVISIONS ACTIVE
        </div>
      </div>

      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading services...</span>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs divide-y divide-[#242424]">
            <thead className="bg-[#181818] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="p-4">Division</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tagline</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {services.map((svc) => {
                const isEditing = editingId === svc.id;
                return (
                  <tr key={svc.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                        <span>{svc.title}</span>
                        <Link
                          href={`/services/${svc.slug}`}
                          target="_blank"
                          className="text-[#666] hover:text-[#B6FF5C]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                      <span className="text-[10px] text-[#666]">/{svc.slug}</span>
                    </td>
                    <td className="p-4 text-[#888]">{svc.category.name}</td>
                    <td className="p-4 max-w-xs truncate text-[#A5A5A5]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.tagline}
                          onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                          className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-1 text-xs"
                        />
                      ) : (
                        svc.tagline || "—"
                      )}
                    </td>
                    <td className="p-4">
                      <button onClick={() => togglePublish(svc.id, svc.isPublished)}>
                        <Badge variant={svc.isPublished ? "accent" : "neutral"}>
                          {svc.isPublished ? "ACTIVE" : "PAUSED"}
                        </Badge>
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(svc.id)}
                          className="px-2.5 py-1 bg-[#B6FF5C] text-[#101010] font-bold text-[10px] uppercase inline-flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(svc.id);
                            setEditForm({ tagline: svc.tagline || "", shortDesc: svc.shortDesc });
                          }}
                          className="px-2.5 py-1 bg-[#1F1F1F] border border-[#333] hover:border-[#B6FF5C] text-[#CCC] text-[10px] uppercase"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
