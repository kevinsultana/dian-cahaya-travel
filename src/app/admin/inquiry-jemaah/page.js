"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import { negaraOptions } from "@/data/constant";
import Select from "react-select";
import Swal from "sweetalert2";

const statusOptions = [
  { value: "baru", label: "Baru" },
  { value: "follow_up", label: "Follow Up" },
  { value: "terdaftar", label: "Terdaftar" },
  { value: "ditolak", label: "Ditolak" },
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

export default function InquiryJemaahPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);
  const [paketList, setPaketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama: "", wa: "", wa_country: "+62", email: "", paket: "", status: "baru", tanggal: "",
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
      const [inquiryRes, paketRes] = await Promise.all([
        fetch("/api/inquiry-jemaah"),
        fetch("/api/paket-wisata"),
      ]);
      if (!inquiryRes.ok || !paketRes.ok) throw new Error();
      const [inquiry, paket] = await Promise.all([inquiryRes.json(), paketRes.json()]);
      setData(inquiry);
      setPaketList(paket);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data." });
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
    setFormData({
      nama: "", wa: "", wa_country: "+62", email: "",
      paket: paketList[0]?.nama || "",
      status: "baru",
      tanggal: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    const [country = "+62", number = ""] = item.wa.split(/^(\+\d+)/).filter(Boolean);
    setFormData({ nama: item.nama, wa: number, wa_country: country, email: item.email, paket: item.paket, status: item.status, tanggal: item.tanggal });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wa && !formData.email) {
      Swal.fire({ icon: "warning", title: "Peringatan", text: "Minimal salah satu dari WhatsApp atau Email harus diisi." });
      return;
    }
    setSaving(true);
    const payload = {
      nama: formData.nama,
      wa: formData.wa_country + formData.wa,
      email: formData.email,
      paket: formData.paket,
      status: formData.status,
      tanggal: formData.tanggal,
    };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/inquiry-jemaah/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch("/api/inquiry-jemaah", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      if (!res.ok) throw new Error();
      setIsModalOpen(false);
      await fetchData();
      Swal.fire({ icon: "success", title: "Berhasil!", text: editingId ? "Inquiry berhasil diperbarui." : "Inquiry berhasil ditambahkan.", timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan data." });
    } finally {
      setSaving(false);
    }
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/inquiry-jemaah/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          await fetchData();
          Swal.fire({ icon: "success", title: "Terhapus!", text: "Inquiry berhasil dihapus.", timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Gagal menghapus data." });
        }
      }
    });
  };

  const openWhatsApp = (item) => {
    const wa = item.wa || "";
    const [country = "+62", number = ""] = wa.split(/^(\+\d+)/).filter(Boolean);
    const cleanNumber = country + number;
    const formattedDate = new Date(item.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const message = `Assalamualaikum ${item.nama}, kami ingin memfollow up pendaftaran Anda untuk ${item.paket} pada tanggal ${formattedDate}. Apakah ada yang bisa kami bantu?`;
    window.open(`https://wa.me/${cleanNumber.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const getStatusBadge = (status) => {
    const styles = { baru: "bg-blue-100 text-blue-800", follow_up: "bg-yellow-100 text-yellow-800", terdaftar: "bg-green-100 text-green-800", ditolak: "bg-red-100 text-red-800" };
    const labels = { baru: "Baru", follow_up: "Follow Up", terdaftar: "Terdaftar", ditolak: "Ditolak" };
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.baru}`}>{labels[status] || status}</span>;
  };

  return (
    <div>
      <AdminHeader title="Inquiry Jamaah" onLogout={() => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); }} />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-on-surface-variant">Kelola inquiry dan pendaftaran jamaah</p>
          <button onClick={openAddModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tambah Inquiry
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
                          <button onClick={() => openWhatsApp(item)} className="text-green-600 hover:underline flex items-center gap-1 cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                            {item.wa}
                          </button>
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface">{item.email || "-"}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">{item.paket}</td>
                      <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-sm text-on-surface">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
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
                    <tr><td colSpan="7" className="px-6 py-10 text-center text-sm text-on-surface-variant">Belum ada data inquiry jemaah.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Inquiry Jamaah" : "Tambah Inquiry Jamaah"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Nama Lengkap</label>
            <input type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Kode Negara</label>
              <Select value={{ value: formData.wa_country, label: formData.wa_country }} onChange={(s) => setFormData({ ...formData, wa_country: s.value })} options={negaraOptions.map((o) => ({ value: o.id, label: o.id }))} styles={selectStyles} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-primary mb-2">Nomor WhatsApp</label>
              <input type="tel" value={formData.wa} onChange={(e) => setFormData({ ...formData, wa: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="81234567890" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="jamaah@example.com" />
            <p className="text-xs text-on-surface-variant mt-1">Isi salah satu WhatsApp atau Email</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Paket</label>
            <Select value={{ value: formData.paket, label: formData.paket }} onChange={(s) => setFormData({ ...formData, paket: s.value })} options={paketList.map((p) => ({ value: p.nama, label: p.nama }))} styles={selectStyles} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Status</label>
              <Select value={statusOptions.find((o) => o.value === formData.status)} onChange={(s) => setFormData({ ...formData, status: s.value })} options={statusOptions} styles={selectStyles} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Tanggal</label>
              <input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
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
