"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

const SYSTEM_ASSETS = [
  { name: "Apex Autonomous Ledger", path: "/images/projects/ledger.svg", category: "Projects" },
  { name: "Sentio Agent Platform", path: "/images/projects/ai-orchestrator.svg", category: "Projects" },
  { name: "Vanguard Zero-Trust Proxy", path: "/images/projects/security-gateway.svg", category: "Projects" },
  { name: "Hyperion Cloud Orchestrator", path: "/images/projects/cloud-control.svg", category: "Projects" },
  { name: "Axion Copilot Engine", path: "/images/products/copilot.svg", category: "Products" },
  { name: "ShieldMatrix VAPT Scanner", path: "/images/products/shield.svg", category: "Products" },
  { name: "Synapse Dataflow Core", path: "/images/products/dataflow.svg", category: "Products" },
  { name: "Deterministic RAG Cover", path: "/images/blog/rag.svg", category: "Insights" },
  { name: "Zero-Trust Architecture Cover", path: "/images/blog/zero-trust.svg", category: "Insights" },
  { name: "Next.js Micro-Frontends Cover", path: "/images/blog/micro-frontend.svg", category: "Insights" },
  { name: "Axion Monogram Mark", path: "/images/logo/axion-mark.svg", category: "Brand" },
];

export default function AdminMediaPage() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            STATIC ASSETS &amp; SCHEMATICS // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Media Assets Directory
          </h1>
        </div>
        <div className="font-mono text-xs text-[#888]">
          {SYSTEM_ASSETS.length} SYSTEM ASSETS INDEXED
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SYSTEM_ASSETS.map((asset) => {
          const isCopied = copiedPath === asset.path;
          return (
            <div
              key={asset.path}
              className="border border-[#262626] bg-[#141414] overflow-hidden space-y-3 p-4 flex flex-col justify-between hover:border-[#383838] transition-colors"
            >
              <div className="space-y-2">
                <div className="relative aspect-video w-full bg-[#181818] border border-[#262626] overflow-hidden">
                  <Image src={asset.path} alt={asset.name} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-[#888]">
                  <span>{asset.category}</span>
                  <span>SVG VECTOR</span>
                </div>
                <h3 className="font-bold text-xs uppercase text-[#F5F3EF] truncate">
                  {asset.name}
                </h3>
              </div>

              <div className="pt-2 border-t border-[#222] flex items-center justify-between">
                <code className="text-[10px] font-mono text-[#777] truncate max-w-[180px]">
                  {asset.path}
                </code>
                <button
                  onClick={() => copyPath(asset.path)}
                  className="px-2 py-1 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] text-[#CCC] font-mono text-[10px] uppercase inline-flex items-center gap-1"
                >
                  {isCopied ? <Check className="w-3 h-3 text-[#B6FF5C]" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? "Copied" : "Copy Path"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
