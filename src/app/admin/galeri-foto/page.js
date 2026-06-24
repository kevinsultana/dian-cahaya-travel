"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialGaleriFoto } from "@/data/constant";
import Swal from "sweetalert2";

export default function GaleriFotoPage() {
  const router = useRouter();
  const [isLoggedIn] = useLocalStorage("adminLoggedIn", false);
  const [data, setData] = useLocalStorage("adminGaleriFoto", initialGaleriFoto);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    urutan: 1,
  });
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If the data in localStorage has items without IDs, fix them to prevent future duplicates
    if (data && data.some(item => !item.id)) {
      const fixedData = data.map((item, idx) => ({
        ...item,
        id: item.id || `gf-migrated-${idx}-${Date.now()}`,
        urutan: item.urutan || (idx + 1)
      }));
      setData(fixedData);
    }
  }, [data, setData]);

  useEffect(() => {
    if (mounted && !isLoggedIn) router.push("/admin/login");
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) return null;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ src: "", alt: "", urutan: data.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ src: item.src, alt: item.alt, urutan: item.urutan });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, src: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editingId || `gf-${Date.now()}`,
      src: formData.src,
      alt: formData.alt,
      urutan: Number(formData.urutan),
    };

    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? newItem : item)));
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Foto galeri berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setData([...data, newItem]);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Foto galeri berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Foto ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Foto galeri berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handlePreviewImage = (item) => {
    Swal.fire({
      imageUrl: item.src,
      imageAlt: item.alt,
      title: item.alt,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#3085d6",
    });
  };

  const sortedData = [...data].sort((a, b) => a.urutan - b.urutan);

  return (
    <div>
      <AdminHeader title="Galeri Foto" onLogout={() => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/admin/login");
      }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-on-surface-variant">
              Kelola dokumentasi foto jamaah
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Foto
          </button>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-20">No.</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Deskripsi (Alt Text)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-28">Urutan</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-36">Gambar</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {sortedData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-on-surface">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-primary font-medium">{item.alt}</td>
                    <td className="px-6 py-4 text-sm text-on-surface font-semibold">{item.urutan}</td>
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => handlePreviewImage(item)}
                        className="relative w-16 h-10 rounded-lg overflow-hidden border border-outline-variant/60 shadow-sm cursor-zoom-in hover:scale-105 transition-transform"
                        title="Klik untuk memperbesar"
                      >
                        <img 
                          src={item.src} 
                          alt={item.alt} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Foto</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            />
            {formData.src && (
              <div className="mt-3">
                <img src={formData.src} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Alt Text / Caption</label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Urutan</label>
            <input
              type="number"
              value={formData.urutan}
              onChange={(e) => setFormData({ ...formData, urutan: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-surface border border-outline-variant text-on-surface-variant py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-variant transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
