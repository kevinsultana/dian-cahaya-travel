"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialPaketWisata } from "@/data/constant";
import Select from "react-select";
import Swal from "sweetalert2";

export default function PaketWisataPage() {
  const router = useRouter();
  const [isLoggedIn] = useLocalStorage("adminLoggedIn", false);
  const [data, setData] = useLocalStorage("adminPaketWisata", initialPaketWisata);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    durasi: "",
    harga: "",
    hotel: "",
    status: "active",
    tanggal_keberangkatan: "",
    quota: "",
    terpakai: "0",
  });

  useEffect(() => {
    if (!isLoggedIn) router.push("/admin/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama: "",
      durasi: "",
      harga: "",
      hotel: "",
      status: "active",
      tanggal_keberangkatan: "",
      quota: "",
      terpakai: "0",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      nama: item.nama,
      durasi: item.durasi,
      harga: item.harga.toString(),
      hotel: item.hotel,
      status: item.status,
      tanggal_keberangkatan: item.tanggal_keberangkatan,
      quota: item.quota.toString(),
      terpakai: item.terpakai.toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: editingId || `pw-${Date.now()}`,
      nama: formData.nama,
      durasi: formData.durasi,
      harga: Number(formData.harga),
      hotel: formData.hotel,
      status: formData.status,
      tanggal_keberangkatan: formData.tanggal_keberangkatan,
      quota: Number(formData.quota),
      terpakai: Number(formData.terpakai),
    };

    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? newItem : item)));
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Paket wisata berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setData([...data, newItem]);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Paket wisata berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setIsModalOpen(false);
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
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((item) => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Paket wisata berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const statusOptions = [
    { value: "active", label: "Aktif" },
    { value: "inactive", label: "Nonaktif" }
  ];

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#fff',
      borderColor: '#e2e8f0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      paddingTop: '2px',
      paddingBottom: '2px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#cbd5e1',
      }
    }),
    menu: (base) => ({
      ...base,
      fontSize: '0.875rem',
    })
  };

  return (
    <div>
      <AdminHeader title="Paket Wisata" onLogout={() => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/admin/login");
      }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-on-surface-variant">
              Kelola data paket wisata dan umroh
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Paket
          </button>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Paket</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Durasi</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hotel</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Keberangkatan</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Quota</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-primary">{item.nama}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">{item.durasi}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">{formatRupiah(item.harga)}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">{item.hotel}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {item.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {new Date(item.tanggal_keberangkatan).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">{item.terpakai}/{item.quota}</td>
                    <td className="px-6 py-4">
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
        title={editingId ? "Edit Paket Wisata" : "Tambah Paket Wisata"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Nama Paket</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Durasi</label>
              <input
                type="text"
                value={formData.durasi}
                onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                placeholder="9 Hari 8 Malam"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Harga (Rp)</label>
              <input
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Hotel</label>
            <input
              type="text"
              value={formData.hotel}
              onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Status</label>
              <Select
                value={statusOptions.find((opt) => opt.value === formData.status)}
                onChange={(selected) => setFormData({ ...formData, status: selected.value })}
                options={statusOptions}
                styles={selectStyles}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Tanggal Keberangkatan</label>
              <input
                type="date"
                value={formData.tanggal_keberangkatan}
                onChange={(e) => setFormData({ ...formData, tanggal_keberangkatan: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Quota</label>
              <input
                type="number"
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Terpakai</label>
              <input
                type="number"
                value={formData.terpakai}
                onChange={(e) => setFormData({ ...formData, terpakai: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                required
              />
            </div>
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
