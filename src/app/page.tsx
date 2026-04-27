"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useState } from "react";
import { ArrowRight, Database, Mail, Calendar, X, CheckCircle2, Zap, Shield, Target, Users } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PipelineSimulator } from "@/components/pipeline-simulator";
import { TrackedLink } from "@/components/tracked-link";

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

function TypewriterLine({
  text,
  speedMs = 38,
  className,
}: {
  text: string;
  speedMs?: number;
  className?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleCount((prev) => (prev < text.length ? prev + 1 : prev));
    }, speedMs);
    return () => window.clearInterval(interval);
  }, [text, speedMs]);

  useEffect(() => {
    const caretInterval = window.setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500);
    return () => window.clearInterval(caretInterval);
  }, []);

  return (
    <p className={className}>
      {text.slice(0, visibleCount)}
      <span className={`${showCaret ? "opacity-100" : "opacity-0"} transition-opacity`}>_</span>
    </p>
  );
}

type SchematicNode = {
  icon: React.ReactNode;
  label: string;
  sub: string;
  indent?: string;
};

export default function Home() {
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const springX = useSpring(cursorX, { stiffness: 240, damping: 30, mass: 0.25 });
  const springY = useSpring(cursorY, { stiffness: 240, damping: 30, mass: 0.25 });

  useEffect(() => {
    let rafId = 0;
    const latest = { x: -400, y: -400 };

    const flush = () => {
      cursorX.set(latest.x);
      cursorY.set(latest.y);
      rafId = 0;
    };

    const handle = (e: MouseEvent) => {
      latest.x = e.clientX;
      latest.y = e.clientY;
      if (!rafId) {
        rafId = window.requestAnimationFrame(flush);
      }
    };

    window.addEventListener("mousemove", handle, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handle);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [cursorX, cursorY]);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col font-sans text-white w-full">

      {/* Cursor Flashlight */}
      <motion.div
        className="pointer-events-none fixed z-50 rounded-full will-change-transform"
        style={{
          width: 360, height: 360,
          x: springX, y: springY,
          translateX: "-50%", translateY: "-50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 68%)",
        }}
      />

      {/* Frame Border */}
      <div className="fixed inset-4 border border-white/10 z-0 pointer-events-none">
        {["-top-1 -left-1 border-t-2 border-l-2", "-top-1 -right-1 border-t-2 border-r-2", "-bottom-1 -left-1 border-b-2 border-l-2", "-bottom-1 -right-1 border-b-2 border-r-2"].map((cls, i) => (
          <div key={i} className={`absolute w-3 h-3 border-white/50 ${cls}`} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-14 pb-36 flex flex-col gap-28">
        <div className="flex flex-col gap-4">
          <SiteHeader />

          {/* ── HERO ── */}
          <motion.section
            className="w-full grid lg:grid-cols-[1fr_280px] gap-8 border border-white/15 bg-white/[0.015] p-10 relative overflow-hidden"
          animate={{
            boxShadow: [
              "inset 0 0 0 1px rgba(255,255,255,0.02)",
              "inset 0 0 0 1px rgba(255,255,255,0.08)",
              "inset 0 0 0 1px rgba(255,255,255,0.02)",
            ],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity: [0.08, 0.18, 0.08],
            }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.14), transparent 52%)",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.22]"
            animate={{ backgroundPositionX: ["0%", "100%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.26) 50%, transparent 100%)",
              backgroundSize: "220% 100%",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.24]"
            animate={{ opacity: [0.14, 0.26, 0.14] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 36px)",
            }}
          />
          <div className="flex flex-col gap-7 justify-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-2">
              <div className="font-mono text-xs text-white/50 tracking-widest border border-white/15 px-3 py-1 w-fit uppercase">STATUS: SYSTEM ONLINE</div>
              <TypewriterLine
                text="> FOR IT CONSULTANTS & MSPS"
                className="font-mono text-xs text-white/30 tracking-widest uppercase min-h-[16px]"
              />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[1.1]">
              Pipeline for IT firms<br />
              <span className="text-white/50">who hate selling.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col gap-3">
              <p className="max-w-lg font-mono text-sm text-white/50 leading-loose">
                &gt; We build AI-powered outbound systems that consistently book qualified meetings — so you can focus on closing.
              </p>
              <p className="font-mono text-xs text-white/35 tracking-widest uppercase">
                5–40 qualified meetings/month depending on plan
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }} className="flex flex-wrap gap-4 mt-2">
              <TrackedLink
                href="/book-call"
                eventName="cta_click"
                eventMeta={{ location: "home_hero", target: "/book-call" }}
                className="px-7 py-3.5 border border-white/50 text-white font-mono text-sm tracking-widest uppercase flex items-center gap-3 group/b cta-glow"
              >
                Book_Pipeline_Call
                <ArrowRight className="w-4 h-4 group-hover/b:translate-x-1 transition-transform" />
              </TrackedLink>
              <TrackedLink
                href="/how-it-works"
                eventName="cta_click"
                eventMeta={{ location: "home_hero", target: "/how-it-works" }}
                className="px-7 py-3.5 border border-white/25 text-white/75 font-mono text-sm tracking-widest uppercase cta-glow"
              >
                See How It Works
              </TrackedLink>
              <TrackedLink
                href="#pipeline-experience"
                eventName="cta_click"
                eventMeta={{ location: "home_hero", target: "#pipeline-experience" }}
                className="px-7 py-3.5 border border-white/30 text-white/80 font-mono text-sm tracking-widest uppercase cta-glow"
              >
                Run Live Demo →
              </TrackedLink>
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
              <motion.div key={n.label}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
                animate={{
                  y: [0, -1.5, 0],
                }}
                className={`border border-white/15 bg-transparent p-4 flex items-center gap-3 relative cursor-default transform-gpu will-change-transform hover:border-white/55 hover:bg-white/[0.03] transition-colors ${n.indent ?? ""}`}>
                {i > 0 && (
                  <div className="absolute left-8 -top-5 w-[1px] h-5 bg-white/10 overflow-hidden">
                    <motion.div
                      className="w-full h-2 bg-white/45"
                      animate={{ y: ["-100%", "150%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: i * 0.25 }}
                    />
                  </div>
                )}
                {i < 2 && (
                  <div className="absolute left-8 -bottom-5 w-[1px] h-5 bg-white/10 overflow-hidden">
                    <motion.div
                      className="w-full h-2 bg-white/45"
                      animate={{ y: ["-100%", "150%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: (i + 1) * 0.2 }}
                    />
                  </div>
                )}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.09) 50%, transparent 58%)",
                  }}
                />
                <div className="w-9 h-9 border border-white/25 flex items-center justify-center text-white/60">{n.icon}</div>
                <div>
                  <p className="font-bold text-sm uppercase">{n.label}</p>
                  <p className="font-mono text-[10px] text-white/35">{n.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
          </motion.section>
        </div>

        {/* ── 01 PROBLEM ── */}
        <Reveal>
          <section className="w-full -mt-10 md:-mt-12 flex flex-col items-center text-center">
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
                <div key={c.title}
                  className="border border-white/10 p-6 bg-white/[0.01] flex flex-col gap-4 cursor-default hover:border-white/50 hover:bg-white/[0.03] transition-colors">
                  <div className="text-white/50">{c.icon}</div>
                  <h3 className="font-bold uppercase text-sm tracking-wide">{c.title}</h3>
                  <p className="font-mono text-xs text-white/40 leading-loose">{c.body}</p>
                </div>
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
                <p className="font-mono text-sm text-white/45 leading-loose max-w-md">
                  Botlane replaces a full SDR team with an AI-native, multi-channel outbound system. We handle targeting, messaging, sending, and inbox management — you just take the calls.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { step: "01", label: "Target", desc: "We build a precision list of your ideal clients — role, company size, industry, tech stack." },
                  { step: "02", label: "Reach", desc: "AI-crafted, hyper-personalised sequences across email and LinkedIn at scale." },
                  { step: "03", label: "Book", desc: "Replies are managed and qualified meetings land directly in your calendar." },
                ].map(s => (
                  <div key={s.step}
                    className="border border-white/12 p-5 flex items-start gap-5 cursor-default hover:border-white/45 transition-colors">
                    <span className="font-mono text-[10px] text-white/25 pt-1 flex-shrink-0">{s.step}</span>
                    <div>
                      <h3 className="font-bold uppercase text-sm mb-1">{s.label}</h3>
                      <p className="font-mono text-xs text-white/40 leading-loose">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── 03 AI DEMO ── */}
        <Reveal delay={0.05}>
          <section id="metrics" className="w-full">
            <SectionTag index="03" label="SYSTEM_METRICS" />
            <PipelineSimulator />
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
                  {["No paid ads", "No content marketing", "No cold calling", "No CRM complexity"].map(item => (
                    <li key={item} className="flex items-center gap-3 font-mono text-sm text-white/40">
                      <X className="w-4 h-4 text-white/25 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="border border-white/35 p-8 bg-white/[0.02] relative cursor-default hover:border-white/60 transition-colors">
                <span className="font-mono text-[10px] text-white/50 uppercase absolute -top-3 left-6 bg-black px-2 border border-white/35">INCLUSIONS</span>
                <ul className="flex flex-col gap-5">
                  {["Targeted B2B Lead Sourcing", "Multi-channel Outreach (Email + LinkedIn)", "AI-Powered Personalisation at Scale", "Inbox Management & Meeting Booking"].map(item => (
                    <li key={item} className="flex items-center gap-3 font-mono text-sm text-white">
                      <CheckCircle2 className="w-4 h-4 text-white/50 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-7 text-center font-mono text-sm text-white/65">
              Just qualified meetings on your calendar.
            </p>
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
                <div key={t.tier}
                  className={`border p-7 flex flex-col relative cursor-default hover:border-white/70 hover:bg-white/[0.04] transition-colors ${t.featured ? "border-white/50 bg-white/[0.025]" : "border-white/12 bg-white/[0.01]"}`}>
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
                  <TrackedLink
                    href="/book-call"
                    eventName="cta_click"
                    eventMeta={{ location: "home_pricing_card", target: `/book-call_${t.tier}` }}
                    className="w-full py-3 border border-white/25 text-white/55 font-mono text-xs uppercase text-center cta-glow"
                  >
                    Initialize {t.tier} →
                  </TrackedLink>
                </div>
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
                <p className="font-mono text-sm text-white/40 leading-loose">
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
                <div key={c.title}
                  className="flex flex-col items-center gap-4 p-6 border border-transparent cursor-default hover:border-white/35 transition-colors">
                  <div className="text-white/40">{c.icon}</div>
                  <h3 className="font-bold uppercase text-sm tracking-wide">{c.title}</h3>
                  <p className="font-mono text-xs text-white/35 leading-loose">{c.body}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ── 08 CTA ── */}
        <Reveal delay={0.05}>
          <section id="contact" className="w-full flex flex-col items-center text-center py-20 border-t border-white/10">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest border border-white/10 px-3 py-1 mb-10 bg-black">
              08 // INITIALIZE_SEQUENCE
            </span>
            <h2 className="text-5xl md:text-6xl font-bold uppercase leading-tight max-w-3xl mx-auto mb-6">
              Get a predictable pipeline — without hiring SDRs.
            </h2>
            <p className="font-mono text-sm text-white/40 max-w-lg mb-10 leading-relaxed">
              Book a 20-minute strategy call. We&apos;ll show you exactly how the system works and whether it&apos;s right for your firm.
            </p>
            <TrackedLink
              href="/book-call"
              eventName="cta_click"
              eventMeta={{ location: "home_final_cta", target: "/book-call" }}
              className="px-10 py-5 border border-white/50 text-white font-mono text-sm tracking-widest uppercase flex items-center gap-3 group/c mx-auto cta-glow"
            >
              Book a Strategy Call
              <ArrowRight className="w-5 h-5 group-hover/c:translate-x-1 transition-transform" />
            </TrackedLink>
          </section>
        </Reveal>

        <SiteFooter />
      </div>
    </main>
  );
}
