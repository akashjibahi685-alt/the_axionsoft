"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("admin@axiontech.in");
  const [password, setPassword] = useState("Admin@Axion2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F5F3EF] flex flex-col justify-center items-center p-4 bg-grid-pattern">
      <div className="max-w-md w-full border border-[#2A2A2A] bg-[#141414] p-8 sm:p-10 space-y-6 shadow-2xl relative">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#B6FF5C]">
            <Lock className="w-5 h-5" />
          </div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            ADMIN CONSOLE // AUTH GATE
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#F5F3EF]">
            Axion Technologies
          </h1>
          <p className="text-xs text-[#888888]">
            Restricted access for authorized systems administrators only.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-800 text-red-400 font-mono text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm pl-10 pr-4 py-3 focus:border-[#B6FF5C] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#888] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666] absolute left-3 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#181818] border border-[#303030] text-[#F5F3EF] text-sm pl-10 pr-10 py-3 focus:border-[#B6FF5C] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#666] hover:text-[#B6FF5C]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#222] font-mono text-[11px] text-[#777] bg-[#111] p-3 border border-[#242424]">
          <span className="text-[#B6FF5C] block mb-1 font-bold">// SEEDED CREDENTIALS:</span>
          <div>Email: <span className="text-[#F5F3EF]">admin@axiontech.in</span></div>
          <div>Password: <span className="text-[#F5F3EF]">Admin@Axion2026!</span></div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center text-xs font-mono text-[#888]">Loading Auth Gate...</div>}>
      <LoginForm />
    </Suspense>
  );
}
