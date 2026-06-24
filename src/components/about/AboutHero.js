export default function AboutHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-container overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)",
        }} />
      </div>

      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-on-primary/80 font-semibold text-sm uppercase tracking-widest mb-4">
            Tentang Kami
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-on-primary leading-tight mb-6">
            Mitra Perjalanan Ibadah{" "}
            <span className="text-secondary-container">Terpercaya</span> Anda
          </h1>
          <p className="text-lg text-on-primary/80 leading-relaxed max-w-2xl mx-auto">
            Berdiri sejak 2015, Dian Cahaya Travel telah melayani ribuan jamaah
            dengan komitmen penuh terhadap kenyamanan, keamanan, dan kekhidmatan
            ibadah.
          </p>
        </div>
      </div>
    </section>
  );
}
