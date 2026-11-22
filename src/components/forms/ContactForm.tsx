"use client";

import React, { useState } from "react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const SERVICES = [
  "Software Engineering",
  "AI & Machine Learning",
  "Web Development",
  "Mobile & Desktop",
  "Cybersecurity & VAPT",
  "Cloud & DevOps",
  "Proprietary Product Inquiry",
];

const BUDGET_OPTIONS = [
  "< $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000+",
  "Flexible / To be defined",
];

const TIMELINE_OPTIONS = [
  "Immediate (< 1 month)",
  "1 – 3 months",
  "3 – 6 months",
  "Strategic long-term",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessEmail: "",
    companyName: "",
    phone: "",
    serviceRequired: SERVICES[0],
    budget: "",
    timeline: "",
    projectDescription: "",
    consent: false,
    website_trap: "", // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ inquiryId: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.consent) {
      setErrorMessage("Please accept the privacy policy terms before submitting.");
      return;
    }

    if (formData.projectDescription.trim().length < 10) {
      setErrorMessage("Please provide a project description with at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSuccessData({ inquiryId: data.inquiryId });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="border border-[#B6FF5C]/30 bg-[#161616] p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#B6FF5C]/10 border border-[#B6FF5C] flex items-center justify-center text-[#B6FF5C]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
            INQUIRY TRANSMITTED SUCCESSFULLY
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F3EF]">
            We Have Received Your Brief.
          </h3>
          <p className="text-sm text-[#A5A5A5] max-w-md mx-auto leading-relaxed">
            Our engineering team will review your requirements and respond within 24 business hours.
          </p>
        </div>
        <div className="font-mono text-xs text-[#666666] pt-4 border-t border-[#262626]">
          REFERENCE ID: <span className="text-[#F5F3EF]">{successData.inquiryId}</span>
        </div>
        <button
          onClick={() => {
            setSuccessData(null);
            setFormData({
              fullName: "",
              businessEmail: "",
              companyName: "",
              phone: "",
              serviceRequired: SERVICES[0],
              budget: "",
              timeline: "",
              projectDescription: "",
              consent: false,
              website_trap: "",
            });
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#202020] border border-[#333] hover:border-[#B6FF5C] text-xs font-mono uppercase text-[#F5F3EF] transition-colors"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#262626] bg-[#141414] p-6 sm:p-10 space-y-8">
      {/* Honeypot anti-spam trap */}
      <input
        type="text"
        name="website_trap"
        value={formData.website_trap}
        onChange={(e) => setFormData({ ...formData, website_trap: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-800 text-red-400 text-xs font-mono">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Service Selection Pills */}
      <div className="space-y-3">
        <label className="block font-mono text-xs text-[#F5F3EF] uppercase tracking-wider">
          01 // Select Core Capability
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => {
            const isSelected = formData.serviceRequired === s;
            return (
              <button
                type="button"
                key={s}
                onClick={() => setFormData({ ...formData, serviceRequired: s })}
                className={`px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-all border ${
                  isSelected
                    ? "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] font-bold shadow-[0_0_12px_rgba(182,255,92,0.25)]"
                    : "bg-[#1B1B1B] text-[#A5A5A5] border-[#2E2E2E] hover:border-[#444] hover:text-[#F5F3EF]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Identity & Company Details */}
      <div className="space-y-4">
        <label className="block font-mono text-xs text-[#F5F3EF] uppercase tracking-wider">
          02 // Contact Information
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Alex Henderson"
              className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
              Business Email *
            </label>
            <input
              type="email"
              required
              value={formData.businessEmail}
              onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
              placeholder="alex@enterprise.com"
              className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
              Company / Organization
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Apex Global Ltd."
              className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 019-2834"
              className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Scope, Budget & Timeline */}
      <div className="space-y-4">
        <label className="block font-mono text-xs text-[#F5F3EF] uppercase tracking-wider">
          03 // Project Scope &amp; Parameters
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
              Estimated Budget
            </label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
            >
              <option value="">Select budget range...</option>
              {BUDGET_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
              Expected Timeline
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
            >
              <option value="">Select target timeline...</option>
              {TIMELINE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#888] mb-1.5 uppercase">
            Project Description &amp; Technical Requirements *
          </label>
          <textarea
            required
            rows={5}
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            placeholder="Describe your operational objectives, system bottlenecks, target architecture, or key deadlines..."
            className="w-full bg-[#1A1A1A] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-3 focus:border-[#B6FF5C] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Consent Checkbox */}
      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="consent"
          checked={formData.consent}
          onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
          className="mt-1 w-4 h-4 rounded-none accent-[#B6FF5C] bg-[#1A1A1A] border-[#303030] cursor-pointer"
        />
        <label htmlFor="consent" className="text-xs text-[#888888] leading-relaxed cursor-pointer select-none">
          I consent to Axion Technologies storing and processing my submitted business information according to the{" "}
          <a href="/privacy" target="_blank" className="text-[#B6FF5C] hover:underline">
            Privacy Policy
          </a>
          . We never sell or distribute your data.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(182,255,92,0.35)]"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Inquiry...</span>
          </>
        ) : (
          <>
            <span>Submit Technical Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
