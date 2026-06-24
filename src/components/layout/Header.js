"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/paket-umrah", label: "Tour Packages" },
  { href: "/tentang-kami", label: "About Us" },
  { href: "/kontak", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-background/85 border-b border-outline-variant">
      <nav className="flex items-center justify-between px-gutter mx-auto w-full" style={{ maxWidth: "1280px", padding: "1rem 1.5rem" }}>
        {/* Logo */}
        <Link href="/" className="text-headline-md font-bold text-primary" style={{ fontSize: "24px", fontWeight: 600 }}>
          Dian Cahaya Travel
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: "16px" }}
                className={`transition-colors ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="hidden lg:flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-all cursor-pointer">
            <span>Consultation</span>
          </button>
          <button
            className="md:hidden text-primary cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-white">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-variant"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
