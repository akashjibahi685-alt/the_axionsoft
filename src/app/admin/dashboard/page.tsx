import React from "react";
import Link from "next/link";
import {
  FolderGit2,
  Cpu,
  BookOpen,
  MessageSquare,
  Users,
  ArrowUpRight,
  Shield,
  Layers,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export default async function AdminDashboardPage() {
  const [
    projectCount,
    productCount,
    postCount,
    newInquiryCount,
    careerCount,
    recentInquiries,
    auditLogs,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.careerApplication.count(),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 6,
      include: { adminUser: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const metrics = [
    { label: "Active Projects", value: projectCount, href: "/admin/projects", icon: FolderGit2 },
    { label: "Proprietary Products", value: productCount, href: "/admin/products", icon: Cpu },
    { label: "Published Insights", value: postCount, href: "/admin/blog", icon: BookOpen },
    {
      label: "New Inquiries",
      value: newInquiryCount,
      href: "/admin/inquiries",
      icon: MessageSquare,
      highlight: newInquiryCount > 0,
    },
    { label: "Job Applications", value: careerCount, href: "/admin/careers", icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & System Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-6">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            ADMINISTRATION // CONTROL DECK
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="accent" dot>
            SYSTEM NOMINAL
          </Badge>
          <Link
            href="/admin/settings"
            className="px-3.5 py-1.5 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] font-mono text-xs uppercase text-[#CCC] transition-colors"
          >
            System Settings
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              href={m.href}
              className={`p-5 border transition-all flex flex-col justify-between ${
                m.highlight
                  ? "bg-[#182014] border-[#B6FF5C]/60 hover:border-[#B6FF5C]"
                  : "bg-[#141414] border-[#262626] hover:border-[#383838]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#888] uppercase block">
                  {m.label}
                </span>
                <Icon className={`w-4 h-4 ${m.highlight ? "text-[#B6FF5C]" : "text-[#666]"}`} />
              </div>
              <div className="text-3xl font-black font-mono text-[#F5F3EF] mt-3">
                {m.value}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Split Section: Recent Inquiries + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries Table */}
        <div className="lg:col-span-8 border border-[#262626] bg-[#141414] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-4">
            <div>
              <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider">
                // Recent Client Inquiries
              </h2>
              <span className="text-xs text-[#777]">Submissions received through project brief gate</span>
            </div>
            <Link
              href="/admin/inquiries"
              className="font-mono text-xs text-[#B6FF5C] hover:underline uppercase inline-flex items-center gap-1"
            >
              <span>Manage All ({newInquiryCount} Unread)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#666]">
              NO INQUIRIES REGISTERED YET.
            </div>
          ) : (
            <div className="divide-y divide-[#202020] overflow-x-auto">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="space-y-0.5 truncate max-w-sm">
                    <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                      <span>{inq.fullName}</span>
                      {inq.companyName && <span className="text-[#888]">({inq.companyName})</span>}
                    </div>
                    <div className="text-[#888] truncate">{inq.serviceRequired}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={inq.status === "NEW" ? "accent" : "neutral"}>
                      {inq.status}
                    </Badge>
                    <Link
                      href={`/admin/inquiries?id=${inq.id}`}
                      className="px-2.5 py-1 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] text-[#CCC] uppercase text-[10px]"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Log Timeline */}
        <div className="lg:col-span-4 border border-[#262626] bg-[#141414] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#222] pb-4">
            <h2 className="font-mono text-xs font-bold text-[#F5F3EF] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#B6FF5C]" />
              <span>Audit Trail</span>
            </h2>
            <span className="font-mono text-[10px] text-[#666]">CRYPTOGRAPHIC LOG</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-[#171717] border border-[#242424] space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#B6FF5C] font-bold">{log.action}</span>
                  <span className="text-[#666]">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="text-[#CCC] text-[11px] truncate">
                  {log.entityType} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div className="p-6 border border-[#262626] bg-[#121212] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-[#B6FF5C]" />
          <div>
            <span className="text-[#F5F3EF] font-bold block uppercase">Content Operations Launchpad</span>
            <span className="text-[#888] text-[11px]">Direct shortcuts to create new artifacts</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/projects"
            className="px-3.5 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] uppercase text-[#F5F3EF]"
          >
            + New Project
          </Link>
          <Link
            href="/admin/blog"
            className="px-3.5 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] uppercase text-[#F5F3EF]"
          >
            + New Insight Article
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-[#1C1C1C] border border-[#333] hover:border-[#B6FF5C] uppercase text-[#F5F3EF]"
          >
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
}
