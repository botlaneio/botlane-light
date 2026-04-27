import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const tiers = [
  {
    tier: "LAUNCH",
    price: "$1,500/mo",
    details: ["500 contacts/mo", "Cold email only", "2 sending domains"],
  },
  {
    tier: "GROWTH",
    price: "$2,500/mo",
    details: ["1,000 contacts/mo", "Email + LinkedIn", "4 sending domains"],
  },
  {
    tier: "SCALE",
    price: "$5,000/mo",
    details: ["2,000+ contacts/mo", "Multi-channel dominance", "Dedicated support"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-12 pb-20 flex flex-col gap-12">
        <SiteHeader />
        <section>
          <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-4">
            05 // SPECIFICATIONS_AND_TIERS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">Pricing</h1>
          <p className="font-mono text-sm text-white/45 max-w-2xl mb-8">
            Each tier is now available on its own dedicated route for easier
            comparison and future expansion.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <article key={tier.tier} className="border border-white/12 bg-white/[0.01] p-7">
                <h2 className="font-bold uppercase text-lg">{tier.tier}_TIER</h2>
                <p className="font-mono text-3xl font-bold my-5">{tier.price}</p>
                <ul className="flex flex-col gap-3 font-mono text-xs text-white/45">
                  {tier.details.map((detail) => (
                    <li key={detail}>&gt; {detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
