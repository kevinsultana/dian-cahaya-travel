import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Kontak - Dian Cahaya Travel",
  description: "Hubungi Dian Cahaya Travel untuk konsultasi dan pendaftaran paket Umrah.",
};

async function getContactData() {
  try {
    let data = await prisma.kontak.findUnique({
      where: { id: "singleton" },
    });
    if (!data) {
      // Return fallback defaults if not seeded yet
      data = {
        alamat: "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta 10110",
        telepon: "+62 21 1234 5678",
        email: "info@diancahayatravel.com",
        wa_cs: "6281234567890",
        jam_kerja: "Senin - Jumat: 08.00 - 17.00\nSabtu: 08.00 - 14.00",
        gmaps_embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6663923293845!2d106.8249641757833!3d-6.175387060513978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2dbfb2115%3A0x6b306b6b6b6b6b6b!2sMonumen%20Nasional!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
      };
    }
    return data;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }
}

export default async function KontakPage() {
  const contactData = await getContactData();

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
            <div className="h-[350px] md:h-[450px] bg-surface-variant rounded-xl overflow-hidden shadow-card border border-outline-variant/30 relative">
              {contactData?.gmaps_embed ? (
                <div
                  className="w-full h-full absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                  dangerouslySetInnerHTML={{ __html: contactData.gmaps_embed }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">map</span>
                  <p className="text-on-surface-variant font-medium">Peta Lokasi</p>
                  <p className="text-sm text-on-surface-variant/70 max-w-md mt-1">
                    {contactData?.alamat || "Alamat belum diatur"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
