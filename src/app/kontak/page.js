import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata = {
  title: "Kontak - Dian Cahaya Travel",
  description: "Hubungi Dian Cahaya Travel untuk konsultasi dan pendaftaran paket Umrah.",
};

export default function KontakPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-primary to-primary-container py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-on-primary/80 font-semibold text-sm uppercase tracking-widest mb-4">
                Kontak
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-on-primary leading-tight mb-6">
                Hubungi <span className="text-secondary-container">Kami</span>
              </h1>
              <p className="text-lg text-on-primary/80 leading-relaxed max-w-2xl mx-auto">
                Punya pertanyaan atau ingin berkonsultasi? Tim kami siap membantu Anda.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <h2 className="text-2xl font-bold text-primary mb-6">Kirim Pesan</h2>
                <ContactForm />
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-primary mb-6">Informasi Kontak</h2>
                <ContactInfo />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="h-64 md:h-80 bg-surface-variant rounded-xl flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-primary">map</span>
                <p className="text-on-surface-variant font-medium mt-2">Peta Lokasi</p>
                <p className="text-sm text-on-surface-variant/70">Jl. Raya Kebahagiaan No. 123, Jakarta Selatan</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
