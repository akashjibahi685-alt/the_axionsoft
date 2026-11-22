"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    company_name: "AXION TECHNOLOGIES",
    company_tagline: "WE BUILD WHAT'S NEXT.",
    company_mission: "Transform complex ideas into useful, intelligent, scalable and secure digital products.",
    company_vision: "Become a trusted technology partner for businesses, startups and organizations by delivering innovative software, AI solutions and secure digital infrastructure.",
    contact_email: "contact@axiontech.in",
    contact_phone: "+91 (80) 4920-8000",
    office_location: "Bengaluru, Karnataka, India",
    social_github: "https://github.com/axion-technologies",
    social_linkedin: "https://linkedin.com/company/axion-technologies",
    social_x: "https://x.com/axiontech_in",
    brand_accent: "#B6FF5C",
    brand_background: "#101010",
    hero_video_url: "/videos/hero.mp4",
    hero_clip_span: "6",
    hero_playlist: JSON.stringify([
      { title: "HARDWARE // SWITCH LOGIC", src: "/videos/clip1-hardware.mp4", duration: 6 },
      { title: "NEURAL // TENSOR GRAPH", src: "/videos/clip2-neural.mp4", duration: 6 },
      { title: "MAINFRAME // CLOUD CLUSTER", src: "/videos/clip3-server.mp4", duration: 6 },
      { title: "DISTRIBUTED // PIPELINE", src: "/videos/clip4-code.mp4", duration: 6 },
      { title: "TELEMETRY // RUNTIME CORE", src: "/videos/hero.mp4", duration: 6 },
    ], null, 2),
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, string> = {};
          data.settings?.forEach((s: { key: string; value: string }) => {
            map[s.key] = s.value;
          });
          setSettings((prev) => ({ ...prev, ...map }));
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
        <span>Loading Company Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-[#242424] pb-6">
        <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
          CONFIGURATION ENGINE
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
          Company &amp; Brand Settings
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Modify the brand identity, tagline, contact details, and locations rendered across public pages.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-800 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Company settings saved and synchronized across all public routes!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-800 text-red-400 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 border border-[#262626] bg-[#141414] p-8">
        {/* Core Identity */}
        <div className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
            01 // Brand Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={settings.company_name}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Company Tagline / Motto
              </label>
              <input
                type="text"
                required
                value={settings.company_tagline}
                onChange={(e) => setSettings({ ...settings, company_tagline: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
              Company Mission
            </label>
            <textarea
              rows={2}
              value={settings.company_mission}
              onChange={(e) => setSettings({ ...settings, company_mission: e.target.value })}
              className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
              Company Vision
            </label>
            <textarea
              rows={2}
              value={settings.company_vision}
              onChange={(e) => setSettings({ ...settings, company_vision: e.target.value })}
              className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
            />
          </div>
        </div>

        {/* Contact & Location */}
        <div className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
            02 // Contact &amp; Operating Headquarters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Public Inquiry Email
              </label>
              <input
                type="email"
                required
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Telephone Number
              </label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
              Office Location / Headquarters
            </label>
            <input
              type="text"
              value={settings.office_location}
              onChange={(e) => setSettings({ ...settings, office_location: e.target.value })}
              className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
            03 // Network &amp; Social Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={settings.social_github}
                onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.social_linkedin}
                onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                X / Twitter URL
              </label>
              <input
                type="url"
                value={settings.social_x}
                onChange={(e) => setSettings({ ...settings, social_x: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 focus:border-[#B6FF5C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Visual Brand Colors */}
        <div className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
            04 // Brand Visual Tokens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Brand Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.brand_accent}
                  onChange={(e) => setSettings({ ...settings, brand_accent: e.target.value })}
                  className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={settings.brand_accent}
                  onChange={(e) => setSettings({ ...settings, brand_accent: e.target.value })}
                  className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2 font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Brand Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.brand_background}
                  onChange={(e) => setSettings({ ...settings, brand_background: e.target.value })}
                  className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={settings.brand_background}
                  onChange={(e) => setSettings({ ...settings, brand_background: e.target.value })}
                  className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2 font-mono uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Background Video & Multi-Video Runner */}
        <div className="space-y-4">
          <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
            05 // Multi-Video Background Runner &amp; Sequencer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Primary Fallback Video URL (MP4 / WebM)
              </label>
              <input
                type="text"
                value={settings.hero_video_url}
                onChange={(e) => setSettings({ ...settings, hero_video_url: e.target.value })}
                placeholder="/videos/hero.mp4"
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
                Default Time Span Per Clip (Seconds)
              </label>
              <input
                type="number"
                min="2"
                max="60"
                value={settings.hero_clip_span}
                onChange={(e) => setSettings({ ...settings, hero_clip_span: e.target.value })}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm px-4 py-2.5 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
              Multi-Video Playlist Configuration (JSON Array of Objects)
            </label>
            <textarea
              rows={6}
              value={settings.hero_playlist}
              onChange={(e) => setSettings({ ...settings, hero_playlist: e.target.value })}
              className="w-full bg-[#181818] border border-[#303030] text-[#B6FF5C] font-mono text-xs p-3 focus:outline-none focus:border-[#B6FF5C]"
            />
            <p className="text-[10px] text-[#777] mt-1 font-mono">
              Configure multiple video clips with custom titles, paths, and durations. The front page cycles through these clips seamlessly with opacity crossfading.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#222] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
