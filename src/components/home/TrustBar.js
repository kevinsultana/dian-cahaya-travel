const trustItems = [
  {
    icon: "verified_user",
    title: "Resmi Kemenag",
    desc: "Terdaftar secara legal dan amanah untuk memastikan ketenangan ibadah Anda.",
    bg: "bg-primary-fixed",
    color: "text-primary",
  },
  {
    icon: "groups",
    title: "Pembimbing Profesional",
    desc: "Dibimbing oleh Mutawwif berpengalaman sesuai tuntunan Al-Quran dan Sunnah.",
    bg: "bg-secondary-fixed",
    color: "text-secondary",
  },
  {
    icon: "hotel",
    title: "Hotel Bintang 5",
    desc: "Akomodasi premium dengan jarak yang sangat dekat dari Masjidil Haram & Nabawi.",
    bg: "bg-primary-fixed",
    color: "text-primary",
  },
];

export default function TrustBar() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="trust-card p-8 bg-white rounded-xl border border-outline-variant flex flex-col items-center text-center"
              style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
            >
              <div
                className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mb-6`}
              >
                <span
                  className={`material-symbols-outlined ${item.color}`}
                  style={{ fontSize: "36px" }}
                >
                  {item.icon}
                </span>
              </div>
              <h3 className="font-bold text-primary mb-2" style={{ fontSize: "20px" }}>
                {item.title}
              </h3>
              <p
                className="text-on-surface-variant leading-relaxed"
                style={{ fontSize: "16px" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
