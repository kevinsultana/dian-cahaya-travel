"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";


export default function PromoBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner-promo");
        if (res.ok) {
          const json = await res.json();
          setBanners(json);
        }
      } catch (error) {
        console.error("Gagal memuat banner promo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) return null;

  const activeBanners = (banners || []).filter((item) => item.status === "aktif");

  if (activeBanners.length === 0) return null;

  return (
    <section className="py-16 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-6">
        {activeBanners.length === 1 ? (
          // Single Promo Banner - Rich Showcase Layout
          constItem(activeBanners[0])
        ) : (
          // Multiple Promo Banners - Premium Grid Layout
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-primary mb-3">Promo & Penawaran Spesial</h2>
              <p className="text-on-surface-variant text-sm">Jangan lewatkan kesempatan emas ibadah ke Tanah Suci dengan penawaran terbatas dari kami.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeBanners.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-outline-variant hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-error text-on-error px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase shadow-sm">
                      Promo
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-3 flex-1">
                      {item.subjudul}
                    </p>
                    <Link
                      href={item.tautan || "#"}
                      className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:opacity-95 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all w-full text-center"
                    >
                      Ambil Promo
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function constItem(item) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary-container to-secondary-container text-white p-8 md:p-12 shadow-xl border border-outline-variant/20">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-secondary-container text-primary uppercase tracking-wider">
            Penawaran Spesial Terbatas
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {item.judul}
          </h2>
          <p className="text-base md:text-lg text-on-primary-container/90 leading-relaxed max-w-xl">
            {item.subjudul}
          </p>
          <div className="pt-2">
            <Link
              href={item.tautan || "#"}
              className="inline-flex items-center gap-2 bg-secondary-container text-primary hover:bg-secondary-fixed px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              Lihat Detail Promo
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 relative w-full aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white/10">
          <img
            src={item.gambar}
            alt={item.judul}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
