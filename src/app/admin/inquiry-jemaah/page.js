"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialInquiryJemaah, initialPaketWisata, negaraOptions } from "@/data/constant";
import Select from "react-select";
import Swal from "sweetalert2";

const statusOptions = [
  { value: "baru", label: "Baru" },
  { value: "follow_up", label: "Follow Up" },
  { value: "terdaftar", label: "Terdaftar" },
  { value: "ditolak", label: "Ditolak" }
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

export default function InquiryJemaahPage() {
  const router = useRouter();
  const [isLoggedIn] = useLocalStorage("adminLoggedIn", false);
  const [data, setData] = useLocalStorage("adminInquiryJemaah", initialInquiryJemaah);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    wa: "",
    wa_country: "+62",
    email: "",
    paket: "",
    status: "baru",
    tanggal: "",
  });

  const paketList = initialPaketWisata;

  useEffect(() => {
    if (!isLoggedIn) router.push("/admin/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      nama: "",
      wa: "",
      wa_country: "+62",
      email: "",
      paket: paketList[0]?.nama || "",
      status: "baru",
      tanggal: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    const [country = "+62", number = ""] = item.wa.split(/^(\+\d+)/).filter(Boolean);
    setFormData({
      nama: item.nama,
      wa: number,
      wa_country: country,
      email: item.email,
      paket: item.paket,
      status: item.status,
      tanggal: item.tanggal,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.wa && !formData.email) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Minimal salah satu dari WhatsApp atau Email harus diisi.",
      });
      return;
    }

    const newItem = {
      id: editingId || `iq-${Date.now()}`,
      nama: formData.nama,
      wa: formData.wa_country + formData.wa,
      email: formData.email,
      paket: formData.paket,
      status: formData.status,
      tanggal: formData.tanggal,
    };

    if (editingId) {
      setData(data.map((item) => (item.id === editingId ? newItem : item)));
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Inquiry berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setData([...data, newItem]);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Inquiry berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Inquiry ini akan dihapus secara permanen!",
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
          text: "Inquiry berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const openWhatsApp = (wa) => {
    const [country = "+62", number = ""] = wa.split(/^(\+\d+)/).filter(Boolean);
    const cleanNumber = country + number;
    window.open(`https://wa.me/${cleanNumber.replace(/\+/g, "")}`, "_blank");
  };

  const getStatusBadge = (status) => {
    const styles = {
      baru: "bg-blue-100 text-blue-800",
      follow_up: "bg-yellow-100 text-yellow-800",
      terdaftar: "bg-green-100 text-green-800",
      ditolak: "bg-red-100 text-red-800",
    };
    const labels = {
      baru: "Baru",
      follow_up: "Follow Up",
      terdaftar: "Terdaftar",
      ditolak: "Ditolak",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.baru}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div>
      <AdminHeader title="Inquiry Jamaah" onLogout={() => {
        localStorage.removeItem("adminLoggedIn");
        router.push("/admin/login");
      }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-on-surface-variant">
              Kelola inquiry dan pendaftaran jamaah
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Inquiry
          </button>
        </div>

        <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">WhatsApp</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Paket</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-primary">{item.nama}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {item.wa ? (
                        <button
                          onClick={() => openWhatsApp(item.wa)}
                          className="text-green-600 hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                          {item.wa}
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface">{item.email || "-"}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">{item.paket}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {new Date(item.tanggal).toLocaleDateString("id-ID")}
                    </td>
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
        title={editingId ? "Edit Inquiry Jamaah" : "Tambah Inquiry Jamaah"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Kode Negara</label>
              <Select
                value={{ value: formData.wa_country, label: formData.wa_country }}
                onChange={(selected) => setFormData({ ...formData, wa_country: selected.value })}
                options={negaraOptions.map((opt) => ({ value: opt.id, label: opt.id }))}
                styles={selectStyles}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primary mb-2">Nomor WhatsApp</label>
              <input
                type="tel"
                value={formData.wa}
                onChange={(e) => setFormData({ ...formData, wa: e.target.value })}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                placeholder="81234567890"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              placeholder="jamaah@example.com"
            />
            <p className="text-xs text-on-surface-variant mt-1">
              Isi salah satu WhatsApp atau Email
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Paket</label>
            <Select
              value={{ value: formData.paket, label: formData.paket }}
              onChange={(selected) => setFormData({ ...formData, paket: selected.value })}
              options={paketList.map((p) => ({ value: p.nama, label: p.nama }))}
              styles={selectStyles}
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
              <label className="block text-sm font-semibold text-primary mb-2">Tanggal</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
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
