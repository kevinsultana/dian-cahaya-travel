/**
 * Seed script untuk mengisi database Supabase dengan data awal
 * dari src/data/constant/index.js
 *
 * Jalankan dengan: npx prisma db seed
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialPaketWisata = [
  {
    id: "pw-001",
    nama: "Paket Umroh Iktikaf Akhir Ramadhan",
    durasi: "12 Hari 11 Malam",
    harga: 32500000,
    hotel_makkah: "Movenpick Hajar Tower (Bintang 5)",
    hotel_madinah: "Al Aqeeq Madinah (Bintang 5)",
    status: "active",
    tanggal_keberangkatan: "2025-03-25",
    quota: 45,
    terpakai: 32,
    featured: true,
    deskripsi:
      "Ibadah iktikaf khusyuk di 10 malam terakhir Ramadhan dengan akomodasi hotel bintang 5.",
    gambar:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80",
    badge: "Ramadhan",
    category: "Reguler",
    airline: "Saudi Airlines (Direct Jeddah)",
  },
  {
    id: "pw-002",
    nama: "Umroh Plus Wisata Halal Turki",
    durasi: "15 Hari 14 Malam",
    harga: 45900000,
    hotel_makkah: "Pullman Zamzam (Bintang 5)",
    hotel_madinah: "Anwar Al Madinah Mövenpick (Bintang 5)",
    status: "active",
    tanggal_keberangkatan: "2025-04-20",
    quota: 30,
    terpakai: 18,
    featured: true,
    deskripsi:
      "Nikmati keindahan sejarah Islam di Istanbul sebelum melaksanakan ibadah Umroh dengan pelayanan eksklusif.",
    gambar:
      "https://images.unsplash.com/photo-1564769625722-2e6b6f3ec53a?w=800&q=80",
    badge: "Best Seller",
    category: "Plus Turki",
    airline: "Turkish Airlines",
  },
  {
    id: "pw-003",
    nama: "Paket Umroh Hemat Maulid",
    durasi: "9 Hari 8 Malam",
    harga: 27800000,
    hotel_makkah: "Elaf Ajyad (Bintang 4)",
    hotel_madinah: "Diyar Al Taqwa (Bintang 4)",
    status: "active",
    tanggal_keberangkatan: "2025-09-10",
    quota: 40,
    terpakai: 25,
    featured: true,
    deskripsi:
      "Paket hemat Maulid Nabi dengan akomodasi nyaman dekat dengan pelataran masjid.",
    gambar:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    badge: "Hemat",
    category: "Ekonomi",
    airline: "Lion Air (Direct)",
  },
  {
    id: "pw-004",
    nama: "Haji Furoda Langsung Berangkat",
    durasi: "25 Hari",
    harga: 285000000,
    hotel_makkah: "Makkah Clock Royal Tower Fairmont (Bintang 5)",
    hotel_madinah: "Madinah Hilton (Bintang 5)",
    status: "active",
    tanggal_keberangkatan: "2026-06-15",
    quota: 20,
    terpakai: 5,
    featured: false,
    deskripsi:
      "Ibadah Haji tanpa antre panjang resmi dengan visa Furoda dan fasilitas tenda maktab VIP.",
    gambar:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80",
    badge: "Haji VIP",
    category: "Haji Furoda",
    airline: "Business Class",
  },
  {
    id: "pw-005",
    nama: "Paket Umroh Reguler 12 Hari",
    durasi: "12 Hari 11 Malam",
    harga: 28900000,
    hotel_makkah: "Swissotel Al Maqam (Bintang 4)",
    hotel_madinah: "Golden Tulip Al Ansar (Bintang 4)",
    status: "active",
    tanggal_keberangkatan: "2025-01-15",
    quota: 50,
    terpakai: 12,
    featured: false,
    deskripsi:
      "Perjalanan ibadah Umroh reguler selama 12 hari menggunakan maskapai Garuda Indonesia.",
    gambar:
      "https://images.unsplash.com/photo-1564769625722-2e6b6f3ec53a?w=600&q=80",
    badge: "",
    category: "Reguler",
    airline: "Garuda Indonesia",
  },
  {
    id: "pw-006",
    nama: "Umroh Plus Yordania & Palestina",
    durasi: "18 Hari 17 Malam",
    harga: 52000000,
    hotel_makkah: "Mövenpick Makkah (Bintang 5)",
    hotel_madinah: "Kempinski Madinah (Bintang 5)",
    status: "active",
    tanggal_keberangkatan: "2025-03-10",
    quota: 25,
    terpakai: 8,
    featured: false,
    deskripsi:
      "Ziarah ke Masjidil Aqsa di Palestina serta situs bersejarah di Petra Yordania sebelum beribadah Umroh.",
    gambar:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    badge: "Ziarah",
    category: "Plus",
    airline: "Royal Jordanian",
  },
];

const initialGaleriFoto = [
  {
    id: "gf-001",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfJq66xximN9ELYvkA0pp4LPrfeKhA1X5KSyR0lEJBVbi9wKJ4gJ-OF5pTrri_fHPsu4X_CdF-cyu2iM6cEy_7gHJJuZ-ujV1HAAGdGVZdopF6v35vNwRJh5309BonaFzqTDJtBfCaypO8Eej3fG9qRjIOJpV_uPMsY-BqIaBivz_Y9padYkAvyBwhJWyvX5wLVITIKbcrn3Z3S0L4RX_uk33KgMh3Mejfy2gfikXBbLZF6EYpwNhQkxkIBeNGyMdRXhjgle7-pcZW",
    alt: "Jamaah di depan Masjid Nabawi",
    urutan: 1,
  },
  {
    id: "gf-002",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpoBfd-ccEiaV7uecUBqKYXwoWCLO9yHxZ8dY-MGEjFtxcA8sbS_yqQfV6nRYVGS7hQQNzkT1EpJZmJeRywm86C901MoHaLgW39dOKhjg3m89mdkYVB1ONtnX2Hm5hx4b-b8Z1hughnbdKZpaCgJiDE4cDme0GzhPUGQRf-UFez4i6IWwK706Auwl4a_heXvMUMsA1dMZAC6NI1UGsI1c5FPMmcQid4rOU2vGdP-auhaKqhM1XiqMGlePNwVofPsrt_s0DHoDJmlWj",
    alt: "Kelompok jamaah di Masjidil Haram",
    urutan: 2,
  },
  {
    id: "gf-003",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlP_OqLL0yI2K8SD3y5KRjcZ_WoX5mUIvnNdEzUAtIgW1U6sPM9wpoMqrHxV2YwK22f8_-hxECdjWHq9BqiuEebx6pAqSRYKdaapZLvue_n_G9wuSbb-26XmP-h5IfBNISSMcPNsfg9FEZMcVlFeuQLLVByrKk4gRDeM6UzFnHvV4_QVizLNdMrX70UBqdpJVt6wupg-xVaH6Wd8liqaIq8r68Oc4dn5eQjobbWI2bdGF9s28FZUcWvxm7YraAeLgMRHNzO4Ep-If-",
    alt: "Doa di dekat Ka'bah",
    urutan: 3,
  },
  {
    id: "gf-004",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3pgEjT2xcWAJYt20VFvj3P284D7KSd-c47qJ7RBBWD2YPkWfHFCuNQAcBq2weegiVMWlxSMOGd9NlHFUjThtRyS7So6YaVSKAGDKXu96C1VjGjW3zjSL4S4RwS-0bEuM4vFqRTxlVqSHLrkSd98aptwDtFhwbBvmodKDBCRuwvYzGtGe_Mxd9xRIfK_tG0SFW4foejvDy0Y-QawRoXsom6FPf4yczVlHIIrIeGFnNAu4LSAXFxABEW7INeB7RWbrWRRlLLKAm5X0Q",
    alt: "Skyline Makkah malam hari",
    urutan: 4,
  },
  {
    id: "gf-005",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLjJuCvXdZeMuSO5br9cfGX8vLaSF_hUUh0OAAOQEBNTGzPP9WXt3Dnz1eBzleiL0G5LxSGLL4xNoTm9aqVePWbalcgH4hlIQ80dQak5OSIHXUPE5FT022AEUENqecamzv4eeKD_rsrTXkznEZuUAmS4Oi9GSYoNv-nBSc2few9hXSBxpPNCl_YPDg0n_ClaPjxxXHq4V9RTxODfrtdBdGirSOFYoIcXOFNUusEMJ_zv7-NM4CDO49ACbrBZmMGNUn-ASUfqz65Abl",
    alt: "Pilgrims menikmati hidangan di hotel",
    urutan: 5,
  },
];

const initialTestimoni = [
  {
    id: "tm-001",
    nama: "Bpk. Slamet",
    foto: "",
    bintang: 5,
    teks_deskripsi:
      "Pelayanan sangat luar biasa. Pembimbingnya sangat sabar dan detail menjelaskan setiap rukun umroh. Hotelnya pun sangat dekat dengan Masjidil Haram.",
  },
  {
    id: "tm-002",
    nama: "Ibu Aminah",
    foto: "",
    bintang: 5,
    teks_deskripsi:
      "Program Plus Turki-nya sangat berkesan. Manajemen waktunya rapi, kami tidak merasa lelah meski jadwalnya padat. Terima kasih Dian Cahaya Travel!",
  },
  {
    id: "tm-003",
    nama: "H. Ridwan",
    foto: "",
    bintang: 4,
    teks_deskripsi:
      "Saya baru pertama kali umroh dan merasa sangat terbantu dengan bimbingan manasik yang komprehensif. Semuanya diurus dengan sangat profesional.",
  },
];

const initialBannerPromo = [
  {
    id: "bp-001",
    judul: "Promo Spesial Ramadhan",
    subjudul: "Dapatkan diskon hingga 15% untuk paket umroh ramadhan 2025",
    gambar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlP_OqLL0yI2K8SD3y5KRjcZ_WoX5mUIvnNdEzUAtIgW1U6sPM9wpoMqrHxV2YwK22f8_-hxECdjWHq9BqiuEebx6pAqSRYKdaapZLvue_n_G9wuSbb-26XmP-h5IfBNISSMcPNsfg9FEZMcVlFeuQLLVByrKk4gRDeM6UzFnHvV4_QVizLNdMrX70UBqdpJVt6wupg-xVaH6Wd8liqaIq8r68Oc4dn5eQjobbWI2bdGF9s28FZUcWvxm7YraAeLgMRHNzO4Ep-If-",
    tautan: "/paket-umrah",
    status: "aktif",
  },
];

const initialHeroSection = [
  {
    id: "hs-001",
    judul: "Perjalanan Ibadah Nyaman & Amanah",
    subjudul:
      "Wujudkan impian ibadah Umroh dan Haji Anda bersama pembimbing profesional dan fasilitas premium bintang 5 yang telah terverifikasi resmi oleh Kemenag.",
    gambar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDtaYWOB21a2Y9_BUEI1VmUDFJbZgYQOhrUbqR9PvTfE2vVRbRkl8uu-5TNUFXzutSqixF65tFePdChYBf9WCUuM95tSXRGcmhhQsQ-HSkXMPw2uBp8R_xmPNagC2UndJXU9OS-ySThVynVUmmjRtcfE2y8UN03B_3WyaNX5dOZMqN4F7DdNj_tBCtU31rI780t2c3TSxXO1U25943c-OuIQQs6kmiBICkIrkOLHbVDISeFPU9aKlxE2tjJXdSq0H8Pm43_PAEiW0H0",
    link_tombol: "/paket-umrah",
    status: "aktif",
  },
];

const initialInquiryJemaah = [
  {
    id: "iq-001",
    nama: "Ahmad Fauzi",
    wa: "6281234567890",
    email: "ahmad@example.com",
    paket: "Paket Umroh Reguler 2025",
    status: "baru",
    tanggal: "2025-01-15",
  },
  {
    id: "iq-002",
    nama: "Siti Nurhaliza",
    wa: "6289876543210",
    email: "siti@example.com",
    paket: "Paket Umroh Plus Turki",
    status: "follow_up",
    tanggal: "2025-01-14",
  },
  {
    id: "iq-003",
    nama: "Budi Santoso",
    wa: "",
    email: "budi@example.com",
    paket: "Paket Umroh Ramadhan",
    status: "baru",
    tanggal: "2025-01-13",
  },
  {
    id: "iq-004",
    nama: "Dewi Lestari",
    wa: "6285647382910",
    email: "",
    paket: "Paket Haji Khusus",
    status: "terdaftar",
    tanggal: "2025-01-12",
  },
  {
    id: "iq-005",
    nama: "Rizky Ramadhan",
    wa: "6281122334455",
    email: "rizky@example.com",
    paket: "Paket Umroh Reguler 2025",
    status: "baru",
    tanggal: "2025-01-16",
  },
];

async function main() {
  console.log("🌱 Mulai seeding database Supabase...\n");

  // ── Paket Wisata ─────────────────────────────────────────────────────────
  console.log("📦 Menyimpan Paket Wisata...");
  for (const item of initialPaketWisata) {
    await prisma.paketWisata.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`   ✅ ${initialPaketWisata.length} paket wisata berhasil disimpan`);

  // ── Galeri Foto ───────────────────────────────────────────────────────────
  console.log("🖼️  Menyimpan Galeri Foto...");
  for (const item of initialGaleriFoto) {
    await prisma.galeriFoto.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`   ✅ ${initialGaleriFoto.length} foto galeri berhasil disimpan`);

  // ── Inquiry Jemaah ────────────────────────────────────────────────────────
  console.log("📝 Menyimpan Inquiry Jemaah...");
  for (const item of initialInquiryJemaah) {
    await prisma.inquiryJemaah.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`   ✅ ${initialInquiryJemaah.length} inquiry jemaah berhasil disimpan`);

  // ── Testimoni ─────────────────────────────────────────────────────────────
  console.log("⭐ Menyimpan Testimoni...");
  for (const item of initialTestimoni) {
    await prisma.testimoni.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`   ✅ ${initialTestimoni.length} testimoni berhasil disimpan`);

  // ── Banner Promo ──────────────────────────────────────────────────────────
  console.log("🎯 Menyimpan Banner Promo...");
  for (const item of initialBannerPromo) {
    await prisma.bannerPromo.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`   ✅ ${initialBannerPromo.length} banner promo berhasil disimpan`);

  // ── Hero Section ──────────────────────────────────────────────────────────
  console.log("🏠 Menyimpan Hero Section...");
  for (const item of initialHeroSection) {
    await prisma.heroSection.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`   ✅ ${initialHeroSection.length} hero section berhasil disimpan`);

  // ── Pengaturan WA (Singleton) ─────────────────────────────────────────────
  console.log("📱 Menyimpan Pengaturan WhatsApp...");
  await prisma.pengaturanWa.upsert({
    where: { id: "singleton" },
    update: {
      nomor: "6281234567890",
      pesan_template:
        "Assalamualaikum Dian Cahaya Travel, saya tertarik dengan paket umroh yang ditawarkan. Mohon informasi lebih lanjut.",
    },
    create: {
      id: "singleton",
      nomor: "6281234567890",
      pesan_template:
        "Assalamualaikum Dian Cahaya Travel, saya tertarik dengan paket umroh yang ditawarkan. Mohon informasi lebih lanjut.",
    },
  });
  console.log("   ✅ Pengaturan WhatsApp berhasil disimpan");

  // ── Tentang Kami (Singleton) ──────────────────────────────────────────────
  console.log("🏢 Menyimpan Tentang Kami...");
  await prisma.tentangKami.upsert({
    where: { id: "singleton" },
    update: {
      judul: "Tentang Dian Cahaya Travel",
      subjudul: "Biro Umroh dan Haji Terpercaya Sejak 2015",
      deskripsi:
        "Dian Cahaya Travel adalah biro perjalanan ibadah yang berkomitmen memberikan pelayanan terbaik untuk setiap jamaah. Dengan pengalaman lebih dari 10 tahun, kami telah membantu ribuan jamaah mewujudkan impian ibadah ke Tanah Suci.",
      visi:
        "Menjadi biro perjalanan ibadah terdepan yang memberikan pengalaman ibadah yang nyaman, aman, dan berkesan bagi setiap jamaah.",
      misi:
        "Menyediakan paket perjalanan ibadah yang terjangkau dengan pelayanan profesional and fasilitas premium, serta pembimbing yang berpengalaman dan ramah.",
      nilai_perusahaan: ["Amanah", "Profesional", "Berorientasi Pelayanan", "Terpercaya"],
    },
    create: {
      id: "singleton",
      judul: "Tentang Dian Cahaya Travel",
      subjudul: "Biro Umroh dan Haji Terpercaya Sejak 2015",
      deskripsi:
        "Dian Cahaya Travel adalah biro perjalanan ibadah yang berkomitmen memberikan pelayanan terbaik untuk setiap jamaah. Dengan pengalaman lebih dari 10 tahun, kami telah membantu ribuan jamaah mewujudkan impian ibadah ke Tanah Suci.",
      visi:
        "Menjadi biro perjalanan ibadah terdepan yang memberikan pengalaman ibadah yang nyaman, aman, dan berkesan bagi setiap jamaah.",
      misi:
        "Menyediakan paket perjalanan ibadah yang terjangkau dengan pelayanan profesional and fasilitas premium, serta pembimbing yang berpengalaman dan ramah.",
      nilai_perusahaan: ["Amanah", "Profesional", "Berorientasi Pelayanan", "Terpercaya"],
    },
  });
  console.log("   ✅ Tentang Kami berhasil disimpan");

  console.log("\n🎉 Seeding selesai! Semua data berhasil disimpan ke Supabase.");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
