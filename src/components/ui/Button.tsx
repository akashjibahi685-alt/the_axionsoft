import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  children,
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-mono uppercase tracking-wider text-xs font-semibold transition-all duration-200 cursor-pointer select-none border";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-[11px] gap-1.5",
    md: "px-5 py-2.5 text-xs gap-2",
    lg: "px-8 py-3.5 text-sm gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-[#B6FF5C] text-[#101010] border-[#B6FF5C] hover:bg-[#a3f044] hover:shadow-[0_0_20px_rgba(182,255,92,0.35)] active:translate-y-0.5",
    secondary:
      "bg-[#1A1A1A] text-[#F5F3EF] border-[#303030] hover:bg-[#222222] hover:border-[#444444] active:translate-y-0.5",
    outline:
      "bg-transparent text-[#F5F3EF] border-[#404040] hover:border-[#B6FF5C] hover:text-[#B6FF5C] active:translate-y-0.5",
    ghost:
      "bg-transparent text-[#A5A5A5] border-transparent hover:text-[#F5F3EF] hover:bg-[#181818]",
  };

  const disabledClasses = disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "";

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
        >
          {children}
          {icon}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
      {icon}
    </button>
  );
}
