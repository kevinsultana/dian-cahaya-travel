"use client";

import React, { useState, useEffect } from "react";
import PackageCard from "@/components/packages/PackageCard";


export default function PackageGrid({ category = "all", priceRange = "all", monthYear = "all" }) {
  const [pakets, setPakets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 jika ada filter yang berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [category, priceRange, monthYear]);

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

  // Filter paket berdasarkan input user secara dinamis
  const activeList = pakets.filter((p) => {
    // 1. Filter Status Aktif
    if (p.status !== "active") return false;

    // 2. Filter Kategori
    if (category !== "all" && p.category?.toLowerCase() !== category) {
      return false;
    }

    // 3. Filter Harga (Range Increment 10 Juta)
    const harga = p.harga;
    if (priceRange !== "all") {
      if (priceRange === "under-30" && harga >= 30000000) return false;
      if (priceRange === "30-40" && (harga < 30000000 || harga >= 40000000)) return false;
      if (priceRange === "40-50" && (harga < 40000000 || harga >= 50000000)) return false;
      if (priceRange === "50-60" && (harga < 50000000 || harga >= 60000000)) return false;
      if (priceRange === "above-60" && harga < 60000000) return false;
    }

    // 4. Filter Bulan Keberangkatan (Format: MM-YYYY)
    if (monthYear !== "all" && p.tanggal_keberangkatan) {
      const date = new Date(p.tanggal_keberangkatan);
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();
      const itemMonthYear = `${m}-${y}`;
      if (itemMonthYear !== monthYear) return false;
    }

    return true;
  });

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

  // LOGIKA PAGINATION (Maksimal 6 Item per halaman)
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(displayList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedList = displayList.slice(startIndex, endIndex);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedList.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {/* Pagination (Hanya tampil jika total halaman > 1) */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          {/* Tombol Prev */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          {/* List Halaman Dinamis */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all cursor-pointer font-bold ${
                  currentPage === pageNum
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant hover:bg-surface-variant text-on-surface-variant"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* Tombol Next */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </>
  );
}
