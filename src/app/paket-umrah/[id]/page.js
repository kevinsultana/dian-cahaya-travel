"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Swal from "sweetalert2";
import Link from "next/link";

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Data States
  const [pkg, setPkg] = useState(null);
  const [waData, setWaData] = useState(null);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    wa: "",
    email: "",
  });

  const pkgId = params?.id;

  useEffect(() => {
    setMounted(true);

    const loadPageData = async () => {
      try {
        setLoading(true);
        // Load Paket Wisata
        const pkgRes = await fetch(`/api/paket-wisata/${pkgId}`);
        if (pkgRes.ok) {
          const pkgJson = await pkgRes.json();
          setPkg(pkgJson);
          document.title = `${pkgJson.nama || "Detail Paket"} | Dian Cahaya Travel`;
        }

        // Load Pengaturan WA
        const waRes = await fetch("/api/pengaturan-wa");
        if (waRes.ok) {
          const waJson = await waRes.json();
          setWaData(waJson);
        }
      } catch (error) {
        console.error("Gagal memuat detail halaman paket:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pkgId) {
      loadPageData();
    }
  }, [pkgId]);

  if (!mounted) return null;

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 flex flex-col items-center justify-center">
          <div className="text-sm text-on-surface-variant">Memuat detail paket wisata...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!pkg) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-32 flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/40 mb-4">search_off</span>
          <h2 className="text-2xl font-bold text-primary mb-2">Paket Tidak Ditemukan</h2>
          <p className="text-on-surface-variant text-sm mb-6">Paket wisata yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/paket-umrah" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all">
            Kembali ke Daftar Paket
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatLongDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const seatsLeft = pkg.quota - pkg.terpakai;
  const percentFilled = Math.min(100, Math.round((pkg.terpakai / pkg.quota) * 100));

  // Construct WA url for direct chat booking
  const waNumber = waData?.nomor || "6281234567890";
  const waMessage = `Assalamualaikum Dian Cahaya Travel, saya tertarik dengan paket *${pkg.nama}* (Keberangkatan: ${formatLongDate(pkg.tanggal_keberangkatan)}). Mohon informasi cara pendaftaran dan ketersediaan kursi.`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.wa && !formData.email) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian",
        text: "Mohon isi minimal nomor WhatsApp atau Email untuk menghubungi Anda.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/inquiry-jemaah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.nama,
          wa: formData.wa,
          email: formData.email,
          paket: pkg.nama,
          status: "baru",
          tanggal: new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) throw new Error();

      Swal.fire({
        icon: "success",
        title: "Pendaftaran Berhasil!",
        text: "Pertanyaan atau minat Anda telah terkirim. Konsultan kami akan segera menghubungi Anda.",
        confirmButtonText: "Selesai",
      });

      setFormData({ nama: "", wa: "", email: "" });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal mengirimkan inquiry. Coba beberapa saat lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface-container-lowest pb-20">
        {/* Hero banner */}
        <section className="relative h-[400px] overflow-hidden pt-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${pkg.gambar || "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80"})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white max-w-7xl mx-auto right-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-secondary-container text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {pkg.category || "Umroh"}
              </span>
              {pkg.badge && (
                <span className="bg-error text-on-error px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {pkg.badge}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mb-4">
              {pkg.nama}
            </h1>
            <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
              {pkg.deskripsi || "Sempurnakan ibadah Anda ke baitullah dengan kenyamanan akomodasi bintang 5 dan pembimbing yang bersertifikat resmi."}
            </p>
          </div>
        </section>

        {/* Content details grid */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Details column (left) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Package details info */}
            <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary border-b border-outline-variant pb-4">
                Informasi & Fasilitas Perjalanan
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Tanggal Keberangkatan</h3>
                    <p className="text-sm font-semibold text-on-surface">{formatLongDate(pkg.tanggal_keberangkatan)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[24px]">schedule</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Durasi</h3>
                    <p className="text-sm font-semibold text-on-surface">{pkg.durasi}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Maskapai</h3>
                    <p className="text-sm font-semibold text-on-surface">{pkg.airline || "Saudi Airlines (Direct)"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[24px]">airline_seat_recline_normal</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Ketersediaan Kursi</h3>
                    <div className="flex justify-between text-sm font-semibold text-on-surface mb-1">
                      <span>{pkg.terpakai} / {pkg.quota} Kursi</span>
                      <span className={seatsLeft <= 5 ? "text-error" : "text-primary"}>
                        {seatsLeft <= 0 ? "Penuh" : `Sisa ${seatsLeft} Kursi`}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentFilled}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/60 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[24px]">apartment</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Hotel Mekkah</h3>
                    <p className="text-sm font-semibold text-on-surface">{pkg.hotel_makkah}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[24px]">apartment</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Hotel Madinah</h3>
                    <p className="text-sm font-semibold text-on-surface">{pkg.hotel_madinah}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions and Exclusions description card */}
            <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary border-b border-outline-variant pb-4">
                Fasilitas Termasuk (Inclusions)
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-on-surface-variant">
                {[
                  "Tiket Pesawat Pulang Pergi (PP)",
                  "Visa Umroh / Haji",
                  "Akomodasi Hotel sesuai paket",
                  "Makan 3x sehari hidangan Indonesia",
                  "Muthawwif / Pembimbing profesional",
                  "Transportasi Bus AC VIP di Arab Saudi",
                  "Air Zam-Zam 5 Liter (jika diizinkan)",
                  "Manasik Umroh 1 kali sebelum berangkat",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing & Inquiry column (right) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Price card */}
            <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 shadow-sm text-center space-y-4">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Harga Paket Mulai Dari</p>
              <p className="text-3xl font-black text-primary tracking-tight">
                {formatPrice(pkg.harga)}
              </p>
              <p className="text-xs text-on-surface-variant">
                *Harga sewaktu-waktu dapat berubah mengikuti kebijakan maskapai & hotel
              </p>
              <div className="pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Daftar via WhatsApp
                </a>
              </div>
            </div>

            {/* Inquiry booking form */}
            <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-primary">Konsultasi / Daftar Online</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Isi formulir berikut, konsultan Dian Cahaya Travel akan segera menghubungi Anda untuk mendiskusikan detail pendaftaran.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                    placeholder="Nama Anda"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.wa}
                    onChange={(e) => setFormData({ ...formData, wa: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                    placeholder="62812345678"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Alamat Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                    placeholder="nama@email.com"
                  />
                </div>

                 <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all text-sm mt-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? "Mengirim..." : "Kirim Pengajuan"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
