"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import Swal from "sweetalert2";

export default function PengaturanKontakPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeData, setActiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    alamat: "",
    telepon: "",
    email: "",
    wa_cs: "",
    jam_kerja: "",
    gmaps_embed: "",
  });

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.push("/admin/login");
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/kontak");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setActiveData(json);
      setFormData({
        alamat: json.alamat || "",
        telepon: json.telepon || "",
        email: json.email || "",
        wa_cs: json.wa_cs || "",
        jam_kerja: json.jam_kerja || "",
        gmaps_embed: json.gmaps_embed || "",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat pengaturan kontak." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) fetchData();
  }, [mounted, isLoggedIn, fetchData]);

  if (!mounted || !isLoggedIn) return null;

  const openEditModal = () => {
    if (!activeData) return;
    setFormData({
      alamat: activeData.alamat || "",
      telepon: activeData.telepon || "",
      email: activeData.email || "",
      wa_cs: activeData.wa_cs || "",
      jam_kerja: activeData.jam_kerja || "",
      gmaps_embed: activeData.gmaps_embed || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/kontak", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      await fetchData();
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Pengaturan kontak berhasil disimpan.", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan pengaturan kontak." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Pengaturan Kontak"
        onLogout={() => {
          localStorage.removeItem("adminLoggedIn");
          router.push("/admin/login");
        }}
      />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-on-surface-variant">Atur detail informasi kontak yang ditampilkan pada halaman hubungi kami</p>
          <button
            onClick={openEditModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Kontak
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-on-surface-variant">Memuat data...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 space-y-6">
              <div className="border-b border-outline-variant pb-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Alamat Kantor</h3>
                <p className="text-sm text-on-surface leading-relaxed">{activeData?.alamat}</p>
              </div>
              <div className="border-b border-outline-variant pb-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Nomor Telepon</h3>
                <p className="text-sm font-semibold text-on-surface">{activeData?.telepon}</p>
              </div>
              <div className="border-b border-outline-variant pb-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Email</h3>
                <p className="text-sm font-semibold text-on-surface">{activeData?.email}</p>
              </div>
              <div className="border-b border-outline-variant pb-4">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">WhatsApp Customer Service</h3>
                <p className="text-sm font-semibold text-on-surface">{activeData?.wa_cs}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Jam Operasional</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {activeData?.jam_kerja}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 flex flex-col">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Peta Google Maps</h3>
              <div className="flex-1 min-h-[300px] bg-surface rounded-lg border border-outline-variant/60 overflow-hidden relative">
                {activeData?.gmaps_embed ? (
                  <div
                    className="w-full h-full absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                    dangerouslySetInnerHTML={{ __html: activeData.gmaps_embed }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-on-surface-variant">
                    Peta tidak dikonfigurasi
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Pengaturan Kontak">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-1">Alamat Kantor</label>
            <textarea
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-20 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Telepon</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">WhatsApp CS (misal: 6281234567890)</label>
              <input
                type="text"
                value={formData.wa_cs}
                onChange={(e) => setFormData({ ...formData, wa_cs: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-1">Jam Kerja</label>
              <textarea
                value={formData.jam_kerja}
                onChange={(e) => setFormData({ ...formData, jam_kerja: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-16 resize-none"
                placeholder="Senin - Jumat: 08.00 - 17.00&#10;Sabtu: 08.00 - 14.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1">Kode Embed Google Maps (Iframe HTML)</label>
            <textarea
              value={formData.gmaps_embed}
              onChange={(e) => setFormData({ ...formData, gmaps_embed: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-24 font-mono text-xs resize-none"
              placeholder='<iframe src="..." width="600" height="450" ...></iframe>'
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary hover:opacity-90 rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
