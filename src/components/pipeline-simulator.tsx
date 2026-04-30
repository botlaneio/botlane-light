"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/track-event";

type PipelineSimulatorProps = {
  className?: string;
};

type ScenarioId = "launch" | "optimize" | "scale";
type FocusId = "targeting" | "messaging" | "handoff";

type ScenarioConfig = {
  id: ScenarioId;
  label: string;
  title: string;
  summary: string;
  challenge: string;
  outcomes: { label: string; value: string }[];
  technicalNotes: { title: string; body: string }[];
};

const SCENARIOS: ScenarioConfig[] = [
  {
    id: "launch",
    label: "Launch",
    title: "Start outbound without adding headcount",
    summary: "Best when you need predictable meetings from scratch.",
    challenge: "No repeatable outbound system is in place yet.",
    outcomes: [
      { label: "Ramp time", value: "14-21 days" },
      { label: "Qualified calls", value: "8-15/mo" },
      { label: "Ops effort", value: "Low" },
    ],
    technicalNotes: [
      { title: "Targeting", body: "Build ICP lists by offer, company profile, and intent signals before first send." },
      { title: "Messaging", body: "Generate personalized outbound variants and route by confidence score." },
      { title: "Handoff", body: "Auto-qualify positive replies and place ready leads directly into calendar flow." },
    ],
  },
  {
    id: "optimize",
    label: "Optimize",
    title: "Improve consistency in an existing motion",
    summary: "Best when outreach exists but results are uneven.",
    challenge: "Volume is there, but reply quality and handoff consistency are weak.",
    outcomes: [
      { label: "Reply quality", value: "+18-32%" },
      { label: "No-shows", value: "-12-20%" },
      { label: "Pipeline confidence", value: "High" },
    ],
    technicalNotes: [
      { title: "Targeting", body: "Segment current lists into intent tiers and suppress low-fit profiles." },
      { title: "Messaging", body: "Tune tone and sequence timing per segment to improve response quality." },
      { title: "Handoff", body: "Apply stricter qualification rules before calendar placement." },
    ],
  },
  {
    id: "scale",
    label: "Scale",
    title: "Increase throughput while keeping quality stable",
    summary: "Best when you have signal and need more qualified volume.",
    challenge: "Manual workflows cap growth and create uneven lead quality.",
    outcomes: [
      { label: "Outreach capacity", value: "2-3x" },
      { label: "Qualified meetings", value: "20-40/mo" },
      { label: "Manual work", value: "-60%+" },
    ],
    technicalNotes: [
      { title: "Targeting", body: "Expand into adjacent segments while preserving fit score thresholds." },
      { title: "Messaging", body: "Maintain deliverability with channel balancing and paced send windows." },
      { title: "Handoff", body: "Prioritize high-intent replies and route to the right rep automatically." },
    ],
  },
];

const FOCUS_LABELS: Record<FocusId, string> = {
  targeting: "Targeting",
  messaging: "Messaging",
  handoff: "Handoff",
};

const STORAGE_KEY = "botlane.pipeline.story";
const DEFAULT_SCENARIO: ScenarioId = "optimize";

function parseScenario(value: string | null): ScenarioId | null {
  if (value === "launch" || value === "optimize" || value === "scale") {
    return value;
  }
  return null;
}

