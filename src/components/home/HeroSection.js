"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialHeroSection } from "@/data/constant";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [slides] = useLocalStorage("adminHeroSection", initialHeroSection);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSlides = mounted ? slides : initialHeroSection;
  // Get the first active slide
  const activeSlide = activeSlides?.find((s) => s.status === "aktif") || activeSlides?.[0];

  const title = activeSlide?.judul || "Perjalanan Ibadah Nyaman & Amanah";
  const subtitle = activeSlide?.subjudul || "Wujudkan impian ibadah Umroh dan Haji Anda bersama pembimbing profesional dan fasilitas premium bintang 5 yang telah terverifikasi resmi oleh Kemenag.";
  const image = activeSlide?.gambar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDtaYWOB21a2Y9_BUEI1VmUDFJbZgYQOhrUbqR9PvTfE2vVRbRkl8uu-5TNUFXzutSqixF65tFePdChYBf9WCUuM95tSXRGcmhhQsQ-HSkXMPw2uBp8R_xmPNagC2UndJXU9OS-ySThVynVUmmjRtcfE2y8UN03B_3WyaNX5dOZMqN4F7DdNj_tBCtU31rI780t2c3TSxXO1U25943c-OuIQQs6kmiBICkIrkOLHbVDISeFPU9aKlxE2tjJXdSq0H8Pm43_PAEiW0H0";
  const link = activeSlide?.link_tombol || "/paket-umrah";

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl text-white">
          <h1
            className="font-bold leading-tight mb-6"
            style={{
              fontSize: "clamp(2rem, 4vw, 48px)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          <p
            className="mb-10 opacity-90 leading-relaxed"
            style={{ fontSize: "18px", lineHeight: 1.6 }}
          >
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={link}
              className="bg-secondary-container text-primary px-8 py-4 rounded-lg font-bold hover:bg-secondary-fixed transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Lihat Paket Umroh
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link
              href="/kontak"
              className="bg-transparent border-2 border-white/40 hover:border-white text-white px-8 py-4 rounded-lg font-bold backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              Konsultasi Gratis
              <span className="material-symbols-outlined">chat</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
