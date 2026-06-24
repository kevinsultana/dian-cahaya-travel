"use client";

import React, { useState, useEffect } from "react";
import PackageCard from "@/components/packages/PackageCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialPaketWisata } from "@/data/constant";

export default function PackageGrid() {
  const [mounted, setMounted] = useState(false);
  const [pakets] = useLocalStorage("adminPaketWisata", initialPaketWisata);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeList = (mounted ? pakets : initialPaketWisata).filter(
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
