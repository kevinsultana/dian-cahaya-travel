const stats = [
  { value: "5000+", label: "Jamaah Berangkat" },
  { value: "10+", label: "Tahun Pengalaman" },
  { value: "50+", label: "Maskapai Partner" },
  { value: "100%", label: "Kepuasan Jamaah" },
];

export default function AboutStats() {
  return (
    <section className="py-16 bg-primary">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-secondary-container mb-2">
                {stat.value}
              </p>
              <p className="text-on-primary/70 text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
