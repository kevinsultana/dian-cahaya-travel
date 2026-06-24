import PackageCard from "@/components/packages/PackageCard";
import packagesData from "@/data/packages";

export default function PackageGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packagesData.slice(0, 4).map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-16 flex justify-center gap-2">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-on-primary font-bold cursor-pointer">1</button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">2</button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">3</button>
        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant hover:bg-surface-variant transition-colors cursor-pointer">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </>
  );
}
