import Link from "next/link";

export default function PackageCard({ pkg }) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-outline-variant/30">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${pkg.image})` }}
        />
        {/* Kemenag Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 shadow-md"
          style={{ background: "linear-gradient(135deg, #ffe088 0%, #fed65b 100%)" }}
        >
          <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="text-[10px] font-bold text-primary tracking-tighter uppercase">
            Kemenag Certified
          </span>
        </div>
        {/* Category Tag */}
        <div className="absolute bottom-4 left-4">
          <span className={`${pkg.categoryBg} px-3 py-1 rounded-md text-xs uppercase tracking-wider font-semibold`}>
            {pkg.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">
          {pkg.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
            <span className="text-sm">{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">apartment</span>
            <span className="text-sm flex flex-col">
              <span className="font-semibold text-primary/80">Mekkah: <span className="font-normal text-on-surface-variant">{pkg.hotel_makkah || pkg.hotel}</span></span>
              <span className="font-semibold text-primary/80">Madinah: <span className="font-normal text-on-surface-variant">{pkg.hotel_madinah || "-"}</span></span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[20px]">flight_takeoff</span>
            <span className="text-sm">{pkg.airline}</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto pt-6 border-t border-outline-variant flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider">Mulai Dari</p>
            <p className="text-xl font-bold text-primary">{pkg.price}</p>
          </div>
          <Link
            href={`/paket-umrah/${pkg.id}`}
            className="bg-secondary-container text-primary px-5 py-2.5 rounded-lg font-bold hover:bg-secondary-fixed transition-colors text-sm text-center"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
