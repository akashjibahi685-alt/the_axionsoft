"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Archive,
  Save,
  Trash2,
  Mail,
  Phone,
  Building,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Inquiry {
  id: string;
  fullName: string;
  businessEmail: string;
  companyName: string | null;
  phone: string | null;
  serviceRequired: string;
  budget: string | null;
  timeline: string | null;
  projectDescription: string;
  status: string;
  internalNotes: string | null;
  createdAt: string;
}

function InquiriesView() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects"); // or inquiries API
      // Since we need inquiries, let's fetch directly or create simple GET
      const inqRes = await fetch("/api/inquiries?all=true");
      if (inqRes.ok) {
        const data = await inqRes.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  useEffect(() => {
    if (highlightId && inquiries.length > 0) {
      const found = inquiries.find((i) => i.id === highlightId);
      if (found) {
        setSelectedInquiry(found);
        setNotes(found.internalNotes || "");
      }
    }
  }, [highlightId, inquiries]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry?.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (e) {
      console.error("Status update failed:", e);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes: notes }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? { ...i, internalNotes: notes } : i))
        );
        setSelectedInquiry((prev) => (prev ? { ...prev, internalNotes: notes } : null));
      }
    } catch (e) {
      console.error("Save note failed:", e);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter !== "ALL" && inq.status !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inq.fullName.toLowerCase().includes(term) ||
        inq.businessEmail.toLowerCase().includes(term) ||
        (inq.companyName && inq.companyName.toLowerCase().includes(term)) ||
        inq.serviceRequired.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            CLIENT RELATIONS &amp; BRIEFS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Inquiry Management
          </h1>
        </div>
        <div className="font-mono text-xs text-[#888]">
          TOTAL INQUIRIES: <span className="text-[#F5F3EF]">{inquiries.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#141414] p-4 border border-[#262626]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {["ALL", "NEW", "IN_REVIEW", "CONTACTED", "ARCHIVED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-all ${
                filter === st
                  ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold"
                  : "bg-[#1C1C1C] text-[#888] border-[#303030] hover:text-[#F5F3EF]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#666] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-xs pl-9 pr-3 py-2 font-mono focus:border-[#B6FF5C] focus:outline-none"
          />
        </div>
      </div>

      {/* Split View: List on left, Inspector on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List */}
        <div className="lg:col-span-6 border border-[#262626] bg-[#141414] divide-y divide-[#202020]">
          {loading ? (
            <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
              <span>Loading inquiries...</span>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-12 text-center font-mono text-xs text-[#666]">
              NO INQUIRIES MATCHING CRITERIA.
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq);
                    setNotes(inq.internalNotes || "");
                  }}
                  className={`p-4 cursor-pointer transition-colors space-y-2 ${
                    isSelected ? "bg-[#1C2219] border-l-2 border-[#B6FF5C]" : "hover:bg-[#181818]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#F5F3EF]">
                      {inq.fullName}
                    </span>
                    <Badge
                      variant={
                        inq.status === "NEW"
                          ? "accent"
                          : inq.status === "CONTACTED"
                          ? "success"
                          : "neutral"
                      }
                    >
                      {inq.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#888]">
                    <span>{inq.businessEmail}</span>
                    {inq.companyName && <span>• {inq.companyName}</span>}
                  </div>

                  <div className="text-xs font-mono text-[#B6FF5C]">
                    {inq.serviceRequired}
                  </div>

                  <div className="text-[10px] font-mono text-[#666] flex justify-between">
                    <span>ID: #{inq.id.slice(0, 8)}</span>
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detail Inspector */}
        <div className="lg:col-span-6 border border-[#262626] bg-[#141414] p-6 space-y-6">
          {selectedInquiry ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#242424] pb-4">
                <div>
                  <h3 className="text-lg font-bold uppercase text-[#F5F3EF]">
                    {selectedInquiry.fullName}
                  </h3>
                  <span className="font-mono text-xs text-[#888]">
                    {selectedInquiry.companyName || "Independent Client"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="p-2 bg-red-950/20 border border-red-800 text-red-400 hover:bg-red-900/30 text-xs"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[#777] uppercase block">
                  Workflow Status
                </span>
                <div className="flex flex-wrap gap-2">
                  {["NEW", "IN_REVIEW", "CONTACTED", "ARCHIVED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => updateStatus(selectedInquiry.id, st)}
                      className={`px-2.5 py-1 font-mono text-[11px] uppercase border transition-colors ${
                        selectedInquiry.status === st
                          ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold"
                          : "bg-[#1A1A1A] text-[#888] border-[#333] hover:text-[#F5F3EF]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#181818] border border-[#262626] text-xs font-mono">
                <div className="flex items-center gap-2 text-[#CCC] truncate">
                  <Mail className="w-3.5 h-3.5 text-[#B6FF5C] flex-shrink-0" />
                  <a href={`mailto:${selectedInquiry.businessEmail}`} className="hover:underline truncate">
                    {selectedInquiry.businessEmail}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-[#CCC]">
                  <Phone className="w-3.5 h-3.5 text-[#B6FF5C] flex-shrink-0" />
                  <span>{selectedInquiry.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#CCC]">
                  <Building className="w-3.5 h-3.5 text-[#B6FF5C] flex-shrink-0" />
                  <span>Budget: {selectedInquiry.budget || "Unspecified"}</span>
                </div>
                <div className="flex items-center gap-2 text-[#CCC]">
                  <Clock className="w-3.5 h-3.5 text-[#B6FF5C] flex-shrink-0" />
                  <span>Timeline: {selectedInquiry.timeline || "Flexible"}</span>
                </div>
              </div>

              {/* Project Brief Description */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[#777] uppercase block">
                  Submitted Project Scope &amp; Architecture Brief
                </span>
                <div className="p-4 bg-[#111] border border-[#222] text-xs sm:text-sm text-[#DDD] leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.projectDescription}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-[#222]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#777] uppercase block">
                    Internal Engineering Notes
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNote}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#B6FF5C] hover:underline"
                  >
                    <Save className="w-3 h-3" />
                    <span>{savingNote ? "Saving..." : "Save Note"}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record stakeholder calls, technical feasibility notes, assigned architects..."
                  className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs p-3 focus:border-[#B6FF5C] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="py-24 text-center font-mono text-xs text-[#666]">
              SELECT AN INQUIRY ON THE LEFT TO INSPECT BRIEF DETAILS.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center font-mono text-xs text-[#888]">Loading Inquiries Console...</div>}>
      <InquiriesView />
    </Suspense>
  );
}
