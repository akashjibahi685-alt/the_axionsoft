"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  companyName?: string;
  tagline?: string;
}

export function Header({ companyName = "AXION TECHNOLOGIES" }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Products", href: "/products" },
    { label: "Insights", href: "/insights" },
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
        scrolled
          ? "bg-[#101010]/95 backdrop-blur-md border-[#262626]"
          : "bg-[#101010] border-[#222222]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo and Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-3.5 focus-visible:outline-none"
            aria-label={`${companyName} Home`}
          >
            <div className="w-9 h-9 bg-[#191919] border border-[#333333] group-hover:border-[#B6FF5C] flex items-center justify-center transition-colors">
              <span className="font-mono text-sm font-black text-[#F5F3EF] group-hover:text-[#B6FF5C]">
                ▲
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-[#F5F3EF] group-hover:text-[#B6FF5C] transition-colors uppercase">
                {companyName}
              </span>
              <span className="font-mono text-[10px] text-[#A5A5A5] tracking-widest hidden sm:block">
                STUDIO // ENG
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 transition-colors relative ${
                    isActive
                      ? "text-[#B6FF5C] font-semibold"
                      : "text-[#A5A5A5] hover:text-[#F5F3EF]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#B6FF5C]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all hover:shadow-[0_0_15px_rgba(182,255,92,0.3)]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-[#303030] bg-[#181818] text-[#F5F3EF] hover:border-[#B6FF5C] hover:text-[#B6FF5C] transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#303030] bg-[#141414] px-4 pt-4 pb-8 space-y-4">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 font-mono text-sm uppercase tracking-wider flex items-center justify-between border-b border-[#222222] ${
                    isActive
                      ? "text-[#B6FF5C] font-bold bg-[#1C1C1C]"
                      : "text-[#A5A5A5] hover:text-[#F5F3EF]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[#555] text-xs">→</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-4">
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
