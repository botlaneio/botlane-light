import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const metricCards = [
  { label: "LEADS_FOUND", value: "1,240" },
  { label: "OUTREACH_SENT", value: "4,500" },
  { label: "REPLIES", value: "84" },
  { label: "MEETINGS_BOOKED", value: "12" },
];

export default function MetricsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-12 pb-20 flex flex-col gap-12">
        <SiteHeader />
        <section className="border border-white/15 bg-white/[0.015] p-8">
          <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-4">
            03 // SYSTEM_METRICS
          </p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-4">
            Campaign Performance
          </h1>
          <p className="font-mono text-sm text-white/45 max-w-2xl mb-8">
            This page isolates the core campaign outcomes so visitors can focus
            on pipeline numbers without scrolling through the entire home page.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricCards.map((card) => (
              <div key={card.label} className="p-5 border border-white/12 flex flex-col gap-3">
                <div className="font-mono text-[10px] text-white/35">{card.label}</div>
                <div className="font-mono text-3xl font-bold">{card.value}</div>
              </div>
            ))}
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
