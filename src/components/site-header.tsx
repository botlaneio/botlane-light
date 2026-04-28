"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { TrackedLink } from "@/components/tracked-link";

const NAV_ITEMS = [
  { label: "HOW IT WORKS", href: "/how-it-works" },
  { label: "METRICS", href: "/metrics" },
  { label: "PRICING", href: "/pricing" },
  { label: "CONTACT", href: "/contact" },
];

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24">
      <path
        d="M21.805 12.23c0-.79-.064-1.365-.2-1.962H12.2v3.715h5.52c-.11.923-.705 2.313-2.028 3.248l-.018.124 2.974 2.255.206.02c1.89-1.71 2.95-4.228 2.95-7.4z"
        fill="#4285F4"
      />
      <path
        d="M12.2 21.9c2.704 0 4.975-.873 6.633-2.37l-3.162-2.4c-.846.579-1.982.984-3.47.984-2.648 0-4.894-1.71-5.696-4.077l-.119.01-3.093 2.342-.04.111C4.9 19.705 8.295 21.9 12.2 21.9z"
        fill="#34A853"
      />
      <path
        d="M6.504 14.037A5.723 5.723 0 0 1 6.168 12c0-.708.121-1.396.334-2.037l-.005-.136-3.133-2.38-.103.048A9.761 9.761 0 0 0 2.2 12c0 1.607.393 3.127 1.061 4.505l3.243-2.468z"
        fill="#FBBC05"
      />
      <path
        d="M12.2 5.886c1.877 0 3.143.797 3.865 1.464l2.82-2.703C17.156 3.04 14.904 2.1 12.2 2.1c-3.905 0-7.3 2.194-8.938 5.395l3.24 2.47c.809-2.368 3.054-4.08 5.698-4.08z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = status === "authenticated";

  const closeMobileMenu = () => setMobileOpen(false);
  return (
    <header className="w-full border-b border-white/15 pb-4">
      <div className="flex justify-between items-end gap-4 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-end md:gap-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors accent-interactive"
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

        <nav className="hidden md:flex justify-self-center justify-center md:translate-x-4 gap-8 font-mono text-xs tracking-widest text-white/35">
          {NAV_ITEMS.map((item) => (
            <TrackedLink
              key={item.href}
              href={item.href}
              eventName="nav_click"
              eventMeta={{ location: "header_desktop", target: item.href }}
              aria-current={pathname === item.href ? "page" : undefined}
              className={
                pathname === item.href
                  ? "text-white border-b border-indigo-300/70 pb-1 shadow-[0_6px_16px_rgba(129,140,248,0.2)] transition-colors"
                  : "hover:text-white transition-colors"
              }
            >
              {item.label}
            </TrackedLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <TrackedLink
              href="/dashboard"
              eventName="nav_click"
              eventMeta={{ location: "header_desktop", target: "/dashboard" }}
              className="inline-flex px-4 py-2 border border-emerald-400/65 text-emerald-300 uppercase font-mono text-xs accent-interactive"
            >
              Dashboard
            </TrackedLink>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <div className="-mt-5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest">
                <TrackedLink
                  href="/sign-up"
                  eventName="nav_click"
                  eventMeta={{ location: "header_desktop", target: "/sign-up" }}
                  className="text-indigo-200 underline decoration-indigo-300/80 underline-offset-4 hover:text-indigo-100 transition-colors accent-interactive"
                >
                  Join now
                </TrackedLink>
                <span className="text-white/35">/</span>
                <TrackedLink
                  href="/sign-in"
                  eventName="nav_click"
                  eventMeta={{ location: "header_desktop", target: "/sign-in" }}
                  className="text-emerald-300 underline decoration-emerald-300/80 underline-offset-4 hover:text-emerald-200 transition-colors accent-interactive"
                >
                  Sign in
                </TrackedLink>
              </div>
              <TrackedLink
                href="/book-call"
                eventName="cta_click"
                eventMeta={{ location: "header_desktop", target: "/book-call" }}
                className="inline-flex px-4 py-2.5 border border-white/50 bg-white/[0.03] text-white uppercase font-mono text-xs tracking-widest cta-glow"
              >
                Initialize
              </TrackedLink>
            </div>
          )}
        </div>

        <button
          type="button"
          className="md:hidden w-10 h-10 border border-white/40 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition-colors accent-interactive"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden mt-4 overflow-hidden rounded-xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">Navigation</p>
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">Live</span>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs tracking-widest text-white/40">
            {NAV_ITEMS.map((item) => (
              <TrackedLink
                key={item.href}
                href={item.href}
                eventName="nav_click"
                eventMeta={{ location: "header_mobile", target: item.href }}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={closeMobileMenu}
                className={
                  pathname === item.href
                    ? "text-white border border-indigo-300/55 bg-indigo-400/10 px-3 py-2.5"
                    : "hover:text-white border border-transparent px-3 py-2.5 transition-colors"
                }
              >
                {item.label}
              </TrackedLink>
            ))}
          </div>

          <div className="my-4 h-px bg-white/10" />

          <div className="grid gap-2">
            {isAuthenticated ? (
              <TrackedLink
                href="/dashboard"
                eventName="nav_click"
                eventMeta={{ location: "header_mobile", target: "/dashboard" }}
                onClick={closeMobileMenu}
                className="w-full px-4 py-2.5 border border-emerald-400/65 text-emerald-300 uppercase font-mono text-xs text-center accent-interactive"
              >
                Dashboard
              </TrackedLink>
            ) : (
              <>
                <TrackedLink
                  href="/sign-in"
                  eventName="nav_click"
                  eventMeta={{ location: "header_mobile", target: "/sign-in_google_entry" }}
                  onClick={closeMobileMenu}
                  className="inline-flex w-full items-center justify-center gap-2 border border-indigo-300/50 bg-indigo-400/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white transition-colors hover:border-indigo-200/70 hover:bg-indigo-400/20"
                >
                  <GoogleIcon />
                  Sign in / Sign up with Google
                </TrackedLink>
              </>
            )}
          </div>
          {!isAuthenticated ? (
            <TrackedLink
              href="/book-call"
              eventName="cta_click"
              eventMeta={{ location: "header_mobile", target: "/book-call" }}
              onClick={closeMobileMenu}
              className="mt-3 inline-flex w-full items-center justify-center border border-white/45 bg-white/[0.03] px-3 py-2 text-white uppercase font-mono text-[10px] tracking-wider cta-glow"
            >
              Initialize
            </TrackedLink>
          ) : null}
        </nav>
      )}
    </header>
  );
}
