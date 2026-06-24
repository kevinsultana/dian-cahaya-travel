"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import Swal from "sweetalert2";

export default function GaleriFotoPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ src: "", alt: "", urutan: 1 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.push("/admin/login");
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/galeri-foto");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data galeri foto." });
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
      reader.onloadend = () => setFormData((prev) => ({ ...prev, src: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { src: formData.src, alt: formData.alt, urutan: Number(formData.urutan) };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/galeri-foto/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/galeri-foto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      await fetchData();
      Swal.fire({ icon: "success", title: "Berhasil!", text: editingId ? "Foto berhasil diperbarui." : "Foto berhasil ditambahkan.", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan foto." });
    } finally {
      setSaving(false);
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/galeri-foto/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          await fetchData();
          Swal.fire({ icon: "success", title: "Terhapus!", text: "Foto berhasil dihapus.", timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Gagal menghapus foto." });
        }
      }
    });
  };

  const handlePreviewImage = (item) => {
    Swal.fire({ imageUrl: item.src, imageAlt: item.alt, title: item.alt, confirmButtonText: "Tutup", confirmButtonColor: "#3085d6" });
  };

  const sortedData = [...data].sort((a, b) => a.urutan - b.urutan);

  return (
    <div>
      <AdminHeader title="Galeri Foto" onLogout={() => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-on-surface-variant">Kelola dokumentasi foto jamaah</p>
          <button onClick={openAddModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Foto
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
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-20">No.</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Deskripsi (Alt Text)</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-28">Urutan</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-36">Gambar</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {sortedData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-on-surface">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-primary font-medium">{item.alt}</td>
                      <td className="px-6 py-4 text-sm text-on-surface font-semibold">{item.urutan}</td>
                      <td className="px-6 py-4">
                        <div onClick={() => handlePreviewImage(item)} className="relative w-16 h-10 rounded-lg overflow-hidden border border-outline-variant/60 shadow-sm cursor-zoom-in hover:scale-105 transition-transform" title="Klik untuk memperbesar">
                          <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(item)} className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer" title="Hapus">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-sm text-on-surface-variant">Belum ada foto galeri.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Foto Galeri" : "Tambah Foto Galeri"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Foto</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" />
            {formData.src && (
              <div className="mt-3"><img src={formData.src} alt="Preview" className="w-full h-32 object-cover rounded-lg" /></div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Alt Text / Caption</label>
            <input type="text" value={formData.alt} onChange={(e) => setFormData({ ...formData, alt: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Urutan</label>
            <input type="number" value={formData.urutan} onChange={(e) => setFormData({ ...formData, urutan: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-surface border border-outline-variant text-on-surface-variant py-2.5 rounded-lg text-sm font-semibold hover:bg-surface-variant transition-all">Batal</button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
