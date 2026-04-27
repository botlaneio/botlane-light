"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { ArrowRight, Database, Mail, Calendar, X, CheckCircle2, TrendingUp, MessageSquare, Zap, Shield, Target, Users } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionTag({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-12">
      <div className="w-[1px] h-8 bg-white/15" />
      <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest border border-white/15 px-3 py-1 bg-black">
        {index}
        {" // "}
        {label}
      </span>
    </div>
  );
}

type SchematicNode = {
  icon: React.ReactNode;
  label: string;
  sub: string;
  indent?: string;
};

type MetricCard = {
  icon: React.ReactNode;
  label: string;
  val: string;
  highlight?: boolean;
};

export default function Home() {
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handle = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [cursorX, cursorY]);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col font-sans text-white w-full">

      {/* Cursor Flashlight */}
      <motion.div
        className="pointer-events-none fixed z-50 rounded-full"
        style={{
          width: 500, height: 500,
          x: springX, y: springY,
          translateX: "-50%", translateY: "-50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Frame Border */}
      <div className="fixed inset-4 border border-white/10 z-0 pointer-events-none">
        {["-top-1 -left-1 border-t-2 border-l-2", "-top-1 -right-1 border-t-2 border-r-2", "-bottom-1 -left-1 border-b-2 border-l-2", "-bottom-1 -right-1 border-b-2 border-r-2"].map((cls, i) => (
          <div key={i} className={`absolute w-3 h-3 border-white/50 ${cls}`} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-12 pb-32 flex flex-col gap-32">

        <SiteHeader />

        {/* ── HERO ── */}
        <section className="w-full grid lg:grid-cols-[1fr_280px] gap-8 border border-white/15 bg-white/[0.015] p-10">
          <div className="flex flex-col gap-7 justify-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-2">
              <div className="font-mono text-xs text-white/50 tracking-widest border border-white/15 px-3 py-1 w-fit uppercase">STATUS: SYSTEM ONLINE</div>
              <div className="font-mono text-xs text-white/30 tracking-widest uppercase">&gt; FOR IT CONSULTANTS &amp; MSPS</div>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1]">
              Pipeline for IT firms<br />
              <span className="text-white/50">who hate selling.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-2">
              <p className="max-w-lg font-mono text-sm text-white/50 leading-relaxed">
                &gt; We build AI-powered outbound systems that consistently book qualified meetings — so you can focus on closing.
              </p>
              <p className="font-mono text-xs text-white/35 tracking-widest uppercase">[ 5–40 qualified meetings/month depending on plan ]</p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }} className="flex gap-4 mt-2">
              <Link
                href="/book-call"
                className="px-7 py-3.5 border border-white/50 text-white font-mono text-sm tracking-widest uppercase flex items-center gap-3 group/b hover:bg-white hover:text-black transition-colors"
              >
                Build_Pipeline <ArrowRight className="w-4 h-4 group-hover/b:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Schematic */}
          <div className="hidden lg:flex flex-col gap-5 border-l border-white/10 pl-8 relative justify-center">
            <span className="font-mono text-[10px] text-white/25 uppercase absolute -top-4 right-0 bg-black px-2 border border-white/10">SCHEMATIC VIEW</span>
            {([
              { icon: <Database className="w-4 h-4" />, label: "B2B_CONTACTS", sub: "2,000+ VERIFIED" },
              { icon: <Mail className="w-4 h-4" />, label: "AI_ENGINE", sub: "MULTI-CHANNEL", indent: "ml-4" },
              { icon: <Calendar className="w-4 h-4" />, label: "BOOKED_MEETINGS", sub: "READY TO CLOSE", indent: "ml-8" },
            ] as SchematicNode[]).map((n, i) => (
              <motion.div key={n.label} whileHover={{ borderColor: "rgba(255,255,255,0.6)", backgroundColor: "rgba(255,255,255,0.05)" }}
                transition={{ duration: 0.15 }}
                className={`border border-white/15 bg-transparent p-4 flex items-center gap-3 relative cursor-default ${n.indent ?? ""}`}>
                {i > 0 && <div className="absolute left-8 -top-5 w-[1px] h-5 bg-white/10" />}
                {i < 2 && <div className="absolute left-8 -bottom-5 w-[1px] h-5 bg-white/10" />}
                <div className="w-9 h-9 border border-white/25 flex items-center justify-center text-white/60">{n.icon}</div>
                <div>
                  <p className="font-bold text-sm uppercase">{n.label}</p>
                  <p className="font-mono text-[10px] text-white/35">{n.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 01 PROBLEM ── */}
        <Reveal>
          <section className="w-full flex flex-col items-center text-center">
            <SectionTag index="01" label="THE_PROBLEM" />
            <h2 className="text-4xl md:text-5xl font-bold uppercase leading-tight max-w-3xl mx-auto">
              Most IT firms rely on referrals<br />
              <span className="text-white/35">— until they dry up.</span>
            </h2>
            <div className="mt-12 grid md:grid-cols-3 gap-6 w-full text-left">
              {[
                { icon: <Zap className="w-5 h-5" />, title: "Referrals are unpredictable", body: "You can't forecast next month's revenue when it depends on who someone bumped into at a conference." },
                { icon: <Users className="w-5 h-5" />, title: "Hiring SDRs is slow & expensive", body: "A single SDR costs $80–100k/year, takes 6 months to ramp, and still may not produce consistent results." },
                { icon: <Target className="w-5 h-5" />, title: "You need a system, not a person", body: "Outbound at scale requires infrastructure, data, and automation — not headcount." },
              ].map(c => (
                <motion.div key={c.title} whileHover={{ borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.03)" }}
                  transition={{ duration: 0.15 }}
                  className="border border-white/10 p-6 bg-white/[0.01] flex flex-col gap-4 cursor-default">
                  <div className="text-white/50">{c.icon}</div>
                  <h3 className="font-bold uppercase text-sm tracking-wide">{c.title}</h3>
                  <p className="font-mono text-xs text-white/40 leading-relaxed">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 02 SOLUTION ── */}
        <Reveal delay={0.05}>
          <section className="w-full">
            <SectionTag index="02" label="THE_SOLUTION" />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <h2 className="text-4xl font-bold uppercase leading-tight">
                  A turnkey outbound engine.<br />
                  <span className="text-white/40">Deployed in weeks.</span>
                </h2>
                <p className="font-mono text-sm text-white/45 leading-relaxed max-w-md">
                  Botlane replaces a full SDR team with an AI-native, multi-channel outbound system. We handle targeting, messaging, sending, and inbox management — you just take the calls.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { step: "01", label: "Target", desc: "We build a precision list of your ideal clients — role, company size, industry, tech stack." },
                  { step: "02", label: "Reach", desc: "AI-crafted, hyper-personalised sequences across email and LinkedIn at scale." },
                  { step: "03", label: "Book", desc: "Replies are managed and qualified meetings land directly in your calendar." },
                ].map(s => (
                  <motion.div key={s.step} whileHover={{ borderColor: "rgba(255,255,255,0.45)" }} transition={{ duration: 0.15 }}
                    className="border border-white/12 p-5 flex items-start gap-5 cursor-default">
                    <span className="font-mono text-[10px] text-white/25 pt-1 flex-shrink-0">{s.step}</span>
                    <div>
                      <h3 className="font-bold uppercase text-sm mb-1">{s.label}</h3>
                      <p className="font-mono text-xs text-white/40 leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 03 AI DEMO ── */}
        <Reveal delay={0.05}>
          <section id="metrics" className="w-full">
            <SectionTag index="03" label="SYSTEM_METRICS" />
            <div className="border border-white/15 bg-white/[0.015] p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border border-white/25 flex items-center justify-center text-white/50">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase text-sm">Q3_CAMPAIGN: MSP_SERVICES</h3>
                    <p className="font-mono text-[10px] text-white/30">STATUS: ACTIVE • LAST_PING: 2m AGO</p>
                  </div>
                </div>
                <span className="hidden md:block font-mono text-[10px] border border-white/25 px-2 py-1 text-white/50">HEALTH: OPTIMAL</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {([
                  { icon: <Database className="w-3 h-3" />, label: "LEADS_FOUND", val: "1,240" },
                  { icon: <Mail className="w-3 h-3" />, label: "OUTREACH_SENT", val: "4,500" },
                  { icon: <MessageSquare className="w-3 h-3" />, label: "REPLIES", val: "84" },
                  { icon: <Calendar className="w-3 h-3" />, label: "MEETINGS_BOOKED", val: "12", highlight: true },
                ] as MetricCard[]).map(c => (
                  <motion.div key={c.label} whileHover={{ borderColor: "rgba(255,255,255,0.5)", backgroundColor: "rgba(255,255,255,0.04)" }}
                    transition={{ duration: 0.15 }}
                    className={`p-5 border flex flex-col gap-3 cursor-default ${c.highlight ? "border-white/40" : "border-white/12"}`}>
                    <div className="font-mono text-[10px] text-white/35 flex items-center gap-2">{c.icon}{c.label}</div>
                    <div className={`font-mono font-bold ${c.highlight ? "text-4xl" : "text-2xl text-white/75"}`}>{c.val}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 04 DIFFERENTIATION ── */}
        <Reveal delay={0.05}>
          <section className="w-full">
            <SectionTag index="04" label="WHAT_WE_DO_NOT_DO" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-white/10 p-8 bg-white/[0.01] relative">
                <span className="font-mono text-[10px] text-white/30 uppercase absolute -top-3 left-6 bg-black px-2 border border-white/10">EXCLUSIONS</span>
                <ul className="flex flex-col gap-5">
                  {["No paid ads or media buying", "No content creation or SEO", "No cold calling or manual dialing", "No CRM bloat or complex setups"].map(item => (
                    <li key={item} className="flex items-center gap-3 font-mono text-sm text-white/40">
                      <X className="w-4 h-4 text-white/25 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <motion.div whileHover={{ borderColor: "rgba(255,255,255,0.6)" }} transition={{ duration: 0.2 }}
                className="border border-white/35 p-8 bg-white/[0.02] relative cursor-default">
                <span className="font-mono text-[10px] text-white/50 uppercase absolute -top-3 left-6 bg-black px-2 border border-white/35">INCLUSIONS</span>
                <ul className="flex flex-col gap-5">
                  {["Targeted B2B Lead Sourcing", "Multi-channel Outreach (Email + LinkedIn)", "AI-Powered Personalisation at Scale", "Inbox Management & Meeting Booking"].map(item => (
                    <li key={item} className="flex items-center gap-3 font-mono text-sm text-white">
                      <CheckCircle2 className="w-4 h-4 text-white/50 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        </Reveal>

        {/* ── 05 PRICING ── */}
        <Reveal delay={0.05}>
          <section id="pricing" className="w-full">
            <SectionTag index="05" label="SPECIFICATIONS_AND_TIERS" />
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { tier: "LAUNCH", price: "$1,500", specs: ["500 contacts/mo", "Cold email only", "2 sending domains"], target: "5–10 CALLS/MO", featured: false },
                { tier: "GROWTH", price: "$2,500", specs: ["1,000 contacts/mo", "Email + LinkedIn", "4 sending domains"], target: "12–20 CALLS/MO", featured: true },
                { tier: "SCALE", price: "$5,000", specs: ["2,000+ contacts/mo", "Multi-channel dominance", "Dedicated support"], target: "25–40 CALLS/MO", featured: false },
              ].map(t => (
                <motion.div key={t.tier} whileHover={{ borderColor: "rgba(255,255,255,0.7)", backgroundColor: "rgba(255,255,255,0.04)" }}
                  transition={{ duration: 0.18 }}
                  className={`border p-7 flex flex-col relative cursor-default ${t.featured ? "border-white/50 bg-white/[0.025]" : "border-white/12 bg-white/[0.01]"}`}>
                  {t.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] bg-black border border-white/35 px-3 py-1 uppercase whitespace-nowrap">
                      RECOMMENDED
                    </div>
                  )}
                  <h3 className="font-bold uppercase text-lg">{t.tier}_TIER</h3>
                  <div className="my-5 border-y border-white/10 py-4">
                    <span className="font-mono text-3xl font-bold">{t.price}</span>
                    <span className="font-mono text-xs text-white/30">/MO</span>
                  </div>
                  <ul className="flex flex-col gap-3 mb-8 flex-grow font-mono text-xs">
                    {t.specs.map(s => (
                      <li key={s} className="flex items-center gap-2 text-white/45">
                        <span className="text-white/25">&gt;</span>{s}
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-white font-bold mt-3">
                      <span className="text-white/40">&gt;</span>TGT: {t.target}
                    </li>
                  </ul>
                  <Link
                    href="/book-call"
                    className="w-full py-3 border border-white/25 text-white/55 font-mono text-xs uppercase text-center hover:bg-white hover:text-black transition-colors"
                  >
                    INITIALIZE_{t.tier}
                  </Link>
                </motion.div>
              ))}
            </div>
            <p className="font-mono text-[10px] text-white/25 mt-6 text-center">* One-time setup fee of $500–$1,500 applies to all plans.</p>
          </section>
        </Reveal>

        {/* ── 06 ICP ── */}
        <Reveal delay={0.05}>
          <section className="w-full">
            <SectionTag index="06" label="IDEAL_CLIENT_PROFILE" />
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold uppercase leading-tight mb-6">
                  We work best with<br />
                  <span className="text-white/40">specific types of firms.</span>
                </h2>
                <p className="font-mono text-sm text-white/40 leading-relaxed">
                  Botlane is not for everyone. We work exclusively with IT services firms that have a defined offer, a clear target market, and the capacity to handle new clients.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { label: "IT Consultants & Managed Service Providers", check: true },
                  { label: "Cybersecurity firms", check: true },
                  { label: "Cloud & infrastructure service providers", check: true },
                  { label: "Digital transformation consultancies", check: true },
                  { label: "Agencies with no defined offer", check: false },
                  { label: "Firms not ready to handle inbound leads", check: false },
                ].map(r => (
                  <div key={r.label} className={`flex items-center gap-3 font-mono text-sm ${r.check ? "text-white" : "text-white/25 line-through"}`}>
                    {r.check
                      ? <CheckCircle2 className="w-4 h-4 text-white/50 flex-shrink-0" />
                      : <X className="w-4 h-4 text-white/20 flex-shrink-0" />}
                    {r.label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 07 TRANSPARENCY ── */}
        <Reveal delay={0.05}>
          <section className="w-full border border-white/10 bg-white/[0.01] p-10">
            <SectionTag index="07" label="TRANSPARENCY" />
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: <Shield className="w-6 h-6" />, title: "No Long-Term Lock-In", body: "Monthly rolling contracts. If we don&apos;t perform, you can leave. We prefer it that way." },
                { icon: <Target className="w-6 h-6" />, title: "No Vanity Metrics", body: "We report on meetings booked, not opens, clicks, or impressions. You only care about calls." },
                { icon: <Zap className="w-6 h-6" />, title: "Ramp in 2–3 Weeks", body: "Setup fee covers infrastructure. First outreach goes live within 14–21 days of onboarding." },
              ].map(c => (
                <motion.div key={c.title} whileHover={{ borderColor: "rgba(255,255,255,0.35)" }} transition={{ duration: 0.15 }}
                  className="flex flex-col items-center gap-4 p-6 border border-transparent cursor-default">
                  <div className="text-white/40">{c.icon}</div>
                  <h3 className="font-bold uppercase text-sm tracking-wide">{c.title}</h3>
                  <p className="font-mono text-xs text-white/35 leading-relaxed">{c.body}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 08 CTA ── */}
        <Reveal delay={0.05}>
          <section id="contact" className="w-full flex flex-col items-center text-center py-16 border-t border-white/10">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest border border-white/10 px-3 py-1 mb-10 bg-black">
              08 // INITIALIZE_SEQUENCE
            </span>
            <h2 className="text-5xl md:text-6xl font-bold uppercase leading-tight max-w-2xl mx-auto mb-6">
              Ready to stop relying on referrals?
            </h2>
            <p className="font-mono text-sm text-white/40 max-w-lg mb-10 leading-relaxed">
              Book a 20-minute strategy call. We&apos;ll show you exactly how the system works and whether it&apos;s right for your firm.
            </p>
            <Link
              href="/book-call"
              className="px-10 py-5 border border-white/50 text-white font-mono text-sm tracking-widest uppercase flex items-center gap-3 group/c mx-auto hover:bg-white hover:text-black transition-colors"
            >
              Book a Strategy Call
              <ArrowRight className="w-5 h-5 group-hover/c:translate-x-1 transition-transform" />
            </Link>
          </section>
        </Reveal>

        <SiteFooter />
      </div>
    </main>
  );
}
