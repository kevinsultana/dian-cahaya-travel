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
  
  // Database States
  const [pakets, setPakets] = useState([]);
  
  // Active Filter States
  const [categoryFilter, setCategoryFilter] = useState({ value: "all", label: "Semua Kategori" });
  const [priceFilter, setPriceFilter] = useState({ value: "all", label: "Semua Harga" });
  const [monthFilter, setMonthFilter] = useState({ value: "all", label: "Semua Bulan" });

  // Filter options generated dynamically
  const [categoryOptions, setCategoryOptions] = useState([{ value: "all", label: "Semua Kategori" }]);
  const [monthOptions, setMonthOptions] = useState([{ value: "all", label: "Semua Bulan" }]);

  useEffect(() => {
    setMounted(true);
    document.title = "Daftar Paket Umroh & Haji | Dian Cahaya Travel";

    const loadFilterData = async () => {
      try {
        const res = await fetch("/api/paket-wisata");
        if (res.ok) {
          const json = await res.json();
          const activePakets = json.filter(p => p.status === "active");
          setPakets(activePakets);

          // 1. Generate Unique Categories
          const categories = Array.from(new Set(activePakets.map(p => p.category).filter(Boolean)));
          const catOpts = [
            { value: "all", label: "Semua Kategori" },
            ...categories.map(cat => ({ value: cat.toLowerCase(), label: cat }))
          ];
          setCategoryOptions(catOpts);

          // 2. Generate Unique Months
          const months = Array.from(
            new Set(
              activePakets.map(p => {
                if (!p.tanggal_keberangkatan) return null;
                const date = new Date(p.tanggal_keberangkatan);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const label = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                return JSON.stringify({ value: `${month}-${year}`, label });
              }).filter(Boolean)
            )
          ).map(str => JSON.parse(str));

          // Sort months chronologically
          months.sort((a, b) => {
            const [mA, yA] = a.value.split("-").map(Number);
            const [mB, yB] = b.value.split("-").map(Number);
            return yA !== yB ? yA - yB : mA - mB;
          });

          setMonthOptions([
            { value: "all", label: "Semua Bulan" },
            ...months
          ]);
        }
      } catch (error) {
        console.error("Gagal memuat opsi filter:", error);
      }
    };

    loadFilterData();
  }, []);

  const handleResetFilters = () => {
    setCategoryFilter({ value: "all", label: "Semua Kategori" });
    setPriceFilter({ value: "all", label: "Semua Harga" });
    setMonthFilter({ value: "all", label: "Semua Bulan" });
  };

  const priceOptions = [
    { value: "all", label: "Semua Harga" },
    { value: "under-30", label: "Dibawah Rp 30jt" },
    { value: "30-40", label: "Rp 30jt - 40jt" },
    { value: "40-50", label: "Rp 40jt - 50jt" },
    { value: "50-60", label: "Rp 50jt - 60jt" },
    { value: "above-60", label: "Diatas Rp 60jt" },
  ];

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
                  instanceId="kategori-select"
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={categoryOptions}
                  styles={selectStyles}
                />
              </div>
              {/* Harga */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Kisaran Harga
                </label>
                <Select
                  instanceId="harga-select"
                  value={priceFilter}
                  onChange={setPriceFilter}
                  options={priceOptions}
                  styles={selectStyles}
                />
              </div>
              {/* Bulan */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                  Bulan Keberangkatan
                </label>
                <Select
                  instanceId="bulan-select"
                  value={monthFilter}
                  onChange={setMonthFilter}
                  options={monthOptions}
                  styles={selectStyles}
                />
              </div>
              {/* Reset Button */}
              <div>
                <button
                  onClick={handleResetFilters}
                  className="w-full bg-surface border border-outline-variant text-on-surface-variant py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-variant transition-all cursor-pointer flex items-center justify-center gap-2"
                  title="Reset Filters"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    filter_alt_off
                  </span>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Package Grid */}
        <section className="py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <PackageGrid
              category={categoryFilter.value}
              priceRange={priceFilter.value}
              monthYear={monthFilter.value}
            />
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
