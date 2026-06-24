export default function AboutMission() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Placeholder */}
          <div className="h-80 lg:h-96 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <p className="text-primary/60 font-medium">Ilustrasi Perjalanan</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
              Visi & Misi
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
                <p className="text-on-surface-variant leading-relaxed">
                  Menjadi biro perjalanan Umrah dan Haji terdepan di Indonesia
                  yang memberikan pelayanan terbaik, bimbingan ibadah yang
                  berkualitas, serta pengalaman spiritual yang tak terlupakan
                  bagi setiap jamaah.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-on-surface text-lg mb-2">
                  Misi Kami
                </h3>
                <ul className="space-y-2">
                  {[
                    "Menyediakan layanan perjalanan ibadah yang aman, nyaman, dan sesuai syariah",
                    "Memberikan bimbingan ibadah profesional oleh ustadz bersertifikat",
                    "Menjaga komunikasi dan pelayanan prima sebelum, selama, dan setelah perjalanan",
                    "Bermitra dengan maskapai dan hotel terbaik di Arab Saudi",
                    "Terus berinovasi untuk meningkatkan kualitas pelayanan",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
