"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Play, Pause, ChevronLeft, ChevronRight, Clock, Film } from "lucide-react";

export interface VideoClip {
  title: string;
  src: string;
  duration: number; // seconds
}

interface ArtemiiHeroProps {
  companyName: string;
  tagline: string;
  contactEmail: string;
  officeLocation: string;
  heroVideoUrl?: string;
  heroClipSpan?: number;
  heroPlaylist?: string;
  projects: Array<{
    id: string;
    slug: string;
    title: string;
    category: { name: string };
    projectDate: string | null;
  }>;
}

const DEFAULT_PLAYLIST: VideoClip[] = [
  { title: "HARDWARE // SWITCH LOGIC", src: "/videos/clip1-hardware.mp4", duration: 6 },
  { title: "NEURAL // TENSOR GRAPH", src: "/videos/clip2-neural.mp4", duration: 6 },
  { title: "MAINFRAME // CLOUD CLUSTER", src: "/videos/clip3-server.mp4", duration: 6 },
  { title: "DISTRIBUTED // PIPELINE", src: "/videos/clip4-code.mp4", duration: 6 },
  { title: "TELEMETRY // RUNTIME CORE", src: "/videos/hero.mp4", duration: 6 },
];

export function ArtemiiHero({
  companyName,
  tagline,
  contactEmail,
  officeLocation,
  heroVideoUrl = "/videos/hero.mp4",
  heroClipSpan = 6,
  heroPlaylist,
  projects,
}: ArtemiiHeroProps) {
  // Parse playlist
  const playlist: VideoClip[] = useMemo(() => {
    if (heroPlaylist) {
      try {
        const parsed = JSON.parse(heroPlaylist);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return DEFAULT_PLAYLIST;
  }, [heroPlaylist]);

  const [timeStr, setTimeStr] = useState("15:37:45 IST");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [effectsActive, setEffectsActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [audioActive, setAudioActive] = useState(false);

  // Multi-video sequence state
  const [currentClipIdx, setCurrentClipIdx] = useState(0);
  const [timeSpan, setTimeSpan] = useState(heroClipSpan || 6); // default seconds per clip
  const [elapsedMs, setElapsedMs] = useState(0);

  // Dual-slot video references for seamless opacity crossfade
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  const [slotASrc, setSlotASrc] = useState(playlist[0]?.src || "/videos/hero.mp4");
  const [slotBSrc, setSlotBSrc] = useState(playlist[1]?.src || "/videos/clip1-hardware.mp4");
  const [slotALoaded, setSlotALoaded] = useState(false);
  const [slotBLoaded, setSlotBLoaded] = useState(false);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Live ticking clock in IST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const formatter = new Intl.DateTimeFormat("en-GB", options);
      setTimeStr(`${formatter.format(now)} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Multi-video timer sequence engine
  useEffect(() => {
    if (!isVideoPlaying) return;

    const tickInterval = 100; // 100ms precision
    const totalSpanMs = timeSpan * 1000;

    const timer = setInterval(() => {
      setElapsedMs((prev) => {
        if (prev + tickInterval >= totalSpanMs) {
          // Switch to next clip!
          transitionToNextClip();
          return 0;
        }
        return prev + tickInterval;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [isVideoPlaying, timeSpan, currentClipIdx, playlist, activeSlot]);

  // Transition to next video clip with crossfade
  const transitionToNextClip = (targetIdx?: number) => {
    const nextIdx =
      targetIdx !== undefined
        ? targetIdx
        : (currentClipIdx + 1) % playlist.length;

    const nextClip = playlist[nextIdx];
    if (!nextClip) return;

    if (activeSlot === "A") {
      // Transition to Slot B
      setSlotBSrc(nextClip.src);
      if (videoRefB.current) {
        videoRefB.current.currentTime = 0;
        videoRefB.current.play().catch(() => {});
      }
      setActiveSlot("B");
    } else {
      // Transition to Slot A
      setSlotASrc(nextClip.src);
      if (videoRefA.current) {
        videoRefA.current.currentTime = 0;
        videoRefA.current.play().catch(() => {});
      }
      setActiveSlot("A");
    }

    setCurrentClipIdx(nextIdx);
    setElapsedMs(0);
  };

  const jumpToPrevClip = () => {
    const prevIdx = (currentClipIdx - 1 + playlist.length) % playlist.length;
    transitionToNextClip(prevIdx);
  };

  const jumpToNextClip = () => {
    const nextIdx = (currentClipIdx + 1) % playlist.length;
    transitionToNextClip(nextIdx);
  };

  const toggleVideoPlayback = () => {
    if (isVideoPlaying) {
      if (videoRefA.current) videoRefA.current.pause();
      if (videoRefB.current) videoRefB.current.pause();
      setIsVideoPlaying(false);
    } else {
      if (activeSlot === "A" && videoRefA.current) videoRefA.current.play().catch(() => {});
      if (activeSlot === "B" && videoRefB.current) videoRefB.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  };

  // Keyboard runner / Ambient Procedural Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // Mechanical keyboard key grid simulation
    const rows = 12;
    const cols = 24;
    const keyWidth = 44;
    const keyHeight = 32;
    const gap = 8;
    const startX = width * 0.15;
    const startY = height * 0.42;

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      ctx.save();

      // Atmospheric dark background
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        100,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      grad.addColorStop(0, "rgba(22, 14, 10, 0.4)");
      grad.addColorStop(0.5, "rgba(10, 8, 8, 0.7)");
      grad.addColorStop(1, "rgba(5, 5, 5, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render glowing mechanical keyboard switches (red/orange backlight)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (keyWidth + gap) + (r % 2) * 12;
          const y = startY + r * (keyHeight + gap);

          // Simulated typing pulses
          const pulse = Math.sin(frame * 0.04 + c * 0.5 + r * 0.8);
          const isPressed = Math.sin(frame * 0.08 + c * 1.2 + r * 2.1) > 0.85;

          ctx.fillStyle = isPressed
            ? "rgba(255, 70, 20, 0.5)"
            : pulse > 0.3
            ? "rgba(220, 50, 10, 0.18)"
            : "rgba(20, 20, 20, 0.3)";

          ctx.strokeStyle = isPressed
            ? "rgba(255, 90, 40, 0.8)"
            : "rgba(50, 25, 20, 0.25)";
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.rect(x, y, keyWidth, keyHeight);
          ctx.fill();
          ctx.stroke();

          // Keycap LED indicator
          if (isPressed || pulse > 0.7) {
            ctx.fillStyle = isPressed ? "#FF5522" : "rgba(255, 80, 20, 0.4)";
            ctx.fillRect(x + keyWidth * 0.35, y + keyHeight * 0.4, 8, 4);
          }
        }
      }

      // Moving oscilloscope / data stream runner across the center
      ctx.beginPath();
      ctx.strokeStyle = "rgba(182, 255, 92, 0.18)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x += 10) {
        const y = height * 0.35 + Math.sin(x * 0.015 + frame * 0.05) * 18;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ESC key toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEffectsActive((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Web Audio Synth Bleep for Click & Hold
  const playTactileTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio not permitted or supported
    }
  };

  const navItems = [
    { label: "WORK", href: "/work" },
    { label: "SERVICES", href: "/services" },
    { label: "PRODUCTS", href: "/products" },
    { label: "INSIGHTS", href: "/insights" },
    { label: "ABOUT", href: "/about" },
    { label: "CAREERS", href: "/careers" },
    { label: "CONTACT", href: "/contact" },
  ];

  const projectList = [
    { title: "AXION COPILOT", category: "AI & RAG", year: "2026", href: "/products/axion-copilot-engine" },
    { title: "APEX LEDGER", category: "SOFTWARE", year: "2026", href: "/work/apex-financial-ledger" },
    { title: "SENTIO AGENT", category: "COGNITIVE AI", year: "2026", href: "/work/sentio-cognitive-platform" },
    { title: "VANGUARD GATEWAY", category: "CYBERSECURITY", year: "2026", href: "/work/vanguard-zero-trust-gateway" },
    { title: "SHIELDMATRIX VAPT", category: "DEVSECOPS", year: "2026", href: "/products/shieldmatrix-vapt" },
    { title: "HYPERION CLUSTER", category: "CLOUD INFRA", year: "2025", href: "/work/hyperion-cloud-orchestrator" },
    { title: "SYNAPSE DATAFLOW", category: "SYSTEMS", year: "2025", href: "/products/synapse-dataflow" },
    { title: "OMNIFLOW COMMERCE", category: "WEB & MOBILE", year: "2025", href: "/services/web-development" },
  ];

  const scrollToDossier = () => {
    const dossier = document.getElementById("full-dossier");
    if (dossier) {
      dossier.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentClip = playlist[currentClipIdx] || playlist[0];
  const progressPercent = Math.min(100, (elapsedMs / (timeSpan * 1000)) * 100);
  const remainingSec = Math.max(0, (timeSpan - elapsedMs / 1000)).toFixed(1);

  return (
    <div className="relative w-full min-h-screen bg-[#070707] text-[#F5F3EF] overflow-hidden select-none font-mono">
      {/* ========================================================= */}
      {/* BACKGROUND VIDEO & CANVAS RUNNER (STUDIO ATMOSPHERE)      */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Procedural Canvas Hardware Runner (Always running in 60fps) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Video Slot A (Seamless opacity crossfade) */}
        <video
          ref={videoRefA}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setSlotALoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10 ${
            activeSlot === "A" && slotALoaded ? "opacity-45" : "opacity-0"
          } ${effectsActive ? "filter invert contrast-150" : "filter contrast-125 brightness-80"}`}
        >
          <source src={slotASrc} type="video/mp4" />
        </video>

        {/* Video Slot B (Seamless opacity crossfade) */}
        <video
          ref={videoRefB}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setSlotBLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10 ${
            activeSlot === "B" && slotBLoaded ? "opacity-45" : "opacity-0"
          } ${effectsActive ? "filter invert contrast-150" : "filter contrast-125 brightness-80"}`}
        >
          <source src={slotBSrc} type="video/mp4" />
        </video>

        {/* Dark Vignette & Studio Grading Gradients */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#080808]/70 to-[#040404]/95 z-20" />

        {/* Scanlines Overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none opacity-25"
          style={{
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)",
            backgroundSize: "100% 4px",
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* TOP HEADER BAR                                             */}
      {/* ========================================================= */}
      <header className="relative z-30 w-full px-6 sm:px-10 py-5 flex items-center justify-between text-xs tracking-wider text-[#CCCCCC]">
        <div className="w-1/3 hidden lg:block" />

        <div className="text-center w-full lg:w-1/3">
          <span className="uppercase text-[11px] sm:text-xs text-[#E5E5E5] tracking-widest font-mono">
            {tagline}
          </span>
        </div>

        <div className="w-full lg:w-1/3 flex items-center justify-end gap-6 text-[11px] sm:text-xs text-[#AAAAAA] font-mono">
          <span className="hidden sm:inline-block uppercase tracking-wider text-[#888888]">
            INDIA, BENGALURU &amp; GLOBAL
          </span>
          <span className="text-[#F5F3EF] tracking-widest font-semibold">{timeStr}</span>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN SCREEN INTERACTIVE COMPOSITION                       */}
      {/* ========================================================= */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-8 pt-2 pb-16 min-h-[calc(100vh-140px)] flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* TOP-LEFT WHITE FLOATING DOSSIER CARD */}
          <div className="lg:col-span-5 space-y-3">
            <div className="w-full sm:max-w-md bg-[#FFFFFF] text-[#000000] border border-[#000000] p-6 sm:p-7 shadow-2xl transition-all">
              <div className="grid grid-cols-12 gap-2 pb-5 border-b border-[#000000]">
                <div className="col-span-6 space-y-1">
                  <h1 className="font-bold text-xs uppercase tracking-tight text-[#000000] leading-none">
                    {companyName}
                  </h1>
                  <p className="text-[10px] text-[#444444] uppercase tracking-wider">
                    IT &amp; COGNITIVE AI STUDIO
                  </p>
                </div>

                <div className="col-span-4 flex flex-col space-y-1 text-[11px] uppercase tracking-wider font-semibold">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="hover:text-[#B6FF5C] hover:bg-[#000000] px-1 transition-colors w-fit"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="col-span-2 text-right">
                  <button
                    onClick={scrollToDossier}
                    className="text-[10px] uppercase font-bold tracking-wider hover:underline"
                  >
                    EXPAND
                  </button>
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
                  <span className="text-[9px] uppercase tracking-wider text-[#666666] block">
                    COMMISSIONS &amp; BRIEFS
                  </span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-[10px] uppercase font-bold text-[#000000] hover:underline block truncate"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS & VIDEO CONTROLLER PILLS */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={scrollToDossier}
                className="px-3.5 py-1.5 bg-[#FFFFFF] text-[#000000] border border-[#000000] font-bold text-[11px] uppercase tracking-widest hover:bg-[#B6FF5C] transition-colors shadow-lg"
              >
                SELECTED WORK
              </button>

              {/* Video Play/Pause toggle pill */}
              <button
                onClick={toggleVideoPlayback}
                className="px-2.5 py-1.5 bg-[#141414]/90 backdrop-blur-md text-[#AAAAAA] hover:text-[#FFFFFF] border border-[#333333] font-mono text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
                title="Toggle background video playback"
              >
                {isVideoPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-[#B6FF5C]" />
                    <span>RUNNER ACTIVE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#FF5522]" />
                    <span>PAUSED</span>
                  </>
                )}
              </button>

              {/* Clip Prev/Next Selector */}
              <div className="inline-flex items-center bg-[#141414]/90 backdrop-blur-md border border-[#333333] text-[10px] font-mono">
                <button
                  onClick={jumpToPrevClip}
                  className="px-1.5 py-1.5 hover:text-[#B6FF5C] hover:bg-[#222] border-r border-[#333] transition-colors"
                  title="Previous video clip"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <span className="px-2 py-1 text-[#CCCCCC] font-bold tracking-wider">
                  CLIP {String(currentClipIdx + 1).padStart(2, "0")}/{String(playlist.length).padStart(2, "0")}
                </span>
                <button
                  onClick={jumpToNextClip}
                  className="px-1.5 py-1.5 hover:text-[#B6FF5C] hover:bg-[#222] border-l border-[#333] transition-colors"
                  title="Next video clip"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* MULTI-VIDEO TIME-SPAN SCRUBBER & SEQUENCER HUD */}
            <div className="w-full sm:max-w-md bg-[#101010]/90 backdrop-blur-md border border-[#2a2a2a] p-3 text-[10px] space-y-2">
              <div className="flex items-center justify-between text-[#888]">
                <div className="flex items-center gap-1.5 text-[#B6FF5C] font-semibold truncate">
                  <Film className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{currentClip.title}</span>
                </div>
                <div className="flex items-center gap-1 text-[#AAA] flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{remainingSec}s left</span>
                </div>
              </div>

              {/* Progress Bar Scrubber */}
              <div className="w-full bg-[#202020] h-1.5 overflow-hidden relative border border-[#333]">
                <div
                  className="bg-[#B6FF5C] h-full transition-all duration-100 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Time Span Duration Selectors & Direct Clip Jumps */}
              <div className="flex items-center justify-between pt-1 text-[9px] text-[#777]">
                <div className="flex items-center gap-1">
                  <span>SPAN:</span>
                  {[4, 6, 8, 12].map((s) => (
                    <button
                      key={s}
                      onClick={() => setTimeSpan(s)}
                      className={`px-1.5 py-0.5 border ${
                        timeSpan === s
                          ? "border-[#B6FF5C] text-[#B6FF5C] bg-[#B6FF5C]/10 font-bold"
                          : "border-[#333] text-[#888] hover:text-[#FFF]"
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  {playlist.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => transitionToNextClip(idx)}
                      className={`w-4 h-4 flex items-center justify-center border text-[8px] font-bold ${
                        currentClipIdx === idx
                          ? "border-[#FFFFFF] bg-[#FFFFFF] text-[#000000]"
                          : "border-[#333] text-[#777] hover:border-[#888] hover:text-[#CCC]"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER-RIGHT INTERACTIVE WORK INDEX TABLE */}
          <div className="lg:col-span-7 flex flex-col justify-center pt-8 lg:pt-16">
            <div className="w-full max-w-xl ml-auto space-y-1">
              {projectList.map((proj, idx) => {
                const isActive = activeProjectIndex === idx;
                return (
                  <Link
                    key={proj.title}
                    href={proj.href}
                    onMouseEnter={() => setActiveProjectIndex(idx)}
                    className={`block px-3 py-1.5 text-xs uppercase tracking-wider transition-all select-none ${
                      isActive
                        ? "bg-[#FFFFFF] text-[#000000] font-bold shadow-md transform -translate-x-1"
                        : "text-[#D1D5DB] hover:text-[#FFFFFF]"
                    }`}
                  >
                    <div className="grid grid-cols-12 items-center">
                      <div className="col-span-6 truncate font-semibold">
                        {proj.title}
                      </div>
                      <div
                        className={`col-span-4 text-[11px] uppercase truncate ${
                          isActive ? "text-[#333333]" : "text-[#777777]"
                        }`}
                      >
                        {proj.category}
                      </div>
                      <div
                        className={`col-span-2 text-right text-[11px] font-mono ${
                          isActive ? "text-[#000000]" : "text-[#555555]"
                        }`}
                      >
                        {proj.year}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA & CONTROL BAR */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wider text-[#888888] border-t border-white/10 font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEffectsActive(!effectsActive)}
              className="text-[#AAAAAA] hover:text-[#FFFFFF] uppercase tracking-wider text-[11px] transition-colors"
            >
              PRESS ESC FOR EFFECTS (?)
            </button>
            {effectsActive && (
              <span className="text-[10px] text-[#B6FF5C] bg-[#111] px-1.5 py-0.5 border border-[#B6FF5C]/40">
                ACTIVE
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#CCCCCC] uppercase tracking-widest">
            <a
              href="https://github.com/axion-technologies"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFFFFF] transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://linkedin.com/company/axion-technologies"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFFFFF] transition-colors"
            >
              LINKEDIN
            </a>
            <a
              href="https://x.com/axiontech_in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFFFFF] transition-colors"
            >
              X (TWITTER)
            </a>
            <Link
              href="/admin/login"
              className="text-[#666666] hover:text-[#B6FF5C] transition-colors"
            >
              ADMIN
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAudioActive(!audioActive);
                playTactileTone();
              }}
              className="group flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#CCCCCC] hover:text-[#FFFFFF] transition-colors"
            >
              <span>CLICK AND HOLD</span>
              <div
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                  audioActive
                    ? "bg-[#FFFFFF] text-[#000000] border-[#FFFFFF]"
                    : "border-[#444444] text-[#888888] group-hover:border-[#FFFFFF] group-hover:text-[#FFFFFF]"
                }`}
              >
                <span className="tracking-tighter font-bold text-[10px]">···</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
