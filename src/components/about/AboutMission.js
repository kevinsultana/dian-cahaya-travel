"use client";

import React, { useState, useEffect } from "react";

export default function AboutMission() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch("/api/tentang-kami");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Gagal memuat misi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-on-surface-variant">
        Memuat informasi Visi & Misi...
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=800&q=80";
  const displayImage = data?.gambar || defaultImage;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="h-80 lg:h-[450px] rounded-2xl overflow-hidden border border-outline-variant/60 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImage}
              alt="Profil Dian Cahaya Travel"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
              Visi &amp; Misi
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-6">
              Menjadi Mitra Ibadah yang{" "}
              <span className="text-secondary-container">Amanah</span> dan
              Profesional
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-on-surface text-lg mb-2">
                  Visi Kami
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  {data?.visi || "Menjadi biro perjalanan Umrah dan Haji terdepan di Indonesia yang memberikan pelayanan terbaik."}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-on-surface text-lg mb-2">
                  Misi Kami
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-sm whitespace-pre-line">
                  {data?.misi || "Menyediakan layanan perjalanan ibadah yang aman, nyaman, dan sesuai syariah."}
                </p>
              </div>

              {data?.nilai_perusahaan && data.nilai_perusahaan.length > 0 && (
                <div>
                  <h3 className="font-semibold text-on-surface text-lg mb-3">
                    Nilai-Nilai Kami
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.nilai_perusahaan.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/5 text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
