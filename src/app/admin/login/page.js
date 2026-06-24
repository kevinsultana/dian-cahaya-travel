"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setIsLoggedIn] = useLocalStorage("adminLoggedIn", false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      router.push("/admin");
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card border border-outline-variant p-8">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
            <h1 className="text-2xl font-bold text-primary mt-4">Admin Login</h1>
            <p className="text-on-surface-variant mt-2 text-sm">
              Masuk untuk mengelola konten website
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                placeholder="Masukkan password"
                required
              />
            </div>

            {error && (
              <p className="text-error text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Masuk
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-on-surface-variant hover:text-primary transition-colors">
              Kembali ke Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