export function PipelineSimulator({ className }: PipelineSimulatorProps) {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(DEFAULT_SCENARIO);
  const [isScenarioReady, setIsScenarioReady] = useState(false);
  const [focus, setFocus] = useState<FocusId>("targeting");
  const [showTechnical, setShowTechnical] = useState(false);

  const scenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenarioId) ?? SCENARIOS[1],
    [scenarioId],
  );

  const activeNote = useMemo(() => {
    if (focus === "targeting") return scenario.technicalNotes[0];
    if (focus === "messaging") return scenario.technicalNotes[1];
    return scenario.technicalNotes[2];
  }, [focus, scenario]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const scenarioFromQuery = parseScenario(params.get("scenario"));
    if (scenarioFromQuery) {
      setScenarioId(scenarioFromQuery);
      setIsScenarioReady(true);
      return;
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      const storedScenario = parseScenario(parsed?.scenario ?? null);
      if (storedScenario) {
        setScenarioId(storedScenario);
      }
    } catch {
      // Ignore storage read failures.
    }

    setIsScenarioReady(true);
  }, []);

  useEffect(() => {
    if (!isScenarioReady) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    params.set("scenario", scenarioId);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}#pipeline-experience`);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ scenario: scenarioId }));
    } catch {
      // Ignore storage write failures.
    }
  }, [scenarioId, isScenarioReady]);

  function handleScenarioSelect(next: ScenarioId) {
    setScenarioId(next);
    setFocus("targeting");
    trackEvent("pipeline_story_scenario_select", { scenario: next });
  }

  function handleTechnicalToggle() {
    setShowTechnical((prev) => {
      const next = !prev;
      trackEvent("pipeline_story_technical_toggle", { open: next });
      return next;
    });
  }

  return (
    <section id="pipeline-experience" className={className}>
      <div className="border border-white/15 bg-white/[0.015] p-4 sm:p-6 md:p-8">
        <div className="mb-5 space-y-3 sm:mb-6">
          <span className="inline-flex border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/45">
            Interactive // Pipeline Story
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase leading-tight">
            A guided view of your
            <span className="text-white/45"> outbound system</span>
          </h3>
          <p className="max-w-2xl font-mono text-[11px] sm:text-xs uppercase tracking-widest text-white/45 leading-relaxed">
            Pick your current stage. The experience adapts and keeps context so it feels like guidance, not a simulation.
          </p>
        </div>

        <div className="mb-6 grid gap-2 md:grid-cols-3">
          {SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleScenarioSelect(item.id)}
              className={`border min-h-28 p-3 sm:p-4 text-left transition-colors ${
                scenarioId === item.id
                  ? "border-white/50 bg-white/[0.04]"
                  : "border-white/15 bg-black/20 hover:border-white/40"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">{item.label}</p>
              <p className="mt-2 text-sm sm:text-[15px] font-semibold uppercase leading-snug">{item.title}</p>
              <p className="mt-2 font-mono text-[11px] text-white/50 leading-relaxed">{item.summary}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className="border border-white/15 bg-black/25 p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">Current constraint</p>
              <p className="mt-3 text-base sm:text-lg font-semibold uppercase leading-snug">{scenario.challenge}</p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-white/55">
                Botlane handles targeting, messaging, delivery, and qualification in one flow, so your team focuses on sales conversations.
              </p>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {scenario.outcomes.map((item) => (
                  <div key={item.label} className="border border-white/15 bg-white/[0.01] p-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">{item.label}</p>
                    <p className="mt-1 text-lg sm:text-xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href="/book-call"
                  onClick={() => trackEvent("pipeline_story_cta_click", { target: "/book-call", scenario: scenario.id })}
                  className="border border-white/50 px-4 py-3 sm:py-2 text-center font-mono text-xs uppercase tracking-widest cta-glow"
                >
                  Start This Setup →
                </Link>
                <Link
                  href="/contact"
                  onClick={() => trackEvent("pipeline_story_cta_click", { target: "/contact", scenario: scenario.id })}
                  className="border border-white/25 px-4 py-3 sm:py-2 text-center font-mono text-xs uppercase tracking-widest text-white/75 hover:text-white"
                >
                  Talk Through It →
                </Link>
              </div>
            </div>

            <div className="border border-white/15 bg-black/20 p-4 sm:p-5">
              <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">Behind the scenes</p>
                <button
                  type="button"
                  onClick={handleTechnicalToggle}
                  className={`w-full sm:w-auto border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    showTechnical ? "border-white/45 text-white" : "border-white/20 text-white/60 hover:border-white/35"
                  }`}
                >
                  {showTechnical ? "Hide Technical View" : "Show Technical View"}
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {(Object.keys(FOCUS_LABELS) as FocusId[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFocus(item)}
                    className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${
                      focus === item ? "border-white/50 text-white" : "border-white/20 text-white/55"
                    }`}
                  >
                    {FOCUS_LABELS[item]}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${scenario.id}-${focus}-${showTechnical ? "tech" : "plain"}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="border border-white/15 bg-white/[0.01] p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">{activeNote.title}</p>
                  <p className="mt-2 text-sm text-white/80">
                    {showTechnical
                      ? activeNote.body
                      : "This stage runs quietly in the background so your team gets only sales-ready opportunities."}
                  </p>
                </motion.div>
              </AnimatePresence>

              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-white/35">
                Continuity enabled: your selected scenario is remembered across visits.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
