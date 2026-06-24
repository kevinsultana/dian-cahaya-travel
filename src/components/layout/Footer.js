import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-20 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-secondary-fixed">
            Dian Cahaya Travel
          </h3>
          <p className="text-sm text-on-primary/80 leading-relaxed">
            Penyelenggara Perjalanan Ibadah Umroh (PPIU) resmi dengan komitmen
            melayani sepenuh hati untuk kenyamanan ibadah Anda.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
              href="#"
              aria-label="Social"
            >
              <span className="material-symbols-outlined">face</span>
            </a>
            <a
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
              href="#"
              aria-label="Social"
            >
              <span className="material-symbols-outlined">camera</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-fixed">
            Quick Links
          </h4>
          <ul className="space-y-2">
            {[
              { label: "Packages", href: "/paket-umrah" },
              { label: "Flight Schedule", href: "#" },
              { label: "Hotels", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Privacy Policy", href: "#" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-on-primary/80 hover:text-on-primary hover:underline transition-all"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Office */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-fixed">
            Our Office
          </h4>
          <p className="text-sm text-on-primary/80 leading-relaxed">
            Jl. Kebahagiaan No. 123
            <br />
            Jakarta Selatan, 12345
            <br />
            Indonesia
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">call</span>
              <span className="text-sm text-on-primary/80">+62 21 555 0123</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">mail</span>
              <span className="text-sm text-on-primary/80">info@diancahaya.com</span>
            </div>
          </div>
        </div>

        {/* Licensing */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-secondary-fixed">
            Licensing
          </h4>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <div>
              <p className="text-sm font-bold text-white">PPIU No. 912/2021</p>
              <p className="text-[10px] text-on-primary/60">Terdaftar di Kemenag RI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-primary/60 text-center">
            &copy; {new Date().getFullYear()} Dian Cahaya Travel. All rights reserved. Licensed by Kemenag.
          </p>
          <div className="flex gap-4">
            {/* Payment Icons Placeholder */}
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[10px] text-on-primary/40">Visa</div>
            <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[10px] text-on-primary/40">MC</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
