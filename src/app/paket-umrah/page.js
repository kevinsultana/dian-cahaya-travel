"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PackageGrid from "@/components/packages/PackageGrid";
import Select from "react-select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialPengaturanWa } from "@/data/constant";

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    paddingTop: '2px',
    paddingBottom: '2px',
    boxShadow: 'none',
    width: '100%',
    minWidth: '200px',
    '&:hover': {
      borderColor: '#cbd5e1',
    }
  }),
  menu: (base) => ({
    ...base,
    fontSize: '0.875rem',
    zIndex: 9999
  })
};

export default function PaketUmrahPage() {
  const [mounted, setMounted] = useState(false);
  const [waData] = useLocalStorage("adminPengaturanWa", initialPengaturanWa);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeWa = mounted ? waData : initialPengaturanWa;
  const waNumber = activeWa?.nomor || "6281234567890";
  const waText = activeWa?.pesan_template || "";
  const waUrl = `https://wa.me/${waNumber}${waText ? `?text=${encodeURIComponent(waText)}` : ""}`;
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-16 pt-30 bg-primary-container overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <h1
              className="font-bold text-white mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Paket Umroh &amp; Haji
            </h1>
            <p className="text-lg text-on-primary-container max-w-2xl mx-auto leading-relaxed">
              Wujudkan impian ibadah ke Tanah Suci dengan layanan terbaik dan
              pembimbing berpengalaman.
            </p>
          </div>
        </section>

        {/* Filter Bar (Sticky) */}
        <section className="bg-surface-container border-b border-outline-variant z-40 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Kategori */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Kategori Paket
                </label>
                <Select
                  defaultValue={{ value: "all", label: "Semua Kategori" }}
                  options={[
                    { value: "all", label: "Semua Kategori" },
                    { value: "reguler", label: "Reguler" },
                    { value: "plus", label: "Plus" },
                    { value: "ramadhan", label: "Ramadhan" }
                  ]}
                  styles={selectStyles}
                />
              </div>
              {/* Harga */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Kisaran Harga
                </label>
                <Select
                  defaultValue={{ value: "all", label: "Semua Harga" }}
                  options={[
                    { value: "all", label: "Semua Harga" },
                    { value: "25-30", label: "Rp 25jt - 30jt" },
                    { value: "30-40", label: "Rp 30jt - 40jt" },
                    { value: "40+", label: "Diatas Rp 40jt" }
                  ]}
                  styles={selectStyles}
                />
              </div>
              {/* Bulan */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Bulan Keberangkatan
                </label>
                <Select
                  defaultValue={{ value: "all", label: "Semua Bulan" }}
                  options={[
                    { value: "all", label: "Semua Bulan" },
                    { value: "08-2024", label: "Agustus 2024" },
                    { value: "09-2024", label: "September 2024" },
                    { value: "10-2024", label: "Oktober 2024" },
                    { value: "03-2025", label: "Ramadhan 2025" }
                  ]}
                  styles={selectStyles}
                />
              </div>
              {/* Search */}
              <div className="flex gap-2">
                <button className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                  Cari Paket
                </button>
                <button
                  className="w-12 bg-surface border border-outline-variant text-on-surface-variant rounded-lg flex items-center justify-center hover:bg-surface-variant transition-all cursor-pointer"
                  title="Reset Filters"
                >
                  <span className="material-symbols-outlined">
                    filter_alt_off
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Package Grid */}
        <section className="py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex justify-between items-baseline mb-10">
              <h2 className="text-2xl font-bold text-primary">
                Menampilkan 12 Paket Pilihan
              </h2>
              <p className="text-sm text-on-surface-variant">
                Urutkan:{" "}
                <span className="font-bold text-primary cursor-pointer">
                  Terbaru
                </span>
              </p>
            </div>
            <PackageGrid />
          </div>
        </section>

        {/* Newsletter / Trust CTA */}
        <section className="bg-surface-container-high py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="bg-primary rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
              <div className="relative z-10 md:w-2/3">
                <h2
                  className="text-white font-bold mb-4"
                  style={{ fontSize: "clamp(24px, 3vw, 48px)" }}
                >
                  Butuh Rekomendasi Paket?
                </h2>
                <p className="text-lg text-on-primary/80 mb-8 leading-relaxed">
                  Tim konsultan kami siap membantu Anda memilih paket yang
                  paling sesuai dengan kebutuhan dan budget Anda. Dapatkan
                  penawaran khusus hari ini.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary-container text-primary px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-all"
                  >
                    <span className="material-symbols-outlined">
                      chat_bubble
                    </span>
                    Hubungi via WhatsApp
                  </a>
                  <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-all cursor-pointer">
                    Lihat FAQ
                  </button>
                </div>
              </div>
              <div className="hidden md:block md:w-1/3 text-center">
                <div className="inline-block p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                  <span
                    className="material-symbols-outlined text-[80px] text-secondary-fixed"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    security
                  </span>
                  <p className="text-white font-bold mt-4">
                    Jaminan Keamanan &amp; Kenyamanan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
