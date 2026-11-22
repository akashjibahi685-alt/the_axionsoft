"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Mail, Phone, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface CareerApp {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  roleApplied: string;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  coverNote: string | null;
  status: string;
  createdAt: string;
}

export default function AdminCareersPage() {
  const [apps, setApps] = useState<CareerApp[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApps = async () => {
    try {
      const res = await fetch("/api/admin/careers");
      if (res.ok) {
        const data = await res.json();
        setApps(data.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/careers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setApps((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
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
            ENGINEERING APPLICANTS // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Job Applications
          </h1>
        </div>
        <div className="font-mono text-xs text-[#888]">
          TOTAL CANDIDATES: <span className="text-[#F5F3EF]">{apps.length}</span>
        </div>
      </div>

      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading candidates...</span>
          </div>
        ) : apps.length === 0 ? (
          <div className="p-12 text-center font-mono text-xs text-[#666]">
            NO ACTIVE CANDIDATE APPLICATIONS RECEIVED YET.
          </div>
        ) : (
          <div className="divide-y divide-[#242424]">
            {apps.map((app) => (
              <div key={app.id} className="p-6 space-y-3 hover:bg-[#181818] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-[#F5F3EF] uppercase">{app.fullName}</h3>
                    <span className="font-mono text-xs text-[#B6FF5C]">{app.roleApplied}</span>
                  </div>

                  {/* Status selector */}
                  <div className="flex items-center gap-1.5">
                    {["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(app.id, st)}
                        className={`px-2 py-0.5 font-mono text-[10px] uppercase border transition-colors ${
                          app.status === st
                            ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold"
                            : "bg-[#181818] text-[#777] border-[#333] hover:text-[#CCC]"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#888]">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#666]" />
                    <a href={`mailto:${app.email}`} className="text-[#CCC] hover:underline">
                      {app.email}
                    </a>
                  </span>
                  {app.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#666]" />
                      <span>{app.phone}</span>
                    </span>
                  )}
                  {app.portfolioUrl && (
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B6FF5C] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B6FF5C] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Resume Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {app.coverNote && (
                  <p className="text-xs text-[#A5A5A5] bg-[#111] p-3 border border-[#222] rounded-none whitespace-pre-wrap leading-relaxed">
                    {app.coverNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
