"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialPaketWisata } from "@/data/constant";

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function FeaturedPackages() {
  const [mounted, setMounted] = useState(false);
  const [paketData] = useLocalStorage("adminPaketWisata", initialPaketWisata);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activePaket = mounted ? paketData : initialPaketWisata;

  // Filter active & featured packages
  const featuredItems = (activePaket || []).filter(
    (item) => item.status === "active" && item.featured
  );

  // Fallback to active items if featured items are less than 3
  const displayItems = [...featuredItems];
  if (displayItems.length < 3) {
    const nonFeaturedActive = (activePaket || []).filter(
      (item) => item.status === "active" && !displayItems.some((d) => d.id === item.id)
    );
    displayItems.push(...nonFeaturedActive.slice(0, 3 - displayItems.length));
  }

  if (displayItems.length === 0) return null;

  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="text-secondary font-bold tracking-widest text-sm uppercase">
              Pilihan Terbaik
            </p>
            <h2
              className="text-primary font-bold mt-2"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              Paket Umroh Unggulan
            </h2>
          </div>
          <Link
            href="/paket-umrah"
            className="text-primary font-bold flex items-center gap-2 group underline-offset-4 hover:underline"
          >
            Lihat Semua Paket
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              east
            </span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Paket 1 — Large Featured */}
          {displayItems[0] && (
            <div className="md:col-span-8 bg-white rounded-2xl overflow-hidden border border-outline-variant flex flex-col md:flex-row group shadow-sm hover:shadow-md transition-all">
              <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{
                    backgroundImage: `url(${
                      displayItems[0].gambar ||
                      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80"
                    })`,
                  }}
                />
                {displayItems[0].badge && (
                  <div className="absolute top-4 left-4 bg-secondary-container text-primary px-4 py-1 rounded-full text-xs font-bold shadow-sm">
                    {displayItems[0].badge}
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    {displayItems[0].nama}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-3">
                    {displayItems[0].deskripsi ||
                      "Nikmati perjalanan ibadah yang khusyuk dan nyaman dengan layanan profesional."}
                  </p>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary">calendar_today</span>
                      <span className="text-sm">{displayItems[0].durasi}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary">apartment</span>
                      <span className="text-sm">{displayItems[0].hotel}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      <span className="text-sm font-bold text-tertiary">
                        Mulai {formatRupiah(displayItems[0].harga)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/paket-umrah"
                  className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all text-center text-sm"
                >
                  Pilih Paket
                </Link>
              </div>
            </div>
          )}

          {/* Paket 2 */}
          {displayItems[1] && (
            <div className="md:col-span-4 bg-white rounded-2xl overflow-hidden border border-outline-variant flex flex-col shadow-sm hover:shadow-md transition-all group">
              <div
                className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url(${
                    displayItems[1].gambar ||
                    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80"
                  })`,
                }}
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-2">{displayItems[1].nama}</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 leading-relaxed">
                  {displayItems[1].deskripsi ||
                    "Perjalanan ibadah Umroh dengan bimbingan ustadz berpengalaman."}
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-on-surface-variant">{displayItems[1].durasi}</span>
                    <span className="text-sm font-bold text-tertiary">
                      {formatRupiah(displayItems[1].harga)}
                    </span>
                  </div>
                  <Link
                    href="/paket-umrah"
                    className="w-full border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-all text-center text-sm block"
                  >
                    Detail Paket
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Paket 3 */}
          {displayItems[2] && (
            <div className="md:col-span-4 bg-white rounded-2xl overflow-hidden border border-outline-variant flex flex-col shadow-sm hover:shadow-md transition-all group">
              <div
                className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: `url(${
                    displayItems[2].gambar ||
                    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80"
                  })`,
                }}
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-2">{displayItems[2].nama}</h3>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 leading-relaxed">
                  {displayItems[2].deskripsi ||
                    "Rasakan kekhidmatan ibadah Umroh dengan pelayanan terbaik."}
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-on-surface-variant">{displayItems[2].durasi}</span>
                    <span className="text-sm font-bold text-tertiary">
                      {formatRupiah(displayItems[2].harga)}
                    </span>
                  </div>
                  <Link
                    href="/paket-umrah"
                    className="w-full border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-all text-center text-sm block"
                  >
                    Detail Paket
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* CTA Block */}
          <div className="md:col-span-8 bg-primary text-on-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mosque
              </span>
            </div>
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Butuh Penyesuaian Jadwal?</h3>
              <p className="text-base opacity-80">
                Kami menyediakan paket custom untuk group, keluarga, maupun korporasi.
              </p>
            </div>
            <Link
              href="/kontak"
              className="relative z-10 bg-secondary-container text-primary px-10 py-4 rounded-full font-bold whitespace-nowrap shadow-xl hover:scale-105 transition-transform"
            >
              Hubungi Admin WA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
