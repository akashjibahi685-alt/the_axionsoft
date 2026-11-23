"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface GalleryCardItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
  accentColor: string;
  terminalSnippet?: {
    code1: string;
    code2: string;
    code3: string;
  };
  visualType: "sphere" | "code" | "shield" | "network" | "ledger";
}

const ORBIT_CARDS: GalleryCardItem[] = [
  {
    id: "card-1",
    title: "Building Next Era",
    subtitle: "Autonomous Agent Core // 300+ Node Cluster",
    category: "COGNITIVE AI",
    href: "/work/sentio-cognitive-platform",
    accentColor: "#B6FF5C",
    visualType: "sphere",
    terminalSnippet: {
      code1: "agentGraph.dispatch({ state: 'EXECUTE', conf: 0.998 });",
      code2: "const ranker = new ReciprocalRankFusion({ k: 60 });",
      code3: "status: HALLUCINATION_FREE_STREAM",
    },
  },
  {
    id: "card-2",
    title: "Apex Autonomous Ledger",
    subtitle: "Deterministic State Machine // Zero Latency",
    category: "FINTECH & CLOUD",
    href: "/work/apex-financial-ledger",
    accentColor: "#38BDF8",
    visualType: "ledger",
    terminalSnippet: {
      code1: "type Transaction = { id: UUID; debit: Account; credit: Account };",
      code2: "const proof = audit.GenerateMerkleProof(committedChunk);",
      code3: "latency: 0.42ms // consensus: RAFT_LEADER",
    },
  },
  {
    id: "card-3",
    title: "Axion Copilot Engine",
    subtitle: "Enterprise RAG & Hybrid Vector Retrieval",
    category: "AI PRODUCT",
    href: "/products/axion-copilot-engine",
    accentColor: "#A855F7",
    visualType: "network",
    terminalSnippet: {
      code1: "const embeddings = await model.embedBatch(documents);",
      code2: "vectorIndex.hybridSearch({ q: query, alpha: 0.7 });",
      code3: "context: 128k_TOKENS_EXPANDED",
    },
  },
  {
    id: "card-4",
    title: "Vanguard Zero-Trust Proxy",
    subtitle: "eBPF Kernel Threat Interceptor & MTLS Gateway",
    category: "CYBERSECURITY",
    href: "/work/vanguard-zero-trust-gateway",
    accentColor: "#F43F5E",
    visualType: "shield",
    terminalSnippet: {
      code1: "secPolicy.enforceMTLS({ zeroTrust: true, level: 3 });",
      code2: "ebpfFilter.inspectPacketStream({ rateLimit: 50000 });",
      code3: "threatScore: 0.0000 // MITM_BLOCKED",
    },
  },
  {
    id: "card-5",
    title: "Hyperion Cloud Orchestrator",
    subtitle: "Multi-Region Distributed Kubernetes Topology",
    category: "CLOUD INFRA",
    href: "/work/hyperion-cloud-orchestrator",
    accentColor: "#F59E0B",
    visualType: "code",
    terminalSnippet: {
      code1: "cluster.autoScale({ minReplicas: 12, maxReplicas: 96 });",
      code2: "canary.cutover({ trafficPercentage: 100, errRate: 0.00 });",
      code3: "health: GREEN // SLA_100_PERCENT",
    },
  },
];

const PARTNER_BADGES = [
  { name: "SCOLIOREHAB", code: "SR // CLINICAL" },
  { name: "ORTHOLIFE", code: "OL // BIOMECH" },
  { name: "SPINE CLINIC", code: "SC // HOLISTIC" },
  { name: "THE SCHROTH PROGRAM", code: "SBP // PROTOCOL" },
  { name: "CAPRON", code: "CP // INDUSTRIAL" },
  { name: "AXION SYSTEMS", code: "AX // LABS" },
];

