"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Palette,
  Sliders,
  Sparkles,
  RefreshCw,
  Database,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Film,
  Volume2,
  Eye,
  Terminal,
  Globe,
  Share2,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface TelemetryData {
  status: string;
  timestamp: string;
  database: {
    status: string;
    latencyMs: number;
    driver: string;
  };
  system: {
    nodeVersion: string;
    platform: string;
    arch: string;
    uptimeSeconds: number;
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
    };
  };
  cmsCounts: {
    projects: number;
    services: number;
    products: number;
    posts: number;
    inquiries: number;
    users: number;
  };
  dxFeatures: {
    turbopack: boolean;
    partialPrerendering: boolean;
    cacheComponents: boolean;
    multiVideoCrossfade: boolean;
    keyboardRunner60fps: boolean;
  };
}

export default function AdminUiDxPage() {
  const [activeTab, setActiveTab] = useState<"tokens" | "video" | "preview" | "telemetry" | "seo">("tokens");
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Design Tokens State
  const [accentColor, setAccentColor] = useState("#B6FF5C");
  const [bgColor, setBgColor] = useState("#101010");
  const [surfaceColor, setSurfaceColor] = useState("#181818");
  const [borderColor, setBorderColor] = useState("#303030");
  const [designStyle, setDesignStyle] = useState<"swiss" | "monolith" | "matrix">("swiss");

  // Video Runner State
  const [clipDuration, setClipDuration] = useState(6);
  const [crossfadeMs, setCrossfadeMs] = useState(1000);
  const [keyboardRunnerGlow, setKeyboardRunnerGlow] = useState(true);
  const [telemetryWave, setTelemetryWave] = useState(true);

  // SEO & Social State
  const [metaTitle, setMetaTitle] = useState("AXION TECHNOLOGIES // WE BUILD WHAT'S NEXT");
  const [metaDescription, setMetaDescription] = useState(
    "Independent IT, software engineering, cognitive AI, and cybersecurity technology company."
  );
  const [allowIndexing, setAllowIndexing] = useState(true);

  // Audio Synth Context Ref for Audio Test
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [testAudioActive, setTestAudioActive] = useState(false);
  const [testFilterActive, setTestFilterActive] = useState(false);

  // Fetch telemetry
  const fetchTelemetry = async () => {
    setLoadingTelemetry(true);
    try {
      const res = await fetch("/api/admin/telemetry");
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTelemetry(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleRevalidateCache = async () => {
    setRevalidating(true);
    try {
      const res = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMessage(data.message || "Cache successfully purged & routes revalidated!");
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRevalidating(false);
    }
  };

  const playSynthesizerBeep = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);

      setTestAudioActive(true);
      setTimeout(() => setTestAudioActive(false), 300);
    } catch {
      // Audio not permitted
    }
  };

  const videoClips = [
    { title: "HARDWARE // SWITCH LOGIC", path: "/videos/clip1-hardware.mp4", size: "1.8 MB", span: "6s" },
    { title: "NEURAL // TENSOR GRAPH", path: "/videos/clip2-neural.mp4", size: "4.0 MB", span: "6s" },
    { title: "MAINFRAME // CLOUD CLUSTER", path: "/videos/clip3-server.mp4", size: "5.9 MB", span: "6s" },
    { title: "DISTRIBUTED // PIPELINE", path: "/videos/clip4-code.mp4", size: "2.1 MB", span: "6s" },
    { title: "TELEMETRY // RUNTIME CORE", path: "/videos/hero.mp4", size: "3.4 MB", span: "6s" },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Top Header */}
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#B6FF5C] uppercase tracking-widest block">
            DESIGN SYSTEM &amp; DEVELOPER EXPERIENCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            UI / DX Management System
          </h1>
          <p className="text-xs text-[#888888] mt-1 font-sans">
            Centralized control plane for brand design tokens, the multi-video runner engine, interactive component simulator, and Next.js runtime telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRevalidateCache}
            disabled={revalidating}
            className="px-3.5 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] text-xs uppercase text-[#CCC] flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${revalidating ? "animate-spin text-[#B6FF5C]" : ""}`} />
            <span>{revalidating ? "Purging Edge..." : "Purge & Revalidate"}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-800 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#222] pb-3 text-xs">
        <button
          onClick={() => setActiveTab("tokens")}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            activeTab === "tokens"
              ? "bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold"
              : "bg-[#141414] text-[#888] border-[#2A2A2A] hover:text-[#FFF]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Design Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab("video")}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            activeTab === "video"
              ? "bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold"
              : "bg-[#141414] text-[#888] border-[#2A2A2A] hover:text-[#FFF]"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Video Runner &amp; Sequencer</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            activeTab === "preview"
              ? "bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold"
              : "bg-[#141414] text-[#888] border-[#2A2A2A] hover:text-[#FFF]"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Component Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            activeTab === "telemetry"
              ? "bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold"
              : "bg-[#141414] text-[#888] border-[#2A2A2A] hover:text-[#FFF]"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab("seo")}
          className={`px-4 py-2 border transition-all flex items-center gap-2 ${
            activeTab === "seo"
              ? "bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] font-bold"
              : "bg-[#141414] text-[#888] border-[#2A2A2A] hover:text-[#FFF]"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SEO &amp; Social DX</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DESIGN SYSTEM TOKENS                               */}
      {/* ========================================================= */}
      {activeTab === "tokens" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 border border-[#262626] bg-[#141414] p-6 space-y-6">
              <div>
                <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
                  // Visual Color Tokens
                </h2>
                <p className="text-[11px] text-[#777] mt-1 font-sans">
                  Configure brand accents and contrast ratios aligned with Swiss Brutalism rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Primary Accent Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs px-3 py-2 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Primary Background Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs px-3 py-2 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Surface Tone Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={surfaceColor}
                      onChange={(e) => setSurfaceColor(e.target.value)}
                      className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={surfaceColor}
                      onChange={(e) => setSurfaceColor(e.target.value)}
                      className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs px-3 py-2 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Border &amp; Grid Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-10 h-10 border border-[#333] bg-transparent cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs px-3 py-2 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Aesthetic Preset Switcher */}
              <div className="space-y-2 pt-2 border-t border-[#222]">
                <label className="block text-[11px] text-[#888] uppercase">
                  Aesthetic Mode Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setDesignStyle("swiss");
                      setAccentColor("#B6FF5C");
                      setBgColor("#101010");
                    }}
                    className={`p-3 border text-left text-xs ${
                      designStyle === "swiss"
                        ? "border-[#B6FF5C] bg-[#B6FF5C]/10 text-[#F5F3EF]"
                        : "border-[#333] bg-[#181818] text-[#888]"
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#B6FF5C]">SWISS BRUTALIST</div>
                    <div className="text-[10px] text-[#777] mt-1 font-sans">#B6FF5C + Dark Minimal</div>
                  </button>

                  <button
                    onClick={() => {
                      setDesignStyle("monolith");
                      setAccentColor("#FFFFFF");
                      setBgColor("#050505");
                    }}
                    className={`p-3 border text-left text-xs ${
                      designStyle === "monolith"
                        ? "border-[#FFFFFF] bg-[#FFFFFF]/10 text-[#F5F3EF]"
                        : "border-[#333] bg-[#181818] text-[#888]"
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#FFFFFF]">MONOCHROME</div>
                    <div className="text-[10px] text-[#777] mt-1 font-sans">Pure #FFFFFF + #050505</div>
                  </button>

                  <button
                    onClick={() => {
                      setDesignStyle("matrix");
                      setAccentColor("#38BDF8");
                      setBgColor("#070B14");
                    }}
                    className={`p-3 border text-left text-xs ${
                      designStyle === "matrix"
                        ? "border-[#38BDF8] bg-[#38BDF8]/10 text-[#F5F3EF]"
                        : "border-[#333] bg-[#181818] text-[#888]"
                    }`}
                  >
                    <div className="font-bold text-[11px] text-[#38BDF8]">CYBER SKY</div>
                    <div className="text-[10px] text-[#777] mt-1 font-sans">#38BDF8 + Navy Matrix</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Token Swatch Preview */}
            <div className="lg:col-span-5 border border-[#262626] bg-[#141414] p-6 space-y-4">
              <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
                // Computed Swatch Inspector
              </h2>

              <div
                className="p-6 border space-y-4 transition-all"
                style={{
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold" style={{ color: accentColor }}>
                    AXION // LIVE TOKEN PALETTE
                  </span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>

                <div
                  className="p-4 border text-xs"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    color: "#F5F3EF",
                  }}
                >
                  <p className="font-bold uppercase text-[11px] mb-1">
                    Swiss Editorial Layer
                  </p>
                  <p className="text-[10px] text-[#888] font-sans">
                    Zero-gradient surfaces with deterministic border hierarchy and high typographic legibility.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 font-bold text-[10px] uppercase transition-colors"
                    style={{
                      backgroundColor: accentColor,
                      color: "#101010",
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-3 py-1.5 font-bold text-[10px] uppercase border"
                    style={{
                      borderColor: borderColor,
                      color: "#F5F3EF",
                    }}
                  >
                    Outlined
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-[#777] space-y-1 pt-2">
                <div>Primary Accent: <code className="text-[#CCC]">{accentColor}</code></div>
                <div>Background: <code className="text-[#CCC]">{bgColor}</code></div>
                <div>Surface: <code className="text-[#CCC]">{surfaceColor}</code></div>
                <div>Border: <code className="text-[#CCC]">{borderColor}</code></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MULTI-VIDEO RUNNER & SEQUENCER                     */}
      {/* ========================================================= */}
      {activeTab === "video" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 border border-[#262626] bg-[#141414] p-6 space-y-6">
              <div>
                <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
                  // Sequencer Timing &amp; Transition Engine
                </h2>
                <p className="text-[11px] text-[#777] mt-1 font-sans">
                  Dual-buffered video crossfader eliminates black flashing between sequential clips.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Default Time-Span Per Clip: <span className="text-[#B6FF5C] font-bold">{clipDuration} Seconds</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={clipDuration}
                    onChange={(e) => setClipDuration(parseInt(e.target.value, 10))}
                    className="w-full accent-[#B6FF5C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#666] mt-1">
                    <span>3s (Rapid cycle)</span>
                    <span>15s (Moderate)</span>
                    <span>30s (Cinematic hold)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Crossfade Opacity Transition Speed: <span className="text-[#B6FF5C] font-bold">{crossfadeMs}ms</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 1500].map((ms) => (
                      <button
                        key={ms}
                        onClick={() => setCrossfadeMs(ms)}
                        className={`py-2 border text-xs ${
                          crossfadeMs === ms
                            ? "border-[#B6FF5C] text-[#B6FF5C] bg-[#B6FF5C]/10 font-bold"
                            : "border-[#333] text-[#888]"
                        }`}
                      >
                        {ms}ms {ms === 1000 ? "(Default)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#222] space-y-3">
                  <h3 className="text-[11px] font-bold uppercase text-[#CCC]">
                    Ambient Keyboard Canvas Runner Options
                  </h3>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={keyboardRunnerGlow}
                      onChange={(e) => setKeyboardRunnerGlow(e.target.checked)}
                      className="w-4 h-4 accent-[#B6FF5C]"
                    />
                    <span className="text-xs text-[#AAA]">
                      Enable 60fps mechanical switch LED backlight pulse
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={telemetryWave}
                      onChange={(e) => setTelemetryWave(e.target.checked)}
                      className="w-4 h-4 accent-[#B6FF5C]"
                    />
                    <span className="text-xs text-[#AAA]">
                      Render oscilloscope sine-wave data stream across viewport center
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Video Clip Roster */}
            <div className="lg:col-span-6 border border-[#262626] bg-[#141414] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-2">
                <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                  // Registered Active Clips ({videoClips.length})
                </h2>
                <Badge variant="accent" dot>
                  SEQUENCER READY
                </Badge>
              </div>

              <div className="space-y-2">
                {videoClips.map((clip, idx) => (
                  <div
                    key={clip.path}
                    className="p-3 border border-[#242424] bg-[#181818] flex items-center justify-between text-xs hover:border-[#383838] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-[#222] text-[#B6FF5C] font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-[#F5F3EF] text-[11px]">{clip.title}</div>
                        <code className="text-[9px] text-[#777] block">{clip.path}</code>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-[#888]">
                      <div>{clip.size}</div>
                      <span className="text-[#B6FF5C]">{clip.span} span</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COMPONENT SIMULATOR & PLAYGROUND                   */}
      {/* ========================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Dossier Card Simulator */}
            <div className="lg:col-span-6 border border-[#262626] bg-[#141414] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#222] pb-2">
                <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                  // Artemii Lebedev Floating Index Window
                </h2>
                <span className="text-[10px] text-[#777]">LIVE SIMULATION</span>
              </div>

              <div className="w-full bg-[#FFFFFF] text-[#000000] border border-[#000000] p-6 shadow-2xl">
                <div className="grid grid-cols-12 gap-2 pb-5 border-b border-[#000000]">
                  <div className="col-span-6 space-y-1">
                    <h3 className="font-bold text-xs uppercase tracking-tight text-[#000000] leading-none">
                      AXION TECHNOLOGIES
                    </h3>
                    <p className="text-[10px] text-[#444444] uppercase tracking-wider font-sans">
                      IT &amp; COGNITIVE AI STUDIO
                    </p>
                  </div>

                  <div className="col-span-4 flex flex-col space-y-1 text-[11px] uppercase tracking-wider font-semibold">
                    <span className="hover:text-[#B6FF5C] hover:bg-[#000000] px-1 w-fit cursor-pointer">
                      WORK
                    </span>
                    <span className="hover:text-[#B6FF5C] hover:bg-[#000000] px-1 w-fit cursor-pointer">
                      SERVICES
                    </span>
                    <span className="hover:text-[#B6FF5C] hover:bg-[#000000] px-1 w-fit cursor-pointer">
                      PRODUCTS
                    </span>
                    <span className="hover:text-[#B6FF5C] hover:bg-[#000000] px-1 w-fit cursor-pointer">
                      ABOUT
                    </span>
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-[10px] uppercase font-bold tracking-wider underline cursor-pointer">
                      EXPAND
                    </span>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-12 gap-2 items-center text-[11px]">
                  <div className="col-span-6 flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#000000] text-[#FFFFFF] font-bold flex items-center justify-center text-[10px]">
                      7
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      ONGOING DIVISIONS
                    </span>
                  </div>

                  <div className="col-span-6 text-right space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-[#666666] block font-sans">
                      COMMISSIONS &amp; BRIEFS
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#000000] block truncate">
                      contact@axiontech.in
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Pill Simulator */}
              <div className="flex items-center gap-3">
                <button className="px-3.5 py-1.5 bg-[#FFFFFF] text-[#000000] border border-[#000000] font-bold text-[11px] uppercase tracking-widest hover:bg-[#B6FF5C] transition-colors shadow-lg">
                  SELECTED WORK
                </button>
                <div className="text-[10px] text-[#777] font-sans">
                  Target anchor: <code>#full-dossier</code>
                </div>
              </div>
            </div>

            {/* Interaction Diagnostics (Audio & ESC Filter) */}
            <div className="lg:col-span-6 border border-[#262626] bg-[#141414] p-6 space-y-6">
              <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
                // Tactile Audio &amp; ESC Effect Diagnostic
              </h2>

              <div className="p-4 border border-[#242424] bg-[#181818] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#CCC] uppercase">
                    Web Audio API Synthesizer Feedback
                  </span>
                  {testAudioActive && (
                    <Badge variant="accent">AUDIO PULSE EMITTED</Badge>
                  )}
                </div>
                <p className="text-[11px] text-[#777] font-sans">
                  The Artemii Lebedev hero triggers a synthesized 520Hz-1040Hz sine wave tone on &quot;CLICK AND HOLD ···&quot;.
                </p>
                <button
                  onClick={playSynthesizerBeep}
                  className="px-4 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] text-xs uppercase text-[#FFF] inline-flex items-center gap-2"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#B6FF5C]" />
                  <span>Trigger Tactile Audio Tone</span>
                </button>
              </div>

              <div className="p-4 border border-[#242424] bg-[#181818] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#CCC] uppercase">
                    ESC Key Invert / High-Contrast Shader
                  </span>
                  {testFilterActive && (
                    <Badge variant="accent">INVERT SHADER ACTIVE</Badge>
                  )}
                </div>
                <p className="text-[11px] text-[#777] font-sans">
                  Toggles the live contrast, invert, and brightness shader matrices across video layers.
                </p>
                <button
                  onClick={() => setTestFilterActive(!testFilterActive)}
                  className="px-4 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] text-xs uppercase text-[#FFF] inline-flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B6FF5C]" />
                  <span>{testFilterActive ? "Deactivate Filter" : "Simulate ESC Key Press"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SYSTEM TELEMETRY & DX ENGINE                       */}
      {/* ========================================================= */}
      {activeTab === "telemetry" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-[#262626] bg-[#141414] space-y-1">
              <span className="text-[10px] text-[#888] uppercase block">Database Connection</span>
              <div className="text-xl font-bold text-[#B6FF5C] flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>{telemetry?.database.status || "CONNECTING..."}</span>
              </div>
              <span className="text-[10px] text-[#777] block">
                Latency: {telemetry?.database.latencyMs}ms ({telemetry?.database.driver})
              </span>
            </div>

            <div className="p-4 border border-[#262626] bg-[#141414] space-y-1">
              <span className="text-[10px] text-[#888] uppercase block">Process Memory (RSS)</span>
              <div className="text-xl font-bold text-[#F5F3EF]">
                {telemetry?.system.memory.rssMb || "--"} MB
              </div>
              <span className="text-[10px] text-[#777] block">
                Heap Used: {telemetry?.system.memory.heapUsedMb} MB / {telemetry?.system.memory.heapTotalMb} MB
              </span>
            </div>

            <div className="p-4 border border-[#262626] bg-[#141414] space-y-1">
              <span className="text-[10px] text-[#888] uppercase block">Runtime &amp; Platform</span>
              <div className="text-xl font-bold text-[#F5F3EF]">
                {telemetry?.system.nodeVersion || "Node.js"}
              </div>
              <span className="text-[10px] text-[#777] block">
                {telemetry?.system.platform} ({telemetry?.system.arch})
              </span>
            </div>

            <div className="p-4 border border-[#262626] bg-[#141414] space-y-1">
              <span className="text-[10px] text-[#888] uppercase block">Server Uptime</span>
              <div className="text-xl font-bold text-[#B6FF5C]">
                {telemetry?.system.uptimeSeconds
                  ? `${Math.floor(telemetry.system.uptimeSeconds / 60)}m ${telemetry.system.uptimeSeconds % 60}s`
                  : "--"}
              </div>
              <span className="text-[10px] text-[#777] block">Zero-Downtime Daemon</span>
            </div>
          </div>

          <div className="border border-[#262626] bg-[#141414] p-6 space-y-4">
            <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
              // DX Compiler &amp; Next.js 16 Runtime Manifest
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 border border-[#222] bg-[#181818]">
                <div className="text-[10px] text-[#888]">COMPILER</div>
                <div className="text-[#B6FF5C] font-bold">Turbopack v16</div>
              </div>
              <div className="p-3 border border-[#222] bg-[#181818]">
                <div className="text-[10px] text-[#888]">RENDERING</div>
                <div className="text-[#B6FF5C] font-bold">PPR (Partial Pre-render)</div>
              </div>
              <div className="p-3 border border-[#222] bg-[#181818]">
                <div className="text-[10px] text-[#888]">UI RUNTIME</div>
                <div className="text-[#B6FF5C] font-bold">React 19 Engine</div>
              </div>
              <div className="p-3 border border-[#222] bg-[#181818]">
                <div className="text-[10px] text-[#888]">STYLE ENGINE</div>
                <div className="text-[#B6FF5C] font-bold">Tailwind CSS v4</div>
              </div>
              <div className="p-3 border border-[#222] bg-[#181818]">
                <div className="text-[10px] text-[#888]">ORM / ADAPTER</div>
                <div className="text-[#B6FF5C] font-bold">Prisma 7 Multi-Driver</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SEO & SOCIAL DX METADATA                           */}
      {/* ========================================================= */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 border border-[#262626] bg-[#141414] p-6 space-y-4">
              <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
                // Global Metadata &amp; Search Engine Directives
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Meta Title Template
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#888] uppercase mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs p-3 font-sans"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowIndexing}
                      onChange={(e) => setAllowIndexing(e.target.checked)}
                      className="w-4 h-4 accent-[#B6FF5C]"
                    />
                    <span className="text-xs text-[#AAA]">
                      Allow search engines to index public pages (robots.txt index, follow)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Google Search Snippet Simulation */}
            <div className="lg:col-span-5 border border-[#262626] bg-[#141414] p-6 space-y-4">
              <h2 className="text-xs font-bold text-[#F5F3EF] uppercase tracking-wider border-b border-[#222] pb-2">
                // Search Result Snippet Preview
              </h2>

              <div className="p-4 bg-[#1F1F1F] border border-[#333] space-y-1 font-sans">
                <div className="text-[11px] text-[#AAA] flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-[#888]" />
                  <span>https://axiontech.in</span>
                </div>
                <h4 className="text-sm text-[#8AB4F8] hover:underline font-medium cursor-pointer truncate">
                  {metaTitle}
                </h4>
                <p className="text-xs text-[#BDC1C6] line-clamp-2">
                  {metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
