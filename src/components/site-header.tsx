"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "METRICS", href: "/metrics" },
  { label: "PRICING", href: "/pricing" },
  { label: "CONTACT", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="w-full border-b border-white/15 pb-4">
      <div className="flex justify-between items-end gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
            aria-label="Go to home"
            onClick={closeMobileMenu}
          >
            <span className="font-mono text-xs">BT</span>
          </Link>
          <div>
            <Link href="/" className="text-2xl font-bold tracking-widest uppercase">
              BOTLANE.IO
            </Link>
            <p className="font-mono text-xs text-white/40 tracking-widest">
              PIPELINE-AS-A-SERVICE // v1.0.0
            </p>
          </div>
        </div>

        <button
          type="button"
          className="md:hidden w-10 h-10 border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <nav className="hidden md:flex gap-8 font-mono text-xs tracking-widest text-white/35">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={
                pathname === item.href
                  ? "text-white border-b border-white/60 pb-1 transition-colors"
                  : "hover:text-white transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book-call"
            className="px-4 py-2 border border-white/40 text-white/70 uppercase font-mono text-xs hover:bg-white hover:text-black transition-colors"
          >
            Initialize
          </Link>
        </nav>
      </div>

      {mobileOpen && (
        <nav className="md:hidden mt-4 border border-white/12 bg-white/[0.02] p-4">
          <div className="flex flex-col gap-3 font-mono text-xs tracking-widest text-white/40">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={closeMobileMenu}
                className={
                  pathname === item.href
                    ? "text-white border border-white/35 px-3 py-2"
                    : "hover:text-white border border-transparent px-3 py-2 transition-colors"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/book-call"
            onClick={closeMobileMenu}
            className="mt-4 w-full px-4 py-2 border border-white/40 text-white/70 uppercase font-mono text-xs hover:bg-white hover:text-black transition-colors"
          >
            Initialize
          </Link>
        </nav>
      )}
    </header>
  );
}
