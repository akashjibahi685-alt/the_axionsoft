"use client";

import React, { useState, useEffect } from "react";
import { Plus, Shield, Loader2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: { id: string; name: string };
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setRoles(data.roles || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          roleId: form.roleId || roles[0]?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create administrator");

      setShowModal(false);
      setForm({ name: "", email: "", password: "", roleId: "" });
      loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating administrator");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#B6FF5C] uppercase tracking-widest block">
            ACCESS CONTROL &amp; RBAC // CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F3EF]">
            Administrative Users
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B6FF5C] text-[#101010] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#a3f044] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Admin User</span>
        </button>
      </div>

      <div className="border border-[#262626] bg-[#141414] overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-[#888] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#B6FF5C]" />
            <span>Loading user directory...</span>
          </div>
        ) : (
          <table className="w-full text-left font-mono text-xs divide-y divide-[#242424]">
            <thead className="bg-[#181818] text-[#888] uppercase text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#181818] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-[#F5F3EF] flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#B6FF5C]" />
                      <span>{u.name}</span>
                    </div>
                    <span className="text-[10px] text-[#888]">{u.email}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant="accent">{u.role.name}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.isActive ? "success" : "danger"}>
                      {u.isActive ? "ACTIVE" : "SUSPENDED"}
                    </Badge>
                  </td>
                  <td className="p-4 text-[#888]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full border border-[#333] bg-[#141414] p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h2 className="text-xl font-bold uppercase text-[#F5F3EF]">Provision Administrator</h2>
              <button onClick={() => setShowModal(false)} className="text-xs text-[#888]">✕</button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-800 text-red-400 font-mono text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Initial Password *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[#888] uppercase mb-1">Assigned Role</label>
                <select
                  value={form.roleId}
                  onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#333] text-[#F5F3EF] p-2"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-[#333] text-[#888]">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-[#B6FF5C] text-[#101010] font-bold uppercase">
                  {saving ? "Provisioning..." : "Provision User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
