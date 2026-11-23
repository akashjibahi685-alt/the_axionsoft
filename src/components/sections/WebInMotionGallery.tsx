"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Layers } from "lucide-react";

interface FloatingProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
  image: string;
  initialX: number; // percentage offset
  initialY: number; // percentage offset
  initialRotate: number; // deg
  accentColor: string;
}

const GALLERY_CARDS: FloatingProject[] = [
  {
    id: "card-1",
    title: "Building Next Era",
    subtitle: "Autonomous Agent Core // 300+ Node Cluster",
    category: "COGNITIVE AI",
    href: "/work/sentio-cognitive-platform",
    image: "/images/projects/ai-orchestrator.svg",
    initialX: -26,
    initialY: 4,
    initialRotate: -14,
    accentColor: "#B6FF5C",
  },
  {
    id: "card-2",
    title: "Apex High-Frequency Ledger",
    subtitle: "Deterministic State Machine // Zero Latency",
    category: "FINTECH & CLOUD",
    href: "/work/apex-financial-ledger",
    image: "/images/projects/ledger.svg",
    initialX: 4,
    initialY: -22,
    initialRotate: 6,
    accentColor: "#38BDF8",
  },
  {
    id: "card-3",
    title: "Axion Copilot Engine",
    subtitle: "Enterprise RAG & Hybrid Vector Retrieval",
    category: "AI PRODUCT",
    href: "/products/axion-copilot-engine",
    image: "/images/products/copilot.svg",
    initialX: 24,
    initialY: 28,
    initialRotate: 12,
    accentColor: "#F43F5E",
  },
];

const PARTNER_BADGES = [
  { name: "ScolioRehab", code: "SR // CLINICAL" },
  { name: "ORTHOLIFE", code: "OL // BIOMECH" },
  { name: "SPINE CLINIC", code: "SC // HOLISTIC" },
  { name: "The Schroth Program", code: "SBP // PROTOCOL" },
  { name: "capron", code: "CP // INDUSTRIAL" },
  { name: "Axion Systems", code: "AX // LABS" },
];

export function WebInMotionGallery() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Smooth mouse tilt parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[780px] bg-[#050505] text-[#F5F3EF] overflow-hidden py-20 border-b border-[#222] select-none flex flex-col justify-between"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(25,25,25,0.8)_0%,rgba(5,5,5,0.98)_70%)]" />

      {/* TOP: Floating Pill Navigation & Partner Ticker */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Floating Capsule Bar (Referencing Top Center Pill) */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-6 px-6 py-2.5 bg-[#141414]/90 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl shadow-2xl font-mono text-xs">
            <div className="w-5 h-5 bg-[#FFFFFF] text-[#000000] font-black rounded flex items-center justify-center text-[11px]">
              G
            </div>
            <span className="uppercase tracking-widest text-[#CCCCCC] text-[11px] font-semibold">
              BE VISIBLE
            </span>
            <div className="w-4 h-4 flex flex-col justify-between py-0.5 cursor-pointer text-[#888] hover:text-[#FFF]">
              <span className="w-full h-0.5 bg-current" />
              <span className="w-full h-0.5 bg-current" />
            </div>
          </div>
        </div>

        {/* Brand / Partner Ticker Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 pt-2 text-[#777] font-mono text-xs uppercase tracking-wider">
          {PARTNER_BADGES.map((b) => (
            <div
              key={b.name}
              className="flex items-center gap-2 hover:text-[#B6FF5C] transition-colors cursor-pointer group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#333] group-hover:bg-[#B6FF5C] transition-colors" />
              <span className="font-semibold">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER: 3D Floating Interactive Perspective Canvas */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto my-auto h-[480px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {/* Center Editorial Typography Headline */}
        <div className="absolute text-center z-0 pointer-events-none space-y-2">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFFFF] font-sans">
            Web, in motion
          </h2>
          <div className="font-mono text-xs sm:text-sm text-[#888888] tracking-widest uppercase">
            2026 // GALLERY
          </div>
        </div>

        {/* Floating Cards with 3D Parallax */}
        {GALLERY_CARDS.map((card) => {
          const isHovered = hoveredCard === card.id;

          // Parallax calculation
          const offsetX = card.initialX + mousePos.x * 24;
          const offsetY = card.initialY + mousePos.y * 24;
          const rotateZ = card.initialRotate + mousePos.x * 12;
          const rotateX = -mousePos.y * 18;
          const rotateY = mousePos.x * 18;
          const translateZ = isHovered ? 80 : 0;
          const scale = isHovered ? 1.08 : 1.0;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="absolute transition-transform duration-300 ease-out cursor-pointer"
              style={{
                transform: `translate3d(${offsetX * 12}px, ${offsetY * 6}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                zIndex: isHovered ? 30 : 10,
              }}
            >
              <Link href={card.href} className="block group">
                <div
                  className={`w-[260px] sm:w-[320px] rounded-xl overflow-hidden bg-[#121212] border transition-all duration-300 shadow-2xl ${
                    isHovered
                      ? "border-[#B6FF5C] shadow-[0_20px_60px_rgba(182,255,92,0.15)] ring-1 ring-[#B6FF5C]"
                      : "border-[#262626] hover:border-[#444]"
                  }`}
                >
                  {/* Card Mockup Visual Container */}
                  <div className="relative aspect-[16/10] w-full bg-[#181818] overflow-hidden border-b border-[#242424]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay for Sleek Look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 bg-[#000000]/80 backdrop-blur-md text-[9px] font-mono text-[#F5F3EF] border border-[#333] uppercase tracking-wider rounded">
                        {card.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 z-10 w-7 h-7 rounded-full bg-[#000000]/80 border border-[#444] flex items-center justify-center group-hover:border-[#B6FF5C] group-hover:text-[#B6FF5C] text-[#FFF] transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Card Body & Information */}
                  <div className="p-4 bg-[#121212] space-y-1">
                    <h3 className="font-bold text-sm uppercase text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors tracking-tight truncate">
                      {card.title}
                    </h3>
                    <p className="font-mono text-[10px] text-[#777] truncate">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* BOTTOM: Minimal Status Footer */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 text-center font-mono text-[11px] text-[#666] uppercase tracking-widest">
        <span>INTERACTIVE 3D PERSPECTIVE // MOVE CURSOR TO DRIFT CARDS</span>
      </div>
    </section>
  );
}
