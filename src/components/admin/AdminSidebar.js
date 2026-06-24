"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainMenuItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/paket-wisata", label: "Paket Wisata", icon: "flight_takeoff" },
  { href: "/admin/inquiry-jemaah", label: "Inquiry Jamaah", icon: "groups" },
];

const websiteMenuItems = [
  { href: "/admin/hero-section", label: "Hero Section", icon: "view_quilt" },
  { href: "/admin/banner-promo", label: "Banner Promo", icon: "campaign" },
  { href: "/admin/galeri-foto", label: "Galeri Foto", icon: "photo_library" },
  { href: "/admin/testimoni", label: "Testimoni", icon: "reviews" },
  { href: "/admin/tentang-kami", label: "Tentang Kami", icon: "info" },
  { href: "/admin/pengaturan-wa", label: "Pengaturan WA", icon: "chat" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [websiteOpen, setWebsiteOpen] = useState(false);

  // Auto open Website menu if path matches a website sub-route
  useEffect(() => {
    const isWebsiteRoute = websiteMenuItems.some((item) => pathname === item.href);
    if (isWebsiteRoute) {
      setWebsiteOpen(true);
    }
  }, [pathname]);

  return (
    <aside className="w-64 bg-primary text-white flex flex-col fixed h-full z-40">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="text-xl font-bold flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            mosque
          </span>
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Main Menu Items */}
        {mainMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-white/15 text-white font-semibold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Collapsible Website Menu */}
        <div>
          <button
            onClick={() => setWebsiteOpen(!websiteOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">language</span>
              <span>Website</span>
            </div>
            <span className="material-symbols-outlined transition-transform duration-200" style={{ transform: websiteOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
              expand_more
            </span>
          </button>

          {/* Submenu Items */}
          <div
            className={`pl-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
              websiteOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {websiteMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                    isActive
                      ? "bg-white/15 text-white font-semibold"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Kembali ke Website
        </Link>
      </div>
    </aside>
  );
}
