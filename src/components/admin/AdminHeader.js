"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader({ title, onLogout }) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-outline-variant px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-xl font-bold text-primary">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-on-surface-variant">Administrator</span>
        <button
          onClick={onLogout}
          className="bg-surface border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-variant transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </header>
  );
}
