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

  useEffect(() => {
    if (!isLoggedIn) router.push("/admin/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden group">
              <div
                className="w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.src})` }}
              />
              <div className="p-4">
                <p className="text-sm font-medium text-primary line-clamp-1">{item.alt}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-on-surface-variant">Urutan: {item.urutan}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
