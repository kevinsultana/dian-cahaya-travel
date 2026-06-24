"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import Select from "react-select";
import Swal from "sweetalert2";
import ImageUpload from "@/components/admin/ImageUpload";

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#fff",
    borderColor: "#e2e8f0",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    paddingTop: "2px",
    paddingBottom: "2px",
    boxShadow: "none",
    "&:hover": { borderColor: "#cbd5e1" },
  }),
  menu: (base) => ({ ...base, fontSize: "0.875rem" }),
};

export default function BannerPromoPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ judul: "", subjudul: "", gambar: "", tautan: "", status: "aktif" });

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.push("/admin/login");
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/banner-promo");
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data banner promo." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) fetchData();
  }, [mounted, isLoggedIn, fetchData]);

  if (!mounted || !isLoggedIn) return null;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ judul: "", subjudul: "", gambar: "", tautan: "", status: "aktif" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ judul: item.judul, subjudul: item.subjudul, gambar: item.gambar, tautan: item.tautan, status: item.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/banner-promo/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      } else {
        res = await fetch("/api/banner-promo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      }
      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      await fetchData();
      Swal.fire({ icon: "success", title: "Berhasil!", text: editingId ? "Banner promo berhasil diperbarui." : "Banner promo berhasil ditambahkan.", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan data." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?", text: "Banner promo ini akan dihapus secara permanen!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!", cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/banner-promo/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          await fetchData();
          Swal.fire({ icon: "success", title: "Terhapus!", text: "Banner promo berhasil dihapus.", timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Gagal menghapus data." });
        }
      }
    });
  };

  return (
    <div>
      <AdminHeader title="Banner Promo" onLogout={() => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-on-surface-variant">Kelola banner promo website</p>
          <button onClick={openAddModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Banner
          </button>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-on-surface-variant">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Gambar</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tautan</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-primary">{item.judul}</td>
                      <td className="px-6 py-4"><img src={item.gambar} alt={item.judul} className="w-20 h-12 object-cover rounded-lg" /></td>
                      <td className="px-6 py-4 text-sm text-on-surface">{item.tautan}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {item.status === "aktif" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(item)} className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-on-surface-variant">Belum ada data banner promo.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Banner Promo" : "Tambah Banner Promo"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Judul</label>
            <input type="text" value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Subjudul</label>
            <textarea value={formData.subjudul} onChange={(e) => setFormData({ ...formData, subjudul: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-24 resize-none" required />
          </div>
          <ImageUpload
            label="Foto Banner Promo"
            value={formData.gambar}
            onChange={(url) => setFormData({ ...formData, gambar: url })}
            folder="banner-promo"
          />
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Tautan</label>
            <input type="text" value={formData.tautan} onChange={(e) => setFormData({ ...formData, tautan: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Status</label>
            <Select value={statusOptions.find((o) => o.value === formData.status)} onChange={(s) => setFormData({ ...formData, status: s.value })} options={statusOptions} styles={selectStyles} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-surface border border-outline-variant text-on-surface-variant py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-variant transition-all">Batal</button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60">{saving ? "Menyimpan..." : "Simpan"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
