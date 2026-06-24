"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import Swal from "sweetalert2";
import ImageUpload from "@/components/admin/ImageUpload";

export default function TentangKamiPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Tentang Kami States
  const [activeData, setActiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    judul: "", 
    subjudul: "", 
    deskripsi: "", 
    visi: "", 
    misi: "", 
    nilai_perusahaan: "",
    gambar: ""
  });

  // Team Member States
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamSaving, setTeamSaving] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamFormData, setTeamFormData] = useState({
    nama: "",
    jabatan: "",
    foto: "",
    urutan: 1,
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
        gambar: json.gambar || "",
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data tentang kami." });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeam = useCallback(async () => {
    try {
      setTeamLoading(true);
      const res = await fetch("/api/team-member");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setTeamMembers(json);
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal memuat data anggota tim." });
    } finally {
      setTeamLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mounted && isLoggedIn) {
      fetchData();
      fetchTeam();
    }
  }, [mounted, isLoggedIn, fetchData, fetchTeam]);

  if (!mounted || !isLoggedIn) return null;

  // -- handlers TENTANG KAMI --
  const openEditModal = () => {
    if (!activeData) return;
    setFormData({
      judul: activeData.judul || "",
      subjudul: activeData.subjudul || "",
      deskripsi: activeData.deskripsi || "",
      visi: activeData.visi || "",
      misi: activeData.misi || "",
      nilai_perusahaan: Array.isArray(activeData.nilai_perusahaan) ? activeData.nilai_perusahaan.join(", ") : activeData.nilai_perusahaan || "",
      gambar: activeData.gambar || "",
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
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan data tentang kami." });
    } finally {
      setSaving(false);
    }
  };

  // -- handlers TIM KAMI --
  const openAddTeamModal = () => {
    setEditingTeamId(null);
    setTeamFormData({ nama: "", jabatan: "", foto: "", urutan: teamMembers.length + 1 });
    setIsTeamModalOpen(true);
  };

  const openEditTeamModal = (item) => {
    setEditingTeamId(item.id);
    setTeamFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      foto: item.foto || "",
      urutan: item.urutan || 1,
    });
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    setTeamSaving(true);

    try {
      let res;
      if (editingTeamId) {
        res = await fetch(`/api/team-member/${editingTeamId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamFormData),
        });
      } else {
        res = await fetch("/api/team-member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamFormData),
        });
      }

      if (!res.ok) throw new Error();
      setIsTeamModalOpen(false);
      await fetchTeam();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: editingTeamId ? "Anggota tim berhasil diperbarui." : "Anggota tim berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Gagal menyimpan data anggota tim." });
    } finally {
      setTeamSaving(false);
    }
  };

  const handleTeamDelete = (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anggota tim ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/team-member/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error();
          await fetchTeam();
          Swal.fire({ icon: "success", title: "Terhapus!", text: "Anggota tim berhasil dihapus.", timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ icon: "error", title: "Error", text: "Gagal menghapus data." });
        }
      }
    });
  };

  return (
    <div>
      <AdminHeader title="Tentang Kami & Tim" onLogout={() => { localStorage.removeItem("adminLoggedIn"); router.push("/admin/login"); }} />

      <main className="p-8 space-y-12">
        {/* SECTION 1: PROFIL PERUSAHAAN (SINGLETON) */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-primary">Profil Perusahaan</h2>
              <p className="text-xs text-on-surface-variant">Kelola konten dan informasi tentang visi-misi perusahaan Anda</p>
            </div>
            <button onClick={openEditModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Informasi
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-on-surface-variant bg-white border border-outline-variant rounded-xl shadow-sm">Memuat data...</div>
          ) : (
            <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 space-y-6 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left col: Image info */}
                <div className="md:col-span-1 space-y-2">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Gambar / Ilustrasi Halaman</h3>
                  {activeData?.gambar ? (
                    <div className="w-full h-48 rounded-xl overflow-hidden border border-outline-variant">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={activeData.gambar} alt="Preview Halaman" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-surface-container flex flex-col items-center justify-center border border-outline-variant/60 text-on-surface-variant/40">
                      <span className="material-symbols-outlined text-4xl">image</span>
                      <span className="text-[10px] mt-1">Belum ada gambar</span>
                    </div>
                  )}
                </div>

                {/* Right col: Text info */}
                <div className="md:col-span-2 space-y-4">
                  <div className="border-b border-outline-variant pb-3">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Judul Utama Halaman</h3>
                    <p className="text-base font-bold text-on-surface">{activeData?.judul}</p>
                  </div>
                  <div className="border-b border-outline-variant pb-3">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Subjudul</h3>
                    <p className="text-sm text-on-surface">{activeData?.subjudul}</p>
                  </div>
                  <div className="border-b border-outline-variant pb-3">
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Deskripsi Utama</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-line">{activeData?.deskripsi}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-outline-variant pb-4">
                <div>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Visi</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{activeData?.visi}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Misi</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{activeData?.misi}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Nilai Perusahaan</h3>
                <div className="flex flex-wrap gap-2">
                  {(activeData?.nilai_perusahaan || []).map((val, idx) => (
                    <span key={idx} className="bg-primary/5 text-primary text-[10px] font-semibold px-3 py-1 rounded-full border border-primary/10">{val}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: TIM KAMI (CRUD LIST) */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-primary">Anggota Tim Kami</h2>
              <p className="text-xs text-on-surface-variant">Kelola daftar profil tim, direksi, and pembimbing jemaah</p>
            </div>
            <button onClick={openAddTeamModal} className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Tambah Anggota Tim
            </button>
          </div>

          <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden max-w-5xl">
            {teamLoading ? (
              <div className="p-12 text-center text-sm text-on-surface-variant">Memuat data tim...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-container-low text-left">
                      <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-16">No.</th>
                      <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-20">Foto</th>
                      <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Lengkap</th>
                      <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Jabatan / Role</th>
                      <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-20">Urutan</th>
                      <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {teamMembers.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4 text-xs font-medium text-on-surface">{idx + 1}</td>
                        <td className="px-6 py-4">
                          {item.foto ? (
                            <img src={item.foto} alt={item.nama} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center text-xs font-bold uppercase">
                              {item.nama.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-primary">{item.nama}</td>
                        <td className="px-6 py-4 text-sm text-on-surface">{item.jabatan}</td>
                        <td className="px-6 py-4 text-sm text-on-surface font-semibold">{item.urutan}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditTeamModal(item)} className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Edit">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button onClick={() => handleTeamDelete(item.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer" title="Hapus">
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {teamMembers.length === 0 && (
                      <tr><td colSpan="6" className="px-6 py-10 text-center text-sm text-on-surface-variant">Belum ada anggota tim terdaftar.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* MODAL 1: EDIT TENTANG KAMI */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Profil Perusahaan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            label="Gambar Ilustrasi Profil Halaman"
            value={formData.gambar}
            onChange={(url) => setFormData({ ...formData, gambar: url })}
            folder="tentang-kami"
          />
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
            <textarea value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-28 resize-none" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Visi</label>
              <textarea value={formData.visi} onChange={(e) => setFormData({ ...formData, visi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-20 resize-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Misi</label>
              <textarea value={formData.misi} onChange={(e) => setFormData({ ...formData, misi: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-20 resize-none" required />
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

      {/* MODAL 2: CRUD TIM KAMI */}
      <Modal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} title={editingTeamId ? "Edit Anggota Tim" : "Tambah Anggota Tim"}>
        <form onSubmit={handleTeamSubmit} className="space-y-4">
          <ImageUpload
            label="Foto Anggota Tim (opsional)"
            value={teamFormData.foto}
            onChange={(url) => setTeamFormData({ ...teamFormData, foto: url })}
            folder="tim"
          />
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Nama Lengkap</label>
            <input type="text" value={teamFormData.nama} onChange={(e) => setTeamFormData({ ...teamFormData, nama: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Jabatan / Role</label>
            <input type="text" value={teamFormData.jabatan} onChange={(e) => setTeamFormData({ ...teamFormData, jabatan: e.target.value })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" placeholder="misal: Pembimbing Ibadah" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">No. Urutan Tampil</label>
            <input type="number" value={teamFormData.urutan} onChange={(e) => setTeamFormData({ ...teamFormData, urutan: Number(e.target.value) })} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" min="1" required />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button type="button" onClick={() => setIsTeamModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all cursor-pointer">Batal</button>
            <button type="submit" disabled={teamSaving} className="px-4 py-2 text-sm font-semibold bg-primary text-on-primary hover:opacity-90 rounded-lg transition-all cursor-pointer disabled:opacity-60">
              {teamSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
