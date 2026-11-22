"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CompanySettingsData } from "@/lib/settings";

interface FooterProps {
  settings: CompanySettingsData;
}

export function Footer({ settings }: FooterProps) {
  const [year, setYear] = useState("2026");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  return (
    <footer className="bg-[#0C0C0C] border-t border-[#262626] text-[#A5A5A5] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Massive Editorial Display */}
        <div className="border-b border-[#222222] pb-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest mb-3">
                // BRAND MANIFESTO
              </p>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#F5F3EF] tracking-tight leading-none uppercase">
                {settings.tagline}
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-4 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all self-start md:self-auto hover:shadow-[0_0_20px_rgba(182,255,92,0.4)]"
            >
              <span>Initiate Project Inquiry</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Multi-column sitemap grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-[#222222]">
          {/* Col 1: Identity & Contact */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#F5F3EF] tracking-wider uppercase">
                {settings.companyName}
              </span>
            </div>
            <p className="text-xs text-[#888888] max-w-sm leading-relaxed">
              {settings.mission}
            </p>
            <div className="font-mono text-xs space-y-1.5 pt-2">
              <div>
                <span className="text-[#666]">HEADQUARTERS:</span>{" "}
                <span className="text-[#CCC]">{settings.officeLocation}</span>
              </div>
              <div>
                <span className="text-[#666]">INQUIRIES:</span>{" "}
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-[#B6FF5C] hover:underline"
                >
                  {settings.contactEmail}
                </a>
              </div>
              <div>
                <span className="text-[#666]">TELEPHONE:</span>{" "}
                <span className="text-[#CCC]">{settings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Divisions */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold text-[#F5F3EF] uppercase tracking-wider">
              Divisions
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/software" className="hover:text-[#F5F3EF] transition-colors">
                  Software Engineering
                </Link>
              </li>
              <li>
                <Link href="/services/ai-ml" className="hover:text-[#F5F3EF] transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/services/web-development" className="hover:text-[#F5F3EF] transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-development" className="hover:text-[#F5F3EF] transition-colors">
                  Mobile & Desktop
                </Link>
              </li>
              <li>
                <Link href="/services/cybersecurity" className="hover:text-[#F5F3EF] transition-colors">
                  Cybersecurity & VAPT
                </Link>
              </li>
              <li>
                <Link href="/services/cloud" className="hover:text-[#F5F3EF] transition-colors">
                  Cloud & Infrastructure
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold text-[#F5F3EF] uppercase tracking-wider">
              Studio
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/work" className="hover:text-[#F5F3EF] transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F5F3EF] transition-colors">
                  Proprietary Products
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#F5F3EF] transition-colors">
                  Technical Insights
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F5F3EF] transition-colors">
                  About Axion
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#F5F3EF] transition-colors">
                  Careers & Openings
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F5F3EF] transition-colors">
                  Contact Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Network & Connect */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs font-semibold text-[#F5F3EF] uppercase tracking-wider">
              Network
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={settings.socialGithub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F3EF] transition-colors inline-flex items-center gap-1"
                >
                  GitHub <ArrowUpRight className="w-3 h-3 text-[#666]" />
                </a>
              </li>
              <li>
                <a
                  href={settings.socialLinkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F3EF] transition-colors inline-flex items-center gap-1"
                >
                  LinkedIn <ArrowUpRight className="w-3 h-3 text-[#666]" />
                </a>
              </li>
              <li>
                <a
                  href={settings.socialX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F3EF] transition-colors inline-flex items-center gap-1"
                >
                  X (Twitter) <ArrowUpRight className="w-3 h-3 text-[#666]" />
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin/login"
                  className="font-mono text-[11px] text-[#555] hover:text-[#B6FF5C] transition-colors"
                >
                  // ADMIN CONSOLE
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with status and legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#666666] gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#B6FF5C] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#888]">
              SYS-STATUS: OPERATIONAL // INDIA &amp; GLOBAL
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link href="/privacy" className="hover:text-[#A5A5A5] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#A5A5A5] transition-colors">
              Terms &amp; Conditions
            </Link>
            <span>&copy; {year} {settings.companyName}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
