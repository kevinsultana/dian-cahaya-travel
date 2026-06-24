"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import Swal from "sweetalert2";

export default function TentangKamiPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeData, setActiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ judul: "", subjudul: "", deskripsi: "", visi: "", misi: "", nilai_perusahaan: "" });

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.push("/admin/login");
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tentang-kami");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setActiveData(json);
      setFormData({
        judul: json.judul || "",
        subjudul: json.subjudul || "",
        deskripsi: json.deskripsi || "",
        visi: json.visi || "",
        misi: json.misi || "",
        nilai_perusahaan: Array.isArray(json.nilai_perusahaan) ? json.nilai_perusahaan.join(", ") : json.nilai_perusahaan || "",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data tentang kami." });
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
      judul: activeData.judul || "",
      subjudul: activeData.subjudul || "",
      deskripsi: activeData.deskripsi || "",
      visi: activeData.visi || "",
      misi: activeData.misi || "",
      nilai_perusahaan: Array.isArray(activeData.nilai_perusahaan) ? activeData.nilai_perusahaan.join(", ") : activeData.nilai_perusahaan || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      nilai_perusahaan: formData.nilai_perusahaan.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/tentang-kami", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      await fetchData();
      Swal.fire({ icon: "success", title: "Berhasil!", text: "Informasi Tentang Kami berhasil diperbarui.", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan data." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Tentang Kami" onLogout={() => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-on-surface-variant">Kelola konten dan informasi tentang profil perusahaan Anda</p>
          <button onClick={openEditModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Tentang Kami
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-on-surface-variant">Memuat data...</div>
        ) : (
          <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 space-y-6 max-w-4xl">
            <div className="border-b border-outline-variant pb-4">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Judul Utama Halaman</h3>
              <p className="text-lg font-bold text-on-surface">{activeData?.judul}</p>
            </div>
            <div className="border-b border-outline-variant pb-4">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Subjudul</h3>
              <p className="text-base text-on-surface">{activeData?.subjudul}</p>
            </div>
            <div className="border-b border-outline-variant pb-4">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Deskripsi Utama</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{activeData?.deskripsi}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline-variant pb-4">
              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Visi</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{activeData?.visi}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Misi</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{activeData?.misi}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Nilai Perusahaan</h3>
              <div className="flex flex-wrap gap-2">
                {(activeData?.nilai_perusahaan || []).map((val, idx) => (
                  <span key={idx} className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/10">{val}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Tentang Kami">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Judul Halaman</label>
            <input type="text" value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Subjudul</label>
            <input type="text" value={formData.subjudul} onChange={(e) => setFormData({ ...formData, subjudul: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Deskripsi</label>
            <textarea value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-32 resize-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Visi</label>
              <textarea value={formData.visi} onChange={(e) => setFormData({ ...formData, visi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-24 resize-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Misi</label>
              <textarea value={formData.misi} onChange={(e) => setFormData({ ...formData, misi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-24 resize-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Nilai Perusahaan <span className="font-normal text-on-surface-variant">(pisah dengan koma)</span>
            </label>
            <input type="text" value={formData.nilai_perusahaan} onChange={(e) => setFormData({ ...formData, nilai_perusahaan: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="Amanah, Profesional, Terpercaya" required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all cursor-pointer">Batal</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary hover:opacity-90 rounded-lg transition-all cursor-pointer disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
