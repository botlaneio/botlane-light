import Link from "next/link";

const FOOTER_LINK_GROUPS = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Metrics", href: "/metrics" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Lead Sourcing", href: "/metrics" },
      { label: "Outbound System", href: "/pricing" },
      { label: "Meeting Booking", href: "/contact" },
      { label: "Campaign Support", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Botlane", href: "/" },
      { label: "Case Signals", href: "/metrics" },
      { label: "Plans", href: "/pricing" },
      { label: "Book a Call", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/10 pt-10 mt-6">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
            Botlane.io
          </p>
          <h3 className="text-xl font-bold uppercase tracking-wide">
            Pipeline-as-a-service
          </h3>
          <p className="font-mono text-xs text-white/40 leading-relaxed normal-case">
            We build outbound systems for IT firms that want predictable
            meetings without managing SDR headcount.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-4 py-2 border border-white/40 text-white/70 text-[10px] font-mono uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Book Strategy Call
          </Link>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
              {group.title}
            </p>
            <div className="flex flex-col gap-2">
              {group.links.map((linkItem) => (
                <Link
                  key={`${group.title}-${linkItem.label}`}
                  href={linkItem.href}
                  className="font-mono text-xs text-white/35 hover:text-white/70 transition-colors normal-case"
                >
                  {linkItem.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-5 border-t border-white/8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <span className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
          BOTLANE.IO // END_OF_DOCUMENT
        </span>
        <div className="flex items-center gap-4 font-mono text-[10px] text-white/30 uppercase tracking-widest">
          <Link href="/" className="hover:text-white/65 transition-colors">
            Privacy
          </Link>
          <Link href="/" className="hover:text-white/65 transition-colors">
            Terms
          </Link>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
