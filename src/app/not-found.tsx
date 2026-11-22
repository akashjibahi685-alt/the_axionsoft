import React from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#101010] text-[#F5F3EF] flex flex-col items-center justify-center p-6 bg-grid-pattern">
      <div className="max-w-xl w-full border border-[#2E2E2E] bg-[#141414] p-8 sm:p-12 text-center space-y-6">
        <div className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest">
          ERROR 404 // RESOURCE_NOT_FOUND
        </div>

        <h1 className="text-6xl sm:text-7xl font-black text-[#F5F3EF] tracking-tighter">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold uppercase text-[#F5F3EF]">
            Signal Lost in Transmission
          </h2>
          <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
            The requested technical route or asset does not exist on this cluster, or was relocated during an infrastructure migration.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Mission Control</span>
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1B1B1B] border border-[#333] hover:border-[#B6FF5C] text-[#F5F3EF] font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Services</span>
          </Link>
        </div>

        <div className="font-mono text-[10px] text-[#555555] pt-4 border-t border-[#222222]">
          TRACE: ROUTE_UNREACHABLE // CLUSTER_AP_SOUTH_1
        </div>
      </div>
    </div>
  );
}
