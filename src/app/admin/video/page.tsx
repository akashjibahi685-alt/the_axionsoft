"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Video,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Save,
  RefreshCw,
  Clock,
  Sliders,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface VideoClip {
  title: string;
  src: string;
  duration: number; // in seconds
}

const DEFAULT_LOCAL_PRESETS: VideoClip[] = [
  { title: "HARDWARE // SWITCH LOGIC", src: "/videos/clip1-hardware.mp4", duration: 6 },
  { title: "NEURAL // TENSOR GRAPH", src: "/videos/clip2-neural.mp4", duration: 6 },
  { title: "MAINFRAME // CLOUD CLUSTER", src: "/videos/clip3-server.mp4", duration: 6 },
  { title: "DISTRIBUTED // PIPELINE", src: "/videos/clip4-code.mp4", duration: 6 },
  { title: "TELEMETRY // RUNTIME CORE", src: "/videos/hero.mp4", duration: 6 },
];

export default function AdminVideoPage() {
  const [playlist, setPlaylist] = useState<VideoClip[]>(DEFAULT_LOCAL_PRESETS);
  const [fallbackUrl, setFallbackUrl] = useState("/videos/hero.mp4");
  const [defaultSpan, setDefaultSpan] = useState(6);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Live Preview Simulator State
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [previewSlot, setPreviewSlot] = useState<"A" | "B">("A");
  const [slotASrc, setSlotASrc] = useState<string>(DEFAULT_LOCAL_PRESETS[0].src);
  const [slotBSrc, setSlotBSrc] = useState<string>(DEFAULT_LOCAL_PRESETS[1]?.src || DEFAULT_LOCAL_PRESETS[0].src);
  const [timeRemaining, setTimeRemaining] = useState(defaultSpan);

  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  // New Clip Modal / Inline Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [newClip, setNewClip] = useState<VideoClip>({
    title: "",
    src: "/videos/hero.mp4",
    duration: 6,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, string> = {};
        data.settings?.forEach((s: { key: string; value: string }) => {
          map[s.key] = s.value;
        });

        if (map.hero_playlist) {
          try {
            const parsed = JSON.parse(map.hero_playlist);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPlaylist(parsed);
              setSlotASrc(parsed[0].src);
              setSlotBSrc(parsed[1]?.src || parsed[0].src);
            }
          } catch (e) {
            console.error("Failed to parse hero_playlist:", e);
          }
        }

        if (map.hero_video_url) setFallbackUrl(map.hero_video_url);
        if (map.hero_clip_span) setDefaultSpan(parseInt(map.hero_clip_span, 10) || 6);
      }
    } catch (e) {
      console.error("Error loading video settings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Preview cycle timer
  useEffect(() => {
    if (!isPlaying || playlist.length <= 1) return;

    const currentClip = playlist[activeClipIndex];
    const duration = currentClip?.duration || defaultSpan;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Advance to next clip with crossfade
          const nextIndex = (activeClipIndex + 1) % playlist.length;
          const nextClip = playlist[nextIndex];

          if (previewSlot === "A") {
            setSlotBSrc(nextClip.src);
            setPreviewSlot("B");
            if (videoRefB.current) {
              videoRefB.current.currentTime = 0;
              videoRefB.current.play().catch(() => {});
            }
          } else {
            setSlotASrc(nextClip.src);
            setPreviewSlot("A");
            if (videoRefA.current) {
              videoRefA.current.currentTime = 0;
              videoRefA.current.play().catch(() => {});
            }
          }

          setActiveClipIndex(nextIndex);
          return nextClip.duration || defaultSpan;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, activeClipIndex, previewSlot, playlist, defaultSpan]);

  const handleNext = () => {
    if (playlist.length === 0) return;
    const nextIndex = (activeClipIndex + 1) % playlist.length;
    const nextClip = playlist[nextIndex];
    if (previewSlot === "A") {
      setSlotBSrc(nextClip.src);
      setPreviewSlot("B");
    } else {
      setSlotASrc(nextClip.src);
      setPreviewSlot("A");
    }
    setActiveClipIndex(nextIndex);
    setTimeRemaining(nextClip.duration || defaultSpan);
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prevIndex = (activeClipIndex - 1 + playlist.length) % playlist.length;
    const prevClip = playlist[prevIndex];
    if (previewSlot === "A") {
      setSlotBSrc(prevClip.src);
      setPreviewSlot("B");
    } else {
      setSlotASrc(prevClip.src);
      setPreviewSlot("A");
    }
    setActiveClipIndex(prevIndex);
    setTimeRemaining(prevClip.duration || defaultSpan);
  };

  // Playlist modifications
  const moveClip = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= playlist.length) return;
    const updated = [...playlist];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPlaylist(updated);
  };

  const removeClip = (index: number) => {
    if (playlist.length <= 1) {
      alert("At least one video clip must remain. Use 'Clear All Default Videos' to set your single custom video.");
      return;
    }
    const updated = playlist.filter((_, i) => i !== index);
    setPlaylist(updated);
    if (activeClipIndex >= updated.length) {
      setActiveClipIndex(0);
    }
    showToast("Clip removed. Click 'Save & Deploy to Home' to apply permanently.");
  };

  const updateClip = (index: number, field: keyof VideoClip, value: string | number) => {
    const updated = [...playlist];
    updated[index] = { ...updated[index], [field]: value };
    setPlaylist(updated);
  };

  const handleClearDefaults = () => {
    if (
      confirm(
        "Remove all 5 default sample videos and keep only a single custom video?\n\nThis will remove the default hardware, neural, server, and code clips."
      )
    ) {
      const singleCustom: VideoClip = {
        title: "CORE // ENTERPRISE VIDEO RUNNER",
        src: fallbackUrl || "/videos/hero.mp4",
        duration: defaultSpan,
      };
      setPlaylist([singleCustom]);
      setActiveClipIndex(0);
      setSlotASrc(singleCustom.src);
      setSlotBSrc(singleCustom.src);
      showToast("Default videos removed! Click 'Save & Deploy to Home' to make it permanent.");
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm("Restore the 5 factory default sample video clips?")) {
      setPlaylist(DEFAULT_LOCAL_PRESETS);
      setActiveClipIndex(0);
      setSlotASrc(DEFAULT_LOCAL_PRESETS[0].src);
      setSlotBSrc(DEFAULT_LOCAL_PRESETS[1]?.src || DEFAULT_LOCAL_PRESETS[0].src);
      showToast("Factory default clips restored. Click 'Save & Deploy to Home' to apply.");
    }
  };

  const handleAddClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClip.title.trim() || !newClip.src.trim()) {
      alert("Title and Video URL are required.");
      return;
    }

    const clipToAdd: VideoClip = {
      title: newClip.title.trim(),
      src: newClip.src.trim(),
      duration: Number(newClip.duration) || defaultSpan,
    };

    if (replaceExisting) {
      // Replace all existing default videos with ONLY this new video
      setPlaylist([clipToAdd]);
      setFallbackUrl(clipToAdd.src);
      setSlotASrc(clipToAdd.src);
      setSlotBSrc(clipToAdd.src);
      setActiveClipIndex(0);
      showToast("Default videos removed! Custom video set as the sole hero video.");
    } else {
      setPlaylist([...playlist, clipToAdd]);
      showToast("New video clip added to sequence.");
    }

    setNewClip({ title: "", src: "/videos/hero.mp4", duration: defaultSpan });
    setReplaceExisting(false);
    setShowAddModal(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const targetFallback = playlist[0]?.src || fallbackUrl;
      const payload = {
        settings: {
          hero_playlist: JSON.stringify(playlist, null, 2),
          hero_video_url: targetFallback,
          hero_clip_span: String(defaultSpan),
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("PERMANENTLY SAVED! Live landing page updated with your custom video(s).");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save video sequence");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  // Metrics
  const totalCycleTime = useMemo(() => {
    return playlist.reduce((acc, c) => acc + (Number(c.duration) || defaultSpan), 0);
  }, [playlist, defaultSpan]);

  const hasOnlyCustomVideos = useMemo(() => {
    return !playlist.some((p) =>
      ["clip1-hardware.mp4", "clip2-neural.mp4", "clip3-server.mp4", "clip4-code.mp4"].some((name) =>
        p.src.includes(name)
      )
    );
  }, [playlist]);

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-[#B6FF5C] text-[#F5F3EF] px-5 py-3.5 rounded shadow-2xl flex items-center gap-3 font-mono text-xs animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#B6FF5C] flex-shrink-0" />
          <span className="font-bold">{feedback}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            MAIN LANDING PAGE // BACKGROUND VIDEO SEQUENCER
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Hero Video Runner Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3 py-2 border border-[#333] bg-[#141414] text-[#A5A5A5] hover:text-[#F5F3EF] font-mono text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Home</span>
          </Link>
          <button
            onClick={loadSettings}
            title="Reload from database"
            className="p-2 border border-[#333] bg-[#141414] text-[#888] hover:text-[#F5F3EF]"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Permanently Save &amp; Apply</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {hasOnlyCustomVideos ? (
        <div className="p-3 bg-emerald-950/20 border border-emerald-800 text-emerald-300 font-mono text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CUSTOM VIDEO ACTIVE: All factory default video clips have been removed.</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">100% CUSTOM PLAYLIST</span>
        </div>
      ) : (
        <div className="p-3 bg-amber-950/20 border border-amber-800/80 text-amber-200 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Default sample clips are currently present. You can remove them to show only your custom video.</span>
          </span>
          <button
            onClick={handleClearDefaults}
            className="px-3 py-1 bg-amber-400 text-[#101010] font-bold text-[11px] uppercase hover:bg-amber-300 transition-colors w-fit"
          >
            Remove All Defaults Now
          </button>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Clips In Sequence</span>
          <div className="text-2xl font-bold font-mono text-[#B6FF5C] mt-1">{playlist.length}</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Total Loop Duration</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{totalCycleTime}s cycle</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Default Clip Span</span>
          <div className="text-2xl font-bold font-mono text-[#F5F3EF] mt-1">{defaultSpan}s</div>
        </div>
        <div className="border border-[#262626] bg-[#141414] p-4">
          <span className="text-[10px] font-mono text-[#888] uppercase block">Database Storage</span>
          <div className="text-xs font-bold font-mono text-emerald-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PERMANENT (SQLITE)
          </div>
        </div>
      </div>

      {/* Main Grid: Live Simulator + Playlist Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Dual-Slot Video Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-[#262626] bg-[#141414] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#888] uppercase block">// Live Preview</span>
                <h3 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase">
                  Landing Page Video Simulation
                </h3>
              </div>
              <Badge variant="accent">
                SLOT {previewSlot} ACTIVE
              </Badge>
            </div>

            {/* Video Viewport with Darkening / Grain Filter simulation */}
            <div className="relative aspect-video w-full bg-[#0a0a0a] border border-[#333] overflow-hidden rounded">
              {/* Slot A */}
              <video
                ref={videoRefA}
                src={slotASrc}
                muted
                playsInline
                autoPlay
                loop
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  previewSlot === "A" ? "opacity-90" : "opacity-0"
                }`}
              />

              {/* Slot B */}
              <video
                ref={videoRefB}
                src={slotBSrc}
                muted
                playsInline
                autoPlay
                loop
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  previewSlot === "B" ? "opacity-90" : "opacity-0"
                }`}
              />

              {/* Editorial HUD Overlay Simulator */}
              <div className="absolute inset-0 bg-black/40 pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between items-start">
                  <div className="bg-black/80 px-2 py-1 font-mono text-[9px] text-[#B6FF5C] border border-[#333]">
                    CLIP {activeClipIndex + 1}/{playlist.length}
                  </div>
                  <div className="bg-black/80 px-2 py-1 font-mono text-[9px] text-[#CCC] border border-[#333]">
                    {playlist.length > 1 ? `${timeRemaining}s HOLD` : "LOOPING"}
                  </div>
                </div>

                <div className="bg-black/80 p-2 border border-[#222]">
                  <div className="font-mono text-[10px] font-bold text-[#F5F3EF] truncate">
                    {playlist[activeClipIndex]?.title || "UNKNOWN CLIP"}
                  </div>
                  <div className="font-mono text-[8px] text-[#888] truncate">
                    {playlist[activeClipIndex]?.src}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#222]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 border border-[#333] bg-[#181818] text-[#CCC] hover:text-[#B6FF5C]"
                  title="Previous Clip"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 border border-[#333] bg-[#181818] text-[#B6FF5C] hover:bg-[#222]"
                  title={isPlaying ? "Pause Simulator" : "Play Simulator"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 border border-[#333] bg-[#181818] text-[#CCC] hover:text-[#B6FF5C]"
                  title="Next Clip"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="font-mono text-[10px] text-[#888]">
                {playlist.length > 1 ? `Clip duration: ${playlist[activeClipIndex]?.duration || defaultSpan}s` : "Continuous single-video loop"}
              </div>
            </div>
          </div>

          {/* Global Sequencer Settings */}
          <div className="border border-[#262626] bg-[#141414] p-5 space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase border-b border-[#222] pb-2 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#B6FF5C]" />
              <span>Sequencer Configuration</span>
            </h3>

            <div>
              <label className="block text-[10px] font-mono text-[#888] uppercase mb-1">
                Default Time Span Per Clip (Seconds)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={defaultSpan}
                  onChange={(e) => setDefaultSpan(Number(e.target.value))}
                  className="flex-1 accent-[#B6FF5C]"
                />
                <span className="font-mono text-xs text-[#B6FF5C] font-bold w-8 text-right">
                  {defaultSpan}s
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#888] uppercase mb-1">
                Primary Fallback Video URL (MP4 / WebM)
              </label>
              <input
                type="text"
                value={fallbackUrl}
                onChange={(e) => setFallbackUrl(e.target.value)}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-xs px-3 py-2 font-mono outline-none focus:border-[#B6FF5C]"
              />
              <span className="text-[9px] text-[#666] font-mono block mt-1">
                Played if playlist cannot be resolved on older mobile clients.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Video Playlist Roster & Add New Video */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-[#262626] bg-[#141414] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222] pb-3 gap-3">
              <div>
                <span className="text-[10px] font-mono text-[#B6FF5C] uppercase block">
                  // PLAYLIST MANAGEMENT
                </span>
                <h3 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase">
                  Active Video Sequence Clips ({playlist.length})
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleClearDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-800/80 bg-red-950/20 text-red-300 font-mono text-[11px] hover:bg-red-900/30 transition-colors"
                  title="Remove all default sample clips"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                  <span>Remove Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#333] bg-[#181818] text-[#888] hover:text-[#CCC] font-mono text-[11px]"
                  title="Restore 5 factory default clips"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Defaults</span>
                </button>

                <button
                  onClick={() => {
                    setNewClip({ title: "", src: "", duration: defaultSpan });
                    setReplaceExisting(false);
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#B6FF5C] text-[#101010] font-mono text-[11px] font-bold uppercase hover:bg-[#a3f044]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>
              </div>
            </div>

            {/* Video Cards List */}
            <div className="space-y-3">
              {playlist.map((clip, idx) => {
                const isActive = idx === activeClipIndex;
                return (
                  <div
                    key={idx}
                    className={`p-4 border transition-colors ${
                      isActive
                        ? "border-[#B6FF5C] bg-[#191919]"
                        : "border-[#262626] bg-[#161616] hover:border-[#383838]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="w-6 h-6 bg-[#222] text-[#B6FF5C] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>

                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={clip.title}
                            onChange={(e) => updateClip(idx, "title", e.target.value)}
                            className="w-full bg-[#1F1F1F] border border-[#333] text-[#F5F3EF] px-2.5 py-1 text-xs font-mono font-bold focus:border-[#B6FF5C] outline-none"
                            placeholder="Clip Title..."
                          />

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={clip.src}
                              onChange={(e) => updateClip(idx, "src", e.target.value)}
                              className="flex-1 bg-[#1A1A1A] border border-[#2B2B2B] text-[#888] px-2 py-0.5 text-[10px] font-mono outline-none focus:text-[#CCC]"
                              placeholder="/videos/... or https://..."
                            />
                            <a
                              href={clip.src}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#666] hover:text-[#B6FF5C]"
                              title="Test direct video URL in new tab"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#222]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#666]" />
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={clip.duration}
                            onChange={(e) => updateClip(idx, "duration", Number(e.target.value))}
                            className="w-12 bg-[#1A1A1A] border border-[#333] text-[#B6FF5C] text-xs font-mono px-1 py-0.5 text-center"
                          />
                          <span className="text-[10px] font-mono text-[#888]">s</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveClip(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 border border-[#333] text-[#888] hover:text-[#F5F3EF] disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveClip(idx, "down")}
                            disabled={idx === playlist.length - 1}
                            className="p-1 border border-[#333] text-[#888] hover:text-[#F5F3EF] disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          {playlist.length > 1 && (
                            <button
                              onClick={() => removeClip(idx)}
                              className="p-1 border border-red-900/40 text-red-400 hover:bg-red-900/20"
                              title="Remove Clip"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Button Prominent */}
            <div className="pt-4 border-t border-[#222] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#777]">
                * Click save to update SQLite database and edge cache immediately.
              </span>
              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Permanently Save Video Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full border border-[#333] bg-[#141414] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="font-mono text-sm font-bold uppercase text-[#F5F3EF] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#B6FF5C]" />
                <span>Add Landing Page Video Clip</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-[#888] hover:text-[#fff]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClip} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">
                  Clip Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AUTONOMOUS // AGENT RUNTIME"
                  value={newClip.title}
                  onChange={(e) => setNewClip({ ...newClip, title: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none focus:border-[#B6FF5C]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">
                  Video URL or Path (MP4 / WebM) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/videos/clip1-hardware.mp4 or https://..."
                  value={newClip.src}
                  onChange={(e) => setNewClip({ ...newClip, src: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none focus:border-[#B6FF5C]"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">
                  Display Duration Before Next Crossfade (Seconds)
                </label>
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={newClip.duration}
                  onChange={(e) => setNewClip({ ...newClip, duration: Number(e.target.value) })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2.5 outline-none"
                />
              </div>

              {/* Checkbox to remove default videos */}
              <label className="flex items-start gap-3 p-3 bg-[#1A1A1A] border border-[#333] cursor-pointer hover:border-[#B6FF5C]">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#B6FF5C]"
                />
                <div className="space-y-0.5">
                  <span className="font-bold text-[#B6FF5C] block">
                    Remove All Default Videos (Make Sole Hero Video)
                  </span>
                  <span className="text-[10px] text-[#888] block">
                    Check this to permanently discard the 5 default sample clips and keep ONLY this video on the landing page.
                  </span>
                </div>
              </label>

              <div className="pt-3 border-t border-[#222] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#333] text-[#888] hover:text-[#CCC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B6FF5C] text-[#101010] font-bold uppercase hover:bg-[#a3f044]"
                >
                  {replaceExisting ? "Set as Sole Video" : "Add To Sequence"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
