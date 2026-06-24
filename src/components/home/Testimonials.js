const testimonials = [
  {
    quote:
      '"Pelayanan sangat luar biasa. Pembimbingnya sangat sabar dan detail menjelaskan setiap rukun umroh. Hotelnya pun sangat dekat dengan Masjidil Haram."',
    initials: "BS",
    name: "Bpk. Slamet",
    label: "Jamaah Umroh Januari 2024",
  },
  {
    quote:
      '"Program Plus Turki-nya sangat berkesan. Manajemen waktunya rapi, kami tidak merasa lelah meski jadwalnya padat. Terima kasih Dian Cahaya Travel!"',
    initials: "IA",
    name: "Ibu Aminah",
    label: "Jamaah Plus Turki 2023",
  },
  {
    quote:
      '"Saya baru pertama kali umroh dan merasa sangat terbantu dengan bimbingan manasik yang komprehensif. Semuanya diurus dengan sangat profesional."',
    initials: "HR",
    name: "H. Ridwan",
    label: "Jamaah Umroh Ramadhan 2024",
  },
];

export default function Testimonials() {
  return (
    <section className="py-section-padding bg-surface-container-high overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-gutter relative z-10 max-w-7xl py-16">
        <div className="text-center mb-16">
          <h2
            className="font-bold text-primary"
            style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
          >
            Apa Kata Mereka?
          </h2>
          <p className="text-on-surface-variant mt-4">
            Lebih dari 10.000 jamaah telah mempercayakan perjalanan ibadah
            mereka kepada kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        fontSize: "20px",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-on-surface italic leading-relaxed mb-6">
                  {t.quote}
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-outline-variant pt-6">
                <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center font-bold text-primary">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-primary">{t.name}</h4>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                    {t.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
