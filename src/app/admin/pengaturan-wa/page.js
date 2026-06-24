"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import Modal from "@/components/admin/Modal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialPengaturanWa, negaraOptions } from "@/data/constant";
import Select from "react-select";
import Swal from "sweetalert2";

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

export default function PengaturanWaPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn] = useLocalStorage("adminLoggedIn", false);
  const [data, setData] = useLocalStorage("adminPengaturanWa", initialPengaturanWa);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    prefix: "+62",
    number: "",
    pesan_template: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        const activeData = data || initialPengaturanWa;
        const rawNumber = activeData.nomor || "";
        const countryMatch = rawNumber.match(/^\+\d+/);
        const prefix = countryMatch ? countryMatch[0] : "+62";
        const number = rawNumber.replace(/^\+\d+/, "");

        setFormData({
          prefix,
          number,
          pesan_template: activeData.pesan_template || "",
        });
      }
    }
  }, [mounted, isLoggedIn, router, data]);

  if (!mounted || !isLoggedIn) return null;

  const openEditModal = () => {
    const activeData = data || initialPengaturanWa;
    const rawNumber = activeData.nomor || "";
    const countryMatch = rawNumber.match(/^\+\d+/);
    const prefix = countryMatch ? countryMatch[0] : "+62";
    const number = rawNumber.replace(/^\+\d+/, "");

    setFormData({
      prefix,
      number,
      pesan_template: activeData.pesan_template || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      nomor: formData.prefix + formData.number,
      pesan_template: formData.pesan_template,
    };

    setData(updatedData);
    setIsModalOpen(false);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Pengaturan WhatsApp berhasil disimpan.",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const activeData = data || initialPengaturanWa;
  const formattedPhone = activeData.nomor?.startsWith("62") ? `+62 ${activeData.nomor.slice(2)}` : activeData.nomor;

  return (
    <div>
      <AdminHeader
        title="Pengaturan WhatsApp"
        onLogout={() => {
          localStorage.removeItem("adminLoggedIn");
          router.push("/admin/login");
        }}
      />

      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-on-surface-variant">
              Atur nomor WhatsApp dan pesan template awal untuk tombol chat di website Anda
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Pengaturan WA
          </button>
        </div>

        {/* Preview Card */}
        <div className="bg-white rounded-xl border border-outline-variant shadow-sm p-8 space-y-6 max-w-2xl">
          <div className="border-b border-outline-variant pb-4">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Nomor WhatsApp Admin</h3>
            <p className="text-lg font-bold text-on-surface">{formattedPhone}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Pesan Template Awal</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line bg-surface p-4 rounded-lg border border-outline-variant/30">
              {activeData.pesan_template}
            </p>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Pengaturan WA"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Nomor WhatsApp Admin</label>
            <div className="flex gap-3 items-center">
              <div className="w-36">
                <Select
                  value={{ value: formData.prefix, label: formData.prefix }}
                  onChange={(selected) => setFormData({ ...formData, prefix: selected.value })}
                  options={negaraOptions.map((opt) => ({ value: opt.id, label: opt.id }))}
                  styles={selectStyles}
                />
              </div>
              <input
                type="tel"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                placeholder="81234567890"
                required
              />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Nomor ini akan digunakan sebagai target chat WhatsApp oleh pengunjung website.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Pesan Template Awal</label>
            <textarea
              value={formData.pesan_template}
              onChange={(e) => setFormData({ ...formData, pesan_template: e.target.value })}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all text-sm h-32 resize-none"
              required
            />
            <p className="text-xs text-on-surface-variant mt-2">
              Pesan default yang otomatis terisi saat calon jamaah menekan tombol WhatsApp.
            </p>
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
