"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import Select from "react-select";
import Swal from "sweetalert2";
import CurrencyInput from "@/components/admin/CurrencyInput";
import ImageUpload from "@/components/admin/ImageUpload";

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

const emptyForm = {
  nama: "",
  durasi: "",
  harga: 0,
  hotel_makkah: "",
  hotel_madinah: "",
  status: "active",
  tanggal_keberangkatan: "",
  quota: "",
  terpakai: "0",
  featured: false,
  deskripsi: "",
  gambar: "",
  badge: "",
  category: "Reguler",
  airline: "",
};

export default function PaketWisataPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    setMounted(true);
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (!loggedIn) router.push("/admin/login");
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/paket-wisata");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const json = await res.json();
      setData(json);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data paket wisata." });
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
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      durasi: item.durasi,
      harga: item.harga || 0,
      hotel_makkah: item.hotel_makkah || "",
      hotel_madinah: item.hotel_madinah || "",
      status: item.status,
      tanggal_keberangkatan: item.tanggal_keberangkatan,
      quota: item.quota.toString(),
      terpakai: item.terpakai.toString(),
      featured: item.featured || false,
      deskripsi: item.deskripsi || "",
      gambar: item.gambar || "",
      badge: item.badge || "",
      category: item.category || "Reguler",
      airline: item.airline || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      harga: Number(formData.harga),
      quota: Number(formData.quota),
      terpakai: Number(formData.terpakai),
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/paket-wisata/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/paket-wisata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      await fetchData();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: editingId ? "Paket wisata berhasil diperbarui." : "Paket wisata berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan data." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/paket-wisata/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          await fetchData();
          Swal.fire({ icon: "success", title: "Terhapus!", text: "Paket wisata berhasil dihapus.", timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Gagal menghapus data." });
        }
      }
    });
  };

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);

  const statusOptions = [
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Nonaktif" },
  ];

  return (
    <div>
      <AdminHeader title="Paket Wisata" onLogout={() => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-on-surface-variant">Kelola data paket wisata dan umroh</p>
          <button onClick={openAddModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Paket
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
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Paket</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Durasi</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Harga</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hotel Mekkah / Madinah</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Keberangkatan</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Quota</th>
                    <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-primary">
                        <div className="flex flex-col gap-1">
                          <span>{item.nama}</span>
                          {item.featured && (
                            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-800">
                              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                              Unggulan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{item.durasi}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">{formatRupiah(item.harga)}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        <div className="flex flex-col gap-0.5 text-xs">
                          <span className="font-semibold text-primary/85">Mekkah: <span className="font-normal text-on-surface">{item.hotel_makkah}</span></span>
                          <span className="font-semibold text-primary/85">Madinah: <span className="font-normal text-on-surface">{item.hotel_madinah}</span></span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {item.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">
                        {new Date(item.tanggal_keberangkatan).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{item.terpakai}/{item.quota}</td>
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
                    <tr><td colSpan="8" className="px-6 py-10 text-center text-sm text-on-surface-variant">Belum ada data paket wisata.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Paket Wisata" : "Tambah Paket Wisata"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Nama Paket</label>
            <input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary cursor-pointer" />
            <label htmlFor="featured" className="text-sm font-semibold text-primary select-none cursor-pointer">Tampilkan sebagai Paket Unggulan (Featured) di Homepage</label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Deskripsi Singkat</label>
            <textarea value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-20 resize-none" placeholder="Deskripsi singkat..." />
          </div>

          <div className="space-y-4">
            <ImageUpload
              label="Foto Paket Wisata"
              value={formData.gambar}
              onChange={(url) => setFormData({ ...formData, gambar: url })}
              folder="paket-wisata"
            />
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Badge Paket</label>
              <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="misal: Best Seller" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Kategori Paket</label>
              <Select value={{ value: formData.category, label: formData.category }} onChange={(s) => setFormData({ ...formData, category: s.value })} options={["Reguler","Plus","Plus Turki","Ramadhan","Ekonomi","Haji Furoda"].map((v) => ({ value: v, label: v }))} styles={selectStyles} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Maskapai Penerbangan</label>
              <input type="text" value={formData.airline} onChange={(e) => setFormData({ ...formData, airline: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="misal: Saudi Airlines" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Durasi</label>
              <input type="text" value={formData.durasi} onChange={(e) => setFormData({ ...formData, durasi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="9 Hari 8 Malam" required />
            </div>
            <CurrencyInput label="Harga (Rp)" value={formData.harga} onChange={(val) => setFormData({ ...formData, harga: val })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Hotel Mekkah</label>
              <input type="text" value={formData.hotel_makkah} onChange={(e) => setFormData({ ...formData, hotel_makkah: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="misal: Movenpick Hajar Tower" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Hotel Madinah</label>
              <input type="text" value={formData.hotel_madinah} onChange={(e) => setFormData({ ...formData, hotel_madinah: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="misal: Al Aqeeq Madinah" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Status</label>
              <Select value={statusOptions.find((o) => o.value === formData.status)} onChange={(s) => setFormData({ ...formData, status: s.value })} options={statusOptions} styles={selectStyles} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Tanggal Keberangkatan</label>
              <input type="date" value={formData.tanggal_keberangkatan} onChange={(e) => setFormData({ ...formData, tanggal_keberangkatan: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Quota</label>
              <input type="number" value={formData.quota} onChange={(e) => setFormData({ ...formData, quota: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Terpakai</label>
              <input type="number" value={formData.terpakai} onChange={(e) => setFormData({ ...formData, terpakai: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
            </div>
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
