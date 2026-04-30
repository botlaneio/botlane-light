import Link from "next/link";
import { Activity } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/leads", label: "Leads" },
  { href: "/settings", label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-white/10 bg-white/[0.015] px-4 py-5 md:block">
      <Link className="inline-flex items-center" href="/dashboard">
        <img
          src="/botlane-logo-horizontal.svg"
          alt="Botlane"
          className="h-8 w-auto"
        />
      </Link>
      <p className="mt-3 border border-emerald-400/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
        <Activity className="mr-1 inline h-3 w-3" />
        Session Active
      </p>
      <nav className="mt-8 grid gap-1">
        {navItems.map((item) => (
          <Link
            className="rounded-md border border-transparent px-3 py-2 font-mono text-xs uppercase tracking-widest text-zinc-300 hover:border-indigo-300/35 hover:bg-indigo-400/10 hover:text-white"
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
