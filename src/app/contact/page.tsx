import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-12 pb-20 flex flex-col gap-12">
        <SiteHeader />
        <section className="border border-white/15 bg-white/[0.015] p-10 text-center">
          <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-6">
            08 // INITIALIZE_SEQUENCE
          </p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase leading-tight mb-4">
            Book a Strategy Call
          </h1>
          <p className="font-mono text-sm text-white/45 max-w-2xl mx-auto mb-8">
            Use this page as the dedicated contact route. You can replace this
            with a form, scheduler embed, or CRM integration when ready.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-4 border border-white/50 font-mono text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
              Start Onboarding
            </button>
            <Link
              href="/"
              className="px-8 py-4 border border-white/25 font-mono text-sm tracking-widest uppercase text-white/70 hover:text-white transition-colors"
            >
              Back Home
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
}
