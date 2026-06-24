"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TransitionHandler({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    // Dismiss loading overlay when route changes
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Filter external links, anchor targets, current page, and admin pages for loading
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.getAttribute("target") === "_blank" ||
        href.startsWith("/admin") ||
        pathname === href
      ) {
        return;
      }

      // Check for modifier keys
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return;
      }

      setLoading(true);
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [pathname]);

  return (
    <>
      {loading && !isAdmin && (
        <div className="fixed inset-0 bg-primary/30 backdrop-blur-md z-[9999] flex items-center justify-center animate-fade-in transition-all duration-300">
          <div className="bg-white/95 p-8 rounded-2xl shadow-card border border-secondary-container/20 flex flex-col items-center gap-4 text-center max-w-[280px]">
            {/* Elegant Golden & Emerald Loading Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-secondary-container/20 border-t-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-primary/10 border-b-secondary-container animate-reverse-spin" />
              <span
                className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-primary animate-pulse"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                mosque
              </span>
            </div>
            <div>
              <p className="text-primary font-bold text-sm tracking-wide">Dian Cahaya Travel</p>
              <p className="text-xs text-on-surface-variant/80 mt-1 font-medium">Menyiapkan Halaman...</p>
            </div>
          </div>
        </div>
      )}
      {/* Smooth entry animation for the page content */}
      <div key={pathname} className="page-entry-anim w-full min-h-screen flex flex-col">
        {children}
      </div>
    </>
  );
}

export default function PageTransition({ children }) {
  return (
    <Suspense fallback={null}>
      <TransitionHandler>{children}</TransitionHandler>
    </Suspense>
  );
}
