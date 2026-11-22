import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "neutral" | "danger" | "warning" | "success";
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = "neutral",
  className = "",
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    accent: "bg-[#B6FF5C]/10 text-[#B6FF5C] border-[#B6FF5C]/30",
    neutral: "bg-[#1C1C1C] text-[#A5A5A5] border-[#303030]",
    danger: "bg-red-950/30 text-red-400 border-red-800/40",
    warning: "bg-amber-950/30 text-amber-400 border-amber-800/40",
    success: "bg-emerald-950/30 text-emerald-400 border-emerald-800/40",
  };

  const dotColors = {
    accent: "bg-[#B6FF5C]",
    neutral: "bg-[#A5A5A5]",
    danger: "bg-red-400",
    warning: "bg-amber-400",
    success: "bg-emerald-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border rounded-none ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
