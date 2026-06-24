"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import Select from "react-select";
import Swal from "sweetalert2";

const subjectOptions = [
  { value: "Informasi Paket Umrah", label: "Informasi Paket Umrah" },
  { value: "Pendaftaran Umrah", label: "Pendaftaran Umrah" },
  { value: "Konsultasi", label: "Konsultasi" },
  { value: "Kerjasama", label: "Kerjasama" },
  { value: "Lainnya", label: "Lainnya" }
];

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    paddingTop: '4px',
    paddingBottom: '4px',
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

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih subjek pesan terlebih dahulu.",
      });
      return;
    }
    // Simulasi submit
    setSubmitted(true);
    Swal.fire({
      icon: "success",
      title: "Pesan Terkirim!",
      text: "Terima kasih, tim kami akan menghubungi Anda dalam 1x24 jam.",
      confirmButtonColor: "var(--color-primary, #6200ee)",
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-outline-variant/30 p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">
          Pesan Terkirim!
        </h3>
        <p className="text-on-surface-variant">
          Terima kasih, tim kami akan menghubungi Anda dalam 1x24 jam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card border border-outline-variant/30 p-6 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-on-surface">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-default border border-outline-variant px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="Masukkan nama Anda"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-on-surface">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-default border border-outline-variant px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="email@anda.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-on-surface">No. Telepon</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full rounded-default border border-outline-variant px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            placeholder="08xxxxxxxxxx"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-on-surface">Subjek</label>
          <Select
            value={subjectOptions.find((opt) => opt.value === form.subject) || null}
            onChange={(selected) => setForm({ ...form, subject: selected ? selected.value : "" })}
            options={subjectOptions}
            placeholder="Pilih Subjek"
            styles={selectStyles}
          />
        </div>
      </div>

      <div className="space-y-1.5 mb-6">
        <label className="text-sm font-medium text-on-surface">Pesan</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full rounded-default border border-outline-variant px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
          placeholder="Tulis pesan Anda di sini..."
        />
      </div>

      <Button type="submit" className="w-full py-3 font-semibold text-sm">
        Kirim Pesan
      </Button>
    </form>
  );
}
