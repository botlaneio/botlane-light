"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "METRICS", href: "/metrics" },
  { label: "PRICING", href: "/pricing" },
  { label: "CONTACT", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full flex justify-between items-end border-b border-white/15 pb-4">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="w-10 h-10 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
          aria-label="Go to home"
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
        <button className="px-4 py-2 border border-white/40 text-white/70 uppercase font-mono text-xs hover:bg-white hover:text-black transition-colors">
          Initialize
        </button>
      </nav>
    </header>
  );
}
