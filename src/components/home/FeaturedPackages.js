import Link from "next/link";

const packageData = [
  {
    id: "plus-turki",
    title: "Paket Plus Turki",
    desc: "Nikmati keindahan sejarah Islam di Istanbul sebelum melaksanakan ibadah Umroh dengan pelayanan eksklusif.",
    duration: "12 Hari Perjalanan",
    hotel: "Swissotel Al Maqam (Makkah)",
    price: "Mulai Rp 42.500.000",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    featured: true,
  },
  {
    id: "reguler",
    title: "Paket Reguler",
    desc: "Ibadah fokus dan khusyuk dengan akomodasi hotel bintang 4 premium di lokasi strategis.",
    duration: "9 Hari",
    price: "Rp 28.900.000",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80",
  },
  {
    id: "ramadhan",
    title: "Paket Ramadhan",
    desc: "Meraih pahala berlipat ganda dengan berumroh di bulan suci Ramadhan bersama tim kami.",
    duration: "15 Hari",
    price: "Rp 48.000.000",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80",
  },
];

export default function FeaturedPackages() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="text-secondary font-bold tracking-widest text-sm uppercase">
              Pilihan Terbaik
            </p>
            <h2
              className="text-primary font-bold mt-2"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              Paket Umroh Unggulan
            </h2>
          </div>
          <Link
            href="/paket-umrah"
            className="text-primary font-bold flex items-center gap-2 group underline-offset-4 hover:underline"
          >
            Lihat Semua Paket
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              east
            </span>
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Paket Plus Turki — Large Featured */}
          <div className="md:col-span-8 bg-white rounded-2xl overflow-hidden border border-outline-variant flex flex-col md:flex-row group shadow-sm hover:shadow-md transition-all">
            <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${packageData[0].image})` }}
              />
              <div className="absolute top-4 left-4 bg-secondary-container text-primary px-4 py-1 rounded-full text-xs font-bold shadow-sm">
                {packageData[0].badge}
              </div>
            </div>
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {packageData[0].title}
                </h3>
                <p className="text-on-surface-variant text-base mb-6 leading-relaxed">
                  {packageData[0].desc}
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <span className="text-sm">{packageData[0].duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary">apartment</span>
                    <span className="text-sm">{packageData[0].hotel}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <span className="text-sm font-bold text-tertiary">{packageData[0].price}</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:opacity-90 transition-all cursor-pointer">
                Pilih Paket
              </button>
            </div>
          </div>

          {/* Paket Reguler */}
          <div className="md:col-span-4 bg-white rounded-2xl overflow-hidden border border-outline-variant flex flex-col shadow-sm hover:shadow-md transition-all group">
            <div
              className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${packageData[1].image})` }}
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-primary mb-2">{packageData[1].title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 leading-relaxed">{packageData[1].desc}</p>
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-on-surface-variant">{packageData[1].duration}</span>
                  <span className="text-sm font-bold text-tertiary">{packageData[1].price}</span>
                </div>
                <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
                  Detail Paket
                </button>
              </div>
            </div>
          </div>

          {/* Paket Ramadhan */}
          <div className="md:col-span-4 bg-white rounded-2xl overflow-hidden border border-outline-variant flex flex-col shadow-sm hover:shadow-md transition-all group">
            <div
              className="h-48 bg-cover bg-center bg-primary/10 group-hover:scale-105 transition-transform duration-700 relative"
              style={{ backgroundImage: `url(${packageData[2].image})` }}
            >
              <div className="absolute inset-0 bg-primary/20" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-primary mb-2">{packageData[2].title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 leading-relaxed">{packageData[2].desc}</p>
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-on-surface-variant">{packageData[2].duration}</span>
                  <span className="text-sm font-bold text-tertiary">{packageData[2].price}</span>
                </div>
                <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
                  Detail Paket
                </button>
              </div>
            </div>
          </div>

          {/* CTA Block */}
          <div className="md:col-span-8 bg-primary text-on-primary rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>mosque</span>
            </div>
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Butuh Penyesuaian Jadwal?</h3>
              <p className="text-base opacity-80">
                Kami menyediakan paket custom untuk group, keluarga, maupun korporasi.
              </p>
            </div>
            <Link
              href="/kontak"
              className="relative z-10 bg-secondary-container text-primary px-10 py-4 rounded-full font-bold whitespace-nowrap shadow-xl hover:scale-105 transition-transform"
            >
              Hubungi Admin WA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
