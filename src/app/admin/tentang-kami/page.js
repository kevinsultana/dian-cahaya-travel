"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialTentangKami } from "@/data/constant";
import Swal from "sweetalert2";

export default function TentangKamiPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn] = useLocalStorage("adminLoggedIn", false);
  const [data, setData] = useLocalStorage("adminTentangKami", initialTentangKami);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    subjudul: "",
    deskripsi: "",
    visi: "",
    misi: "",
    nilai_perusahaan: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        const activeData = data || initialTentangKami;
        setFormData({
          judul: activeData.judul || "",
          subjudul: activeData.subjudul || "",
          deskripsi: activeData.deskripsi || "",
          visi: activeData.visi || "",
          misi: activeData.misi || "",
          nilai_perusahaan: Array.isArray(activeData.nilai_perusahaan)
            ? activeData.nilai_perusahaan.join(", ")
            : activeData.nilai_perusahaan || "",
        });
      }
    }
  }, [mounted, isLoggedIn, router, data]);

  if (!mounted || !isLoggedIn) return null;

  const openEditModal = () => {
    const activeData = data || initialTentangKami;
    setFormData({
      judul: activeData.judul || "",
      subjudul: activeData.subjudul || "",
      deskripsi: activeData.deskripsi || "",
      visi: activeData.visi || "",
      misi: activeData.misi || "",
      nilai_perusahaan: Array.isArray(activeData.nilai_perusahaan)
        ? activeData.nilai_perusahaan.join(", ")
        : activeData.nilai_perusahaan || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      judul: formData.judul,
      subjudul: formData.subjudul,
      deskripsi: formData.deskripsi,
      visi: formData.visi,
      misi: formData.misi,
      nilai_perusahaan: formData.nilai_perusahaan
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setData(updatedData);
    setIsModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Informasi Tentang Kami berhasil diperbarui.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const activeData = data || initialTentangKami;

  return (
    <div>
      <AdminHeader
        title="Tentang Kami"
        onLogout={() => {
          localStorage.removeItem("adminLoggedIn");
          router.push("/admin/login");
        }}
      />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-on-surface-variant">
              Kelola konten dan informasi tentang profil perusahaan Anda
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Tentang Kami
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 space-y-6 max-w-4xl">
          <div className="border-b border-outline-variant pb-4">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Judul Utama Halaman</h3>
            <p className="text-lg font-bold text-on-surface">{activeData.judul}</p>
          </div>

          <div className="border-b border-outline-variant pb-4">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Subjudul</h3>
            <p className="text-base text-on-surface">{activeData.subjudul}</p>
          </div>

          <div className="border-b border-outline-variant pb-4">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Deskripsi Utama</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{activeData.deskripsi}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline-variant pb-4">
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Visi</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{activeData.visi}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Misi</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{activeData.misi}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Nilai Perusahaan</h3>
            <div className="flex flex-wrap gap-2">
              {(activeData.nilai_perusahaan || []).map((val, idx) => (
                <span
                  key={idx}
                  className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/10"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Tentang Kami"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Judul Halaman</label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Subjudul</label>
            <input
              type="text"
              value={formData.subjudul}
              onChange={(e) => setFormData({ ...formData, subjudul: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-32 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Visi</label>
              <textarea
                value={formData.visi}
                onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-24 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Misi</label>
              <textarea
                value={formData.misi}
                onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-24 resize-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">
              Nilai Perusahaan <span className="font-normal text-on-surface-variant">(pisah dengan koma)</span>
            </label>
            <input
              type="text"
              value={formData.nilai_perusahaan}
              onChange={(e) => setFormData({ ...formData, nilai_perusahaan: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              placeholder="Amanah, Profesional, Terpercaya"
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
              className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary hover:opacity-90 rounded-lg transition-all cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