export function WebInMotionGallery() {
  const [angle, setAngle] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const angleRef = useRef(0);
  const isPausedRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  // Synchronize pause state ref with hovered card state
  useEffect(() => {
    isPausedRef.current = hoveredCardId !== null;
  }, [hoveredCardId]);

  // Smooth circular motion engine at 60fps
  useEffect(() => {
    const orbitSpeed = 0.0035; // speed of circular motion (radians per frame)

    const loop = () => {
      if (!isPausedRef.current) {
        angleRef.current = (angleRef.current + orbitSpeed) % (2 * Math.PI);
        setAngle(angleRef.current);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Responsive circular radius:
  // Rx = horizontal orbit stretch, Ry = vertical orbit stretch
  const radiusX = 390;
  const radiusY = 170;
  const cardCount = ORBIT_CARDS.length;

  return (
    <section className="relative w-full min-h-[820px] bg-[#050505] text-[#F5F3EF] overflow-hidden py-16 border-b border-[#222] select-none flex flex-col justify-between font-mono">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_48%,rgba(28,28,28,0.75)_0%,rgba(5,5,5,0.98)_70%)]" />

      {/* Subtle Orbital Orbit Guide Path Rings */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-white/[0.04]"
        style={{
          width: `${radiusX * 2}px`,
          height: `${radiusY * 2.2}px`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full border border-white/[0.02]"
        style={{
          width: `${radiusX * 2.3}px`,
          height: `${radiusY * 2.5}px`,
        }}
      />

      {/* TOP: Floating Capsule Navigation Pill & Partner Ticker */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Floating Capsule Bar (Referencing Image: 'G' Monogram + 'BE VISIBLE' + Menu) */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-5 px-6 py-2.5 bg-[#141414]/90 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl shadow-2xl text-xs">
            <div className="w-5 h-5 bg-[#FFFFFF] text-[#000000] font-black rounded flex items-center justify-center text-[11px]">
              G
            </div>
            <span className="uppercase tracking-widest text-[#CCCCCC] text-[11px] font-semibold">
              BE VISIBLE
            </span>
            <div className="w-4 h-4 flex flex-col justify-between py-0.5 text-[#888]">
              <span className="w-full h-0.5 bg-current" />
              <span className="w-full h-0.5 bg-current" />
            </div>
          </div>
        </div>

        {/* Brand / Partner Ticker Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-[#666] text-[11px] uppercase tracking-wider">
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

      {/* CENTER: 3D Continuous Circular Orbit Canvas */}
      <div
        className="relative z-20 w-full max-w-6xl mx-auto my-auto h-[500px] flex items-center justify-center"
        style={{ perspective: "1300px" }}
      >
        {/* Center Editorial Typography Headline */}
        <div className="absolute text-center z-0 pointer-events-none space-y-2">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFFFF] font-sans">
            Web, in motion
          </h2>
          <div className="text-xs sm:text-sm text-[#888888] tracking-widest uppercase">
            2026 // GALLERY
          </div>
          {hoveredCardId && (
            <div className="inline-block mt-2 px-3 py-1 bg-[#161616] border border-[#B6FF5C]/40 text-[#B6FF5C] text-[10px] tracking-widest uppercase animate-pulse">
              MOTION PAUSED // CARD MINIMISED
            </div>
          )}
        </div>

        {/* Orbiting Cards Moving Continuously in Circle */}
        {ORBIT_CARDS.map((card, i) => {
          // Circular angle for each card
          const cardAngle = angle + (i * 2 * Math.PI) / cardCount;

          // 3D Circular coordinates
          const x = Math.cos(cardAngle) * radiusX;
          const y = Math.sin(cardAngle) * radiusY;
          // Z depth: front cards are higher (z > 0), back cards are lower (z < 0)
          const z = Math.sin(cardAngle) * 120;

          const isHovered = hoveredCardId === card.id;

          // Natural rotation along the orbital tangent
          const tangentRotate = Math.sin(cardAngle) * 14;

          // DEPTH CALCULATIONS:
          // Normal card scale based on orbit depth
          const depthScale = 0.88 + ((z + 120) / 240) * 0.22; // 0.88 to 1.10
          // When hovered: IMMEDIATELY STOP MOTION AND MINIMISE CARD SIZE (as requested: "stop minimise card size")
          const finalScale = isHovered ? 0.78 : depthScale;

          // Opacity & zIndex based on 3D depth
          const opacity = isHovered ? 1 : 0.65 + ((z + 120) / 240) * 0.35;
          const zIndex = isHovered ? 100 : Math.round(z + 200);

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCardId(card.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              className="absolute cursor-pointer select-none transition-all duration-300 ease-out"
              style={{
                transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${tangentRotate}deg) scale(${finalScale})`,
                zIndex,
                opacity,
              }}
            >
              <Link href={card.href} className="block group">
                <div
                  className={`w-[290px] sm:w-[330px] rounded-2xl overflow-hidden bg-[#111111]/95 backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
                    isHovered
                      ? "border-[#B6FF5C] ring-2 ring-[#B6FF5C]/30 shadow-[0_0_50px_rgba(182,255,92,0.25)]"
                      : "border-[#282828] hover:border-[#444]"
                  }`}
                >
                  {/* Card Visual Header Mockup */}
                  <div className="relative aspect-[16/10] w-full bg-[#161616] overflow-hidden p-4 flex flex-col justify-between border-b border-[#242424]">
                    {/* Top Tag & Glow Orb */}
                    <div className="flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 bg-[#000000]/80 backdrop-blur-md text-[9px] font-mono text-[#F5F3EF] border border-[#333] uppercase tracking-wider rounded">
                        {card.category}
                      </span>
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: card.accentColor }}
                      />
                    </div>

                    {/* Rich Vector / Terminal UI Graphics inside card (Clean, no broken image) */}
                    <div className="relative z-10 my-auto space-y-1.5 py-2 font-mono">
                      <div className="text-[10px] text-[#A5A5A5] font-bold uppercase truncate">
                        {card.title}
                      </div>
                      {card.terminalSnippet && (
                        <div className="p-2.5 bg-[#090909]/90 border border-[#222] rounded text-[9px] space-y-1">
                          <div className="text-[#888] truncate">{card.terminalSnippet.code1}</div>
                          <div
                            className="truncate font-semibold"
                            style={{ color: card.accentColor }}
                          >
                            {card.terminalSnippet.code2}
                          </div>
                          <div className="text-[#555] text-[8px] truncate">
                            {card.terminalSnippet.code3}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Icon */}
                    <div className="flex items-center justify-between z-10 pt-1 text-[9px] text-[#777]">
                      <span>{isHovered ? "CLICK TO EXPLORE" : "ACTIVE NODE"}</span>
                      <div className="w-6 h-6 rounded-full bg-[#000000]/90 border border-[#333] flex items-center justify-center group-hover:border-[#B6FF5C] group-hover:text-[#B6FF5C] text-[#FFF] transition-colors">
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Ambient Visual Radial Flare */}
                    <div
                      className="absolute -right-8 -top-8 w-36 h-36 rounded-full blur-2xl opacity-20 pointer-events-none"
                      style={{ backgroundColor: card.accentColor }}
                    />
                  </div>

                  {/* Card Footer Bar */}
                  <div className="p-3.5 bg-[#0F0F0F] flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <h3 className="font-bold text-xs uppercase text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors tracking-tight truncate">
                        {card.title}
                      </h3>
                      <p className="text-[9px] text-[#777] truncate">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* BOTTOM: Motion Telemetry & Interaction Instruction Bar */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 text-center text-[10px] text-[#666] uppercase tracking-widest flex items-center justify-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#B6FF5C] animate-ping" />
        <span>
          CIRCULAR CONTINUOUS ORBIT ENGINE // HOVER OVER CARD TO STOP MOTION &amp; MINIMISE SIZE
        </span>
      </div>
    </section>
  );
}
