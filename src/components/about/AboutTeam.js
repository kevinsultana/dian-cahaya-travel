"use client";

import React, { useState, useEffect } from "react";

export default function AboutTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team-member");
        if (res.ok) {
          const json = await res.json();
          setTeam(json);
        }
      } catch (error) {
        console.error("Gagal memuat tim kami:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-on-surface-variant bg-surface-container-low">
        Memuat data tim kami...
      </div>
    );
  }

  if (team.length === 0) return null;

  return (
    <section className="section-padding bg-surface-container-low">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
            Tim Kami
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
            Dikelola oleh Tenaga{" "}
            <span className="text-secondary-container">Profesional</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Tim berpengalaman dan berdedikasi tinggi siap melayani perjalanan
            ibadah Anda dengan sepenuh hati.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl p-6 shadow-card border border-outline-variant/30 text-center flex flex-col items-center"
            >
              {/* Photo */}
              {member.foto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant shadow-sm mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.foto}
                    alt={member.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
              )}

              <h3 className="font-bold text-on-surface text-base">{member.nama}</h3>
              <p className="text-xs text-secondary font-semibold mb-2">
                {member.jabatan}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
