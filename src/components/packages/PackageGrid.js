"use client";

import React, { useState, useEffect } from "react";
import PackageCard from "@/components/packages/PackageCard";


export default function PackageGrid() {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPakets = async () => {
      try {
        const res = await fetch("/api/paket-wisata");
        if (res.ok) {
          const json = await res.json();
          setPakets(json);
        }
      } catch (error) {
        console.error("Gagal memuat daftar paket wisata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPakets();
  }, []);

  const activeList = pakets.filter(
    (p) => p.status === "active"
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayList = activeList.map((pkg) => {
    const isTurki = pkg.category?.toLowerCase().includes("turki") || pkg.nama?.toLowerCase().includes("turki");
    const categoryBg = isTurki
      ? "bg-secondary text-on-secondary"
      : "bg-primary/90 backdrop-blur-sm text-white";

    return {
      ...pkg,
      title: pkg.nama,
      duration: pkg.durasi,
      hotel: pkg.hotel,
      airline: pkg.airline || "Saudi Airlines",
      price: formatPrice(pkg.harga),
      image: pkg.gambar || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
      category: pkg.category || "Reguler",
      categoryBg,
    };
  });

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-on-surface-variant bg-surface-container-low rounded-2xl">
        Memuat paket wisata dari database...
      </div>
    );
  }

  if (displayList.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-on-surface-variant bg-surface-container-low rounded-2xl">
        Belum ada paket wisata aktif saat ini.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayList.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 flex justify-center gap-2">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-on-primary font-bold cursor-pointer">1</button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">2</button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">3</button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </>
  );
}
