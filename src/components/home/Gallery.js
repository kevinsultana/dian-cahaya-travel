"use client";

import React, { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { initialGaleriFoto } from "@/data/constant";

export default function Gallery() {
  const [mounted, setMounted] = useState(false);
  const [galeri] = useLocalStorage("adminGaleriFoto", initialGaleriFoto);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeGaleri = mounted ? galeri : initialGaleriFoto;
  const sortedGaleri = [...activeGaleri].sort((a, b) => (a.urutan || 0) - (b.urutan || 0));

  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className="font-bold text-primary"
            style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
          >
            Dokumentasi Jamaah
          </h2>
          <p className="text-on-surface-variant mt-4 max-w-xl mx-auto">
            Kebahagiaan dan kekhusyukan jamaah Dian Cahaya Travel saat
            menjalankan ibadah di tanah suci.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {sortedGaleri.map((img, i) => (
            <div key={img.id || i} className="break-inside-avoid">
              <div
                className="w-full rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-cover bg-center"
                style={{
                  backgroundImage: `url(${img.src})`,
                  aspectRatio: "1 / 1",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
