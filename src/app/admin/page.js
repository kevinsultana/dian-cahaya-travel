"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  initialPaketWisata,
  initialInquiryJemaah,
} from "@/data/constant";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [isLoggedIn] = useLocalStorage("adminLoggedIn", false);
  const [paketWisata] = useLocalStorage("adminPaketWisata", initialPaketWisata);
  const [inquiries] = useLocalStorage("adminInquiryJemaah", initialInquiryJemaah);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push("/admin/login");
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) return null;

  const totalPaket = paketWisata.length;
  const totalJemaah = inquiries.length;
  const jamaahBaru = inquiries.filter((i) => i.status === "baru").length;
  const bulanIni = new Date().toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const keberangkatanBulanIni = paketWisata.filter((p) => {
    const date = new Date(p.tanggal_keberangkatan);
    const now = new Date();
    return (
      p.status === "active" &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div>
      <AdminHeader title="Dashboard" onLogout={() => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/admin/login");
      }} />

      <main className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  flight_takeoff
                </span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Total Paket</p>
                <p className="text-2xl font-bold text-primary">{totalPaket}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  groups
                </span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Total Jamaah</p>
                <p className="text-2xl font-bold text-primary">{totalJemaah}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-container/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  new_releases
                </span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Jamaah Baru</p>
                <p className="text-2xl font-bold text-primary">{jamaahBaru}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  calendar_today
                </span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Keberangkatan {bulanIni}</p>
                <p className="text-2xl font-bold text-primary">{keberangkatanBulanIni}</p>
              </div>
            </div>
          </div>
        </div>

        {/* New Inquiries Table */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm">
          <div className="p-6 border-b border-outline-variant">
            <h2 className="text-lg font-bold text-primary">Calon Jamaah Baru</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Daftar jamaah yang baru mendaftar dan belum di-follow up
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Paket
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {inquiries
                  .filter((i) => i.status === "baru")
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-primary">
                        {item.nama}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {item.wa || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {item.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {item.paket}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-primary">
                          Baru
                        </span>
                      </td>
                    </tr>
                  ))}
                {inquiries.filter((i) => i.status === "baru").length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-sm text-on-surface-variant">
                      Tidak ada jamaah baru
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
