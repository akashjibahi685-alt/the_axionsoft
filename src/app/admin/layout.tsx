"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Layers,
  BookOpen,
  MessageSquare,
  Users,
  Image as ImageIcon,
  Video,
  Settings,
  ShieldCheck,
  Palette,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on /admin/login, don't show the dashboard sidebar layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { label: "Services", href: "/admin/services", icon: Layers },
    { label: "Products", href: "/admin/products", icon: Cpu },
    { label: "Blog & Insights", href: "/admin/blog", icon: BookOpen },
    { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { label: "Careers", href: "/admin/careers", icon: Users },
    { label: "Hero Video Runner", href: "/admin/video", icon: Video },
    { label: "Media Assets", href: "/admin/media", icon: ImageIcon },
    { label: "Company Settings", href: "/admin/settings", icon: Settings },
    { label: "UI / DX Studio", href: "/admin/ui-dx", icon: Palette },
    { label: "Admin Users", href: "/admin/users", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F5F3EF] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#141414] border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#B6FF5C]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            AXION // ADMIN
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 border border-[#333] text-[#F5F3EF]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop / Mobile Drawer Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#121212] border-r border-[#242424] flex-shrink-0 flex flex-col justify-between`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-[#202020] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <span className="w-3 h-3 bg-[#B6FF5C]" />
              <div className="flex flex-col">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F3EF]">
                  AXION STUDIO
                </span>
                <span className="font-mono text-[9px] text-[#777]">
                  CMS // CONTROL PLANE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors uppercase tracking-wider text-[11px] ${
                    isActive
                      ? "bg-[#1C1F18] text-[#B6FF5C] font-bold border-l-2 border-[#B6FF5C]"
                      : "text-[#A5A5A5] hover:text-[#F5F3EF] hover:bg-[#181818]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Session & Actions */}
        <div className="p-4 border-t border-[#202020] space-y-3 font-mono text-xs">
          <div className="p-2.5 bg-[#171717] border border-[#262626] flex items-center justify-between">
            <div className="truncate">
              <span className="text-[10px] text-[#666] block">ADMINISTRATOR</span>
              <span className="text-xs text-[#F5F3EF] truncate">admin@axiontech.in</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#B6FF5C] animate-pulse" />
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-[#888] hover:text-[#B6FF5C] text-[11px] uppercase transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-[11px] uppercase transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <main className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
