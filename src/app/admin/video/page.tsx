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
  Sparkles,
  Layers,
  Sliders,
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
    setTimeout(() => setFeedback(null), 3500);
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
      alert("At least one video clip must remain in the sequence.");
      return;
    }
    const updated = playlist.filter((_, i) => i !== index);
    setPlaylist(updated);
    if (activeClipIndex >= updated.length) {
      setActiveClipIndex(0);
    }
  };

  const updateClip = (index: number, field: keyof VideoClip, value: string | number) => {
    const updated = [...playlist];
    updated[index] = { ...updated[index], [field]: value };
    setPlaylist(updated);
  };

  const handleAddClip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClip.title.trim() || !newClip.src.trim()) {
      alert("Title and Video URL are required.");
      return;
    }
    setPlaylist([...playlist, { ...newClip, duration: Number(newClip.duration) || defaultSpan }]);
    setNewClip({ title: "", src: "/videos/hero.mp4", duration: defaultSpan });
    setShowAddModal(false);
    showToast("New video clip added to sequence");
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        settings: {
          hero_playlist: JSON.stringify(playlist, null, 2),
          hero_video_url: fallbackUrl,
          hero_clip_span: String(defaultSpan),
        },
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("Video sequence saved & applied to live landing page!");
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

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
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
            <span>Save &amp; Deploy to Home</span>
          </button>
        </div>
      </div>

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
          <span className="text-[10px] font-mono text-[#888] uppercase block">Sequencer Status</span>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SYNCHRONIZED
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
                  Artemii Lebedev Video Matrix
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
                    {timeRemaining}s HOLD
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
                Cycle hold: {playlist[activeClipIndex]?.duration || defaultSpan}s
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
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#B6FF5C] uppercase block">
                  // PLAYLIST MANAGEMENT
                </span>
                <h3 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase">
                  Active Video Sequence Clips ({playlist.length})
                </h3>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase hover:bg-[#a3f044]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Video Clip</span>
              </button>
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
                          <button
                            onClick={() => removeClip(idx)}
                            className="p-1 border border-red-900/40 text-red-400 hover:bg-red-900/20"
                            title="Remove Clip"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets Picker */}
            <div className="pt-4 border-t border-[#222] space-y-2">
              <span className="text-[10px] font-mono text-[#888] uppercase block">
                Quick Local System Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_LOCAL_PRESETS.map((preset) => (
                  <button
                    key={preset.src}
                    type="button"
                    onClick={() => {
                      if (!playlist.some((p) => p.src === preset.src)) {
                        setPlaylist([...playlist, preset]);
                        showToast(`Added ${preset.title} to sequence`);
                      } else {
                        showToast(`Clip ${preset.title} already in sequence`);
                      }
                    }}
                    className="px-2.5 py-1 border border-[#333] bg-[#181818] font-mono text-[10px] text-[#AAA] hover:text-[#B6FF5C] hover:border-[#B6FF5C]"
                  >
                    + {preset.title}
                  </button>
                ))}
              </div>
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
                  Add To Sequence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
