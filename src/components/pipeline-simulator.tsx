"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, Mail, Send, X } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useReducer,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { trackEvent } from "@/lib/track-event";

type PipelineSimulatorProps = {
  className?: string;
};

type Tone = "Direct" | "Consultative" | "Technical";
type Cadence = "Light" | "Standard" | "Aggressive";
type ReplyLogic = "Balanced" | "Strict" | "Fast-track";
type Icp = "SMB" | "Mid-market" | "Enterprise";
type Timezone = "GMT" | "IST" | "EST" | "PST";
type ScenarioPreset = "Fast Growth" | "Balanced" | "High Intent";

type SimulatorState = {
  step: number;
  phase: "configure" | "processing" | "results";
  offer: string;
  location: string;
  icp: Icp;
  tone: Tone;
  channels: { email: boolean; linkedin: boolean };
  cadence: Cadence;
  replyLogic: ReplyLogic;
  timezone: Timezone;
};

type SimulatorAction =
  | { type: "hydrate"; payload: Partial<SimulatorState> }
  | { type: "set_step"; payload: number }
  | { type: "set_phase"; payload: SimulatorState["phase"] }
  | { type: "set_offer"; payload: string }
  | { type: "set_location"; payload: string }
  | { type: "set_icp"; payload: Icp }
  | { type: "set_tone"; payload: Tone }
  | { type: "toggle_channel"; payload: "email" | "linkedin" }
  | { type: "set_cadence"; payload: Cadence }
  | { type: "set_reply_logic"; payload: ReplyLogic }
  | { type: "set_timezone"; payload: Timezone };

const INDUSTRY_SUGGESTIONS = [
  "IT services",
  "MSP",
  "SaaS",
  "Cybersecurity",
  "Cloud consulting",
  "DevOps services",
  "Data engineering",
  "Software development agency",
  "ERP consulting",
  "AI automation services",
];

const COUNTRY_SUGGESTIONS = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "New Zealand",
  "Ireland",
  "India",
  "Singapore",
  "South Africa",
  "Philippines",
  "Nigeria",
  "Kenya",
  "Ghana",
  "Jamaica",
];

const INITIAL_STATE: SimulatorState = {
  step: 0,
  phase: "configure",
  offer: "IT services",
  location: "USA",
  icp: "Mid-market",
  tone: "Consultative",
  channels: { email: true, linkedin: true },
  cadence: "Standard",
  replyLogic: "Balanced",
  timezone: "GMT",
};
const STEP_IMPACT_COPY = [
  "Business impact: improves targeting precision before outreach spend.",
  "Business impact: increases opens and reply quality from the same audience.",
  "Business impact: controls pipeline speed without adding SDR headcount.",
  "Business impact: balances volume vs lead quality for your sales team.",
  "Business impact: reduces scheduling friction and time-to-meeting.",
];

function simulatorReducer(state: SimulatorState, action: SimulatorAction): SimulatorState {
  switch (action.type) {
    case "hydrate":
      return { ...state, ...action.payload };
    case "set_step":
      return { ...state, step: Math.max(0, Math.min(4, action.payload)), phase: "configure" };
    case "set_phase":
      return { ...state, phase: action.payload };
    case "set_offer":
      return { ...state, offer: action.payload };
    case "set_location":
      return { ...state, location: action.payload };
    case "set_icp":
      return { ...state, icp: action.payload, replyLogic: "Balanced" };
    case "set_tone":
      return { ...state, tone: action.payload };
    case "toggle_channel":
      return {
        ...state,
        channels: { ...state.channels, [action.payload]: !state.channels[action.payload] },
      };
    case "set_cadence":
      return { ...state, cadence: action.payload };
    case "set_reply_logic":
      return { ...state, replyLogic: action.payload };
    case "set_timezone":
      return { ...state, timezone: action.payload };
    default:
      return state;
  }
}

function StepBadge({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] text-white/45 uppercase tracking-widest border border-white/20 px-3 py-1">
      {children}
    </span>
  );
}

function TypingLine({ text }: { text: string }) {
  const [visible, setVisible] = useState(text.slice(0, 20));
  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setVisible(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
      }
    }, 12);
    return () => window.clearInterval(id);
  }, [text]);
  return <p>{visible}</p>;
}

function getDerived(state: SimulatorState) {
  const sendsBase = state.cadence === "Aggressive" ? 5600 : state.cadence === "Light" ? 3000 : 4200;
  const channelFactor = state.channels.email && state.channels.linkedin ? 1 : 0.72;
  const toneLift = state.tone === "Technical" ? 1.08 : state.tone === "Direct" ? 0.98 : 1.02;
  const icpLift = state.icp === "SMB" ? 1.04 : state.icp === "Enterprise" ? 0.93 : 1;
  const openRate = Math.round(34 * toneLift * icpLift);
  const replyRate = Math.round(8 * channelFactor * toneLift);
  const qualifiedRate = Math.round((state.replyLogic === "Strict" ? 52 : state.replyLogic === "Fast-track" ? 61 : 57) * icpLift);
  const emailsSent = Math.round(sendsBase * channelFactor);
  const replies = Math.round(emailsSent * (replyRate / 100));
  const qualified = Math.round(replies * (qualifiedRate / 100));
  const meetingsLow = Math.max(6, Math.round(qualified * 0.45));
  const meetingsHigh = Math.max(meetingsLow + 3, Math.round(qualified * 0.72));
  return {
    openRate,
    replyRate,
    qualifiedRate,
    meetings: `${meetingsLow}-${meetingsHigh}`,
    emailsSent,
    replies,
    qualified,
  };
}

export function PipelineSimulator({ className }: PipelineSimulatorProps) {
  const [state, dispatch] = useReducer(simulatorReducer, INITIAL_STATE);
  const [offerFocused, setOfferFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const [offerHighlight, setOfferHighlight] = useState(0);
  const [locationHighlight, setLocationHighlight] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  const derived = useMemo(() => getDerived(state), [state]);
  const filteredIndustries = useMemo(
    () => INDUSTRY_SUGGESTIONS.filter((x) => x.toLowerCase().includes(state.offer.toLowerCase())).slice(0, 6),
    [state.offer],
  );
  const filteredCountries = useMemo(
    () => COUNTRY_SUGGESTIONS.filter((x) => x.toLowerCase().includes(state.location.toLowerCase())).slice(0, 6),
    [state.location],
  );

  const emailPreview = useMemo(() => {
    if (state.tone === "Technical") {
      return `Hi, we mapped delivery gaps in ${state.offer} teams across ${state.location}. Our AI outbound engine ships qualified meetings without additional SDR hires.`;
    }
    if (state.tone === "Direct") {
      return `Hi, we help ${state.offer} firms in ${state.location} add qualified meetings every month using automated outbound infrastructure.`;
    }
    return `Hi, teams offering ${state.offer} in ${state.location} use Botlane to run AI-personalized outbound that consistently books qualified calls.`;
  }, [state.offer, state.location, state.tone]);
  const pipelineConfidence = useMemo(() => {
    let score = 66;
    if (state.channels.email && state.channels.linkedin) score += 10;
    if (state.cadence === "Aggressive") score += 8;
    if (state.replyLogic === "Fast-track") score += 6;
    if (state.tone === "Technical") score += 4;
    if (state.icp === "Mid-market") score += 3;
    if (!state.channels.email && !state.channels.linkedin) score -= 20;
    return Math.max(35, Math.min(96, score));
  }, [state]);
  const metricRationale = useMemo(() => {
    if (state.step === 0) {
      return `${state.icp} targeting changes account quality and list depth immediately.`;
    }
    if (state.step === 1) {
      return `${state.tone} messaging shifts open and reply behavior for ${state.offer} buyers.`;
    }
    if (state.step === 2) {
      const channelLabel = `${state.channels.email ? "Email" : ""}${state.channels.email && state.channels.linkedin ? " + " : ""}${state.channels.linkedin ? "LinkedIn" : ""}` || "no channels";
      return `${state.cadence} cadence with ${channelLabel} controls daily throughput.`;
    }
    if (state.step === 3) {
      return `${state.replyLogic} logic directly changes qualification strictness and handoff quality.`;
    }
    return `${state.timezone} handoff improves scheduling speed for booked opportunities.`;
  }, [state]);
  const anomalies = useMemo(() => {
    const alerts: Array<{ id: string; title: string; fixLabel: string }> = [];
    if (!state.channels.email && !state.channels.linkedin) {
      alerts.push({ id: "no_channel", title: "All channels are paused. Reach is near zero.", fixLabel: "Enable Email + LinkedIn" });
    }
    if (state.channels.email && !state.channels.linkedin) {
      alerts.push({ id: "single_channel", title: "LinkedIn is off. Multi-channel lift is missing.", fixLabel: "Enable LinkedIn" });
    }
    if (state.replyLogic === "Strict" && state.cadence === "Light") {
      alerts.push({ id: "strict_light", title: "Strict filtering with light cadence may reduce volume.", fixLabel: "Switch to Balanced" });
    }
    return alerts.slice(0, 2);
  }, [state.channels, state.replyLogic, state.cadence]);
  const trustCheckpoints = useMemo(
    () => [
      { label: "Targeting locked", done: state.step >= 0 && state.offer.trim().length > 0 && state.location.trim().length > 0 },
      { label: "Messaging tuned", done: state.step >= 1 },
      { label: "Delivery configured", done: state.step >= 2 },
      { label: "Qualification configured", done: state.step >= 3 },
      { label: "Handoff ready", done: state.step >= 4 },
    ],
    [state.step, state.offer, state.location],
  );
  const stepExecutionNotes = useMemo(() => {
    if (state.step === 0) {
      return [
        { label: "Matched Accounts", value: Math.round(derived.emailsSent * 0.52).toLocaleString() },
        { label: "ICP Fit", value: state.icp === "Enterprise" ? "High-value ACVs" : state.icp === "SMB" ? "Higher volume" : "Balanced quality" },
        { label: "Intent Signals", value: Math.round(derived.emailsSent * 0.14).toLocaleString() },
      ];
    }
    if (state.step === 1) {
      return [
        { label: "Tone Benchmark", value: state.tone },
        { label: "Open Rate", value: `${derived.openRate}%` },
        { label: "Reply Rate", value: `${derived.replyRate}%` },
      ];
    }
    if (state.step === 2) {
      return [
        { label: "Channels", value: `${state.channels.email ? "Email" : ""}${state.channels.email && state.channels.linkedin ? " + " : ""}${state.channels.linkedin ? "LinkedIn" : ""}` || "None" },
        { label: "Cadence", value: state.cadence },
        { label: "Emails/Month", value: derived.emailsSent.toLocaleString() },
      ];
    }
    if (state.step === 3) {
      return [
        { label: "Interested", value: Math.round(derived.replies * 0.52).toLocaleString() },
        { label: "Not now", value: Math.round(derived.replies * 0.28).toLocaleString() },
        { label: "Not fit", value: Math.max(0, derived.replies - Math.round(derived.replies * 0.8)).toLocaleString() },
      ];
    }
    return [
      { label: "Timezone", value: state.timezone },
      { label: "Meeting Range", value: `${derived.meetings}/mo` },
      { label: "Handoff", value: "Calendar-ready" },
    ];
  }, [state, derived]);

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      offer: state.offer,
      location: state.location,
      icp: state.icp,
      tone: state.tone,
      cadence: state.cadence,
      replyLogic: state.replyLogic,
      timezone: state.timezone,
      email: String(state.channels.email),
      linkedin: String(state.channels.linkedin),
    });
    return `/?${params.toString()}#pipeline-experience`;
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const offer = params.get("offer");
    const location = params.get("location");
    if (!offer && !location) return;
    dispatch({
      type: "hydrate",
      payload: {
        offer: offer ?? INITIAL_STATE.offer,
        location: location ?? INITIAL_STATE.location,
        icp: (params.get("icp") as Icp) ?? INITIAL_STATE.icp,
        tone: (params.get("tone") as Tone) ?? INITIAL_STATE.tone,
        cadence: (params.get("cadence") as Cadence) ?? INITIAL_STATE.cadence,
        replyLogic: (params.get("replyLogic") as ReplyLogic) ?? INITIAL_STATE.replyLogic,
        timezone: (params.get("timezone") as Timezone) ?? INITIAL_STATE.timezone,
        channels: {
          email: params.get("email") !== "false",
          linkedin: params.get("linkedin") !== "false",
        },
      },
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams({
      offer: state.offer,
      location: state.location,
      icp: state.icp,
      tone: state.tone,
      cadence: state.cadence,
      replyLogic: state.replyLogic,
      timezone: state.timezone,
      email: String(state.channels.email),
      linkedin: String(state.channels.linkedin),
    });
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}#pipeline-experience`);
  }, [state]);

  useEffect(() => {
    if (state.phase !== "processing") return;
    const timer = window.setTimeout(() => {
      dispatch({ type: "set_phase", payload: "results" });
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [state.phase]);

  const stepItems = [
    "Define market",
    "Set tone",
    "Configure channels",
    "Choose qualification logic",
    "Confirm handoff window",
  ];

  function handleOfferKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!offerFocused || filteredIndustries.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOfferHighlight((p) => (p + 1) % filteredIndustries.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOfferHighlight((p) => (p - 1 + filteredIndustries.length) % filteredIndustries.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      dispatch({ type: "set_offer", payload: filteredIndustries[offerHighlight] ?? filteredIndustries[0] });
      setOfferFocused(false);
    } else if (event.key === "Escape") {
      setOfferFocused(false);
    }
  }

  function handleLocationKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!locationFocused || filteredCountries.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setLocationHighlight((p) => (p + 1) % filteredCountries.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setLocationHighlight((p) => (p - 1 + filteredCountries.length) % filteredCountries.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      dispatch({ type: "set_location", payload: filteredCountries[locationHighlight] ?? filteredCountries[0] });
      setLocationFocused(false);
    } else if (event.key === "Escape") {
      setLocationFocused(false);
    }
  }

  function goForward() {
    if (state.step < 4) {
      dispatch({ type: "set_step", payload: state.step + 1 });
    } else {
      trackEvent("pipeline_simulator_processing_start");
      dispatch({ type: "set_phase", payload: "processing" });
    }
  }

  function goBack() {
    dispatch({ type: "set_step", payload: state.step - 1 });
  }

  function closeResultsModal() {
    dispatch({ type: "set_phase", payload: "configure" });
    dispatch({ type: "set_step", payload: 0 });
  }

  function applyPreset(preset: ScenarioPreset) {
    if (preset === "Fast Growth") {
      dispatch({ type: "set_cadence", payload: "Aggressive" });
      if (!state.channels.email) dispatch({ type: "toggle_channel", payload: "email" });
      if (!state.channels.linkedin) dispatch({ type: "toggle_channel", payload: "linkedin" });
      dispatch({ type: "set_reply_logic", payload: "Fast-track" });
      dispatch({ type: "set_tone", payload: "Direct" });
    } else if (preset === "High Intent") {
      dispatch({ type: "set_icp", payload: "Enterprise" });
      dispatch({ type: "set_cadence", payload: "Standard" });
      if (!state.channels.email) dispatch({ type: "toggle_channel", payload: "email" });
      dispatch({ type: "set_reply_logic", payload: "Strict" });
      dispatch({ type: "set_tone", payload: "Technical" });
    } else {
      dispatch({ type: "set_icp", payload: "Mid-market" });
      dispatch({ type: "set_cadence", payload: "Standard" });
      if (!state.channels.email) dispatch({ type: "toggle_channel", payload: "email" });
      if (!state.channels.linkedin) dispatch({ type: "toggle_channel", payload: "linkedin" });
      dispatch({ type: "set_reply_logic", payload: "Balanced" });
      dispatch({ type: "set_tone", payload: "Consultative" });
    }
    trackEvent("pipeline_simulator_preset_apply", { preset });
  }

  function resolveAnomaly(id: string) {
    if (id === "no_channel") {
      if (!state.channels.email) dispatch({ type: "toggle_channel", payload: "email" });
      if (!state.channels.linkedin) dispatch({ type: "toggle_channel", payload: "linkedin" });
    } else if (id === "single_channel") {
      if (!state.channels.linkedin) dispatch({ type: "toggle_channel", payload: "linkedin" });
    } else if (id === "strict_light") {
      dispatch({ type: "set_reply_logic", payload: "Balanced" });
    }
    trackEvent("pipeline_simulator_anomaly_fix", { anomaly: id });
  }

  async function copyShareUrl() {
    try {
      if (typeof window === "undefined") {
        return;
      }
      await navigator.clipboard.writeText(window.location.origin + shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1300);
    } catch {
      setShareCopied(false);
    }
  }

  return (
    <section id="pipeline-experience" className={className}>
      <div className="border border-white/15 bg-white/[0.015] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-3">
            <StepBadge>Live // Pipeline Experience</StepBadge>
            <h3 className="text-3xl md:text-4xl font-bold uppercase leading-tight">
              Building pipeline for {state.offer} in {state.location}
            </h3>
            <p className="font-mono text-xs text-white/45 uppercase tracking-widest">
              Botlane is setting this up automatically // no manual outreach required
            </p>
            <div className="grid md:grid-cols-3 gap-2">
              {(["Fast Growth", "Balanced", "High Intent"] as ScenarioPreset[]).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  title={
                    preset === "Fast Growth"
                      ? "Higher volume, faster cadence, quicker qualification."
                      : preset === "High Intent"
                        ? "Higher-quality targeting with stricter qualification."
                        : "Balanced settings for quality and volume."
                  }
                  className="border border-white/20 p-2 text-left hover:border-white/45 transition-colors"
                >
                  <p className="font-mono text-[10px] text-white/85 uppercase tracking-widest">{preset}</p>
                  <p className="font-mono text-[10px] text-white/45 normal-case mt-1">
                    {preset === "Fast Growth"
                      ? "Maximize volume and pipeline velocity."
                      : preset === "High Intent"
                        ? "Prioritize fit and deal quality."
                        : "Balanced quality and speed."}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={copyShareUrl}
            className="px-3 py-2 border border-white/25 text-white/70 font-mono text-xs uppercase tracking-widest hover:border-white/45 hover:text-white transition-colors"
          >
            {shareCopied ? "Copied" : "Copy Share URL"}
          </button>
        </div>

        <div className="grid lg:grid-cols-[0.94fr_1.06fr] gap-5">
          <div className="border border-white/12 bg-black/25 p-5 space-y-5 lg:max-h-[74vh] lg:overflow-y-auto [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-corner]:bg-transparent">
            <div className="flex items-center gap-2 flex-wrap">
              {stepItems.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => dispatch({ type: "set_step", payload: i })}
                  className={`px-2.5 py-1 border font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    i === state.step ? "border-white/55 text-white" : "border-white/20 text-white/45 hover:text-white/80"
                  }`}
                >
                  {i + 1}. {item}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`control-step-${state.step}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-4 lg:min-h-[175px]"
              >
                {state.step === 0 && (
                  <>
                    <p className="font-mono text-xs text-white/45 uppercase tracking-widest">
                      Step 1 // Define market
                    </p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest min-h-[26px]">
                      {STEP_IMPACT_COPY[0]}
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <label className="relative font-mono text-[10px] text-white/45 uppercase tracking-widest space-y-2">
                        What do you sell?
                        <input
                          value={state.offer}
                          onChange={(e) => dispatch({ type: "set_offer", payload: e.target.value })}
                          onFocus={() => setOfferFocused(true)}
                          onBlur={() => window.setTimeout(() => setOfferFocused(false), 120)}
                          onKeyDown={handleOfferKeyDown}
                          className="h-10 w-full border border-white/20 bg-black px-3 text-sm normal-case text-white/90"
                        />
                        {offerFocused && filteredIndustries.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-20 border border-white/20 bg-black max-h-40 overflow-y-auto">
                            {filteredIndustries.map((item, i) => (
                              <button
                                key={item}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  dispatch({ type: "set_offer", payload: item });
                                  setOfferFocused(false);
                                }}
                                className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors ${
                                  i === offerHighlight ? "bg-white/[0.08] text-white" : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </label>
                      <label className="relative font-mono text-[10px] text-white/45 uppercase tracking-widest space-y-2">
                        Where do you operate?
                        <input
                          value={state.location}
                          onChange={(e) => dispatch({ type: "set_location", payload: e.target.value })}
                          onFocus={() => setLocationFocused(true)}
                          onBlur={() => window.setTimeout(() => setLocationFocused(false), 120)}
                          onKeyDown={handleLocationKeyDown}
                          className="h-10 w-full border border-white/20 bg-black px-3 text-sm normal-case text-white/90"
                        />
                        {locationFocused && filteredCountries.length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-1 z-20 border border-white/20 bg-black max-h-40 overflow-y-auto">
                            {filteredCountries.map((item, i) => (
                              <button
                                key={item}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  dispatch({ type: "set_location", payload: item });
                                  setLocationFocused(false);
                                }}
                                className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors ${
                                  i === locationHighlight ? "bg-white/[0.08] text-white" : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                                }`}
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="flex gap-2">
                      {(["SMB", "Mid-market", "Enterprise"] as Icp[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => dispatch({ type: "set_icp", payload: item })}
                          className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
                            state.icp === item ? "border-white/55 text-white" : "border-white/20 text-white/55"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {state.step === 1 && (
                  <>
                    <p className="font-mono text-xs text-white/45 uppercase tracking-widest">Step 2 // Set tone</p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest min-h-[26px]">
                      {STEP_IMPACT_COPY[1]}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Direct", "Consultative", "Technical"] as Tone[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => dispatch({ type: "set_tone", payload: item })}
                          className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
                            state.tone === item ? "border-white/55 text-white" : "border-white/20 text-white/55"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <div className="border border-white/15 bg-white/[0.01] p-4 font-mono text-xs text-white/65 leading-relaxed">
                      <TypingLine text={emailPreview} />
                    </div>
                  </>
                )}

                {state.step === 2 && (
                  <>
                    <p className="font-mono text-xs text-white/45 uppercase tracking-widest">Step 3 // Configure channels</p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest min-h-[26px]">
                      {STEP_IMPACT_COPY[2]}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "toggle_channel", payload: "email" })}
                        className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
                          state.channels.email ? "border-white/55 text-white" : "border-white/20 text-white/55"
                        }`}
                      >
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "toggle_channel", payload: "linkedin" })}
                        className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
                          state.channels.linkedin ? "border-white/55 text-white" : "border-white/20 text-white/55"
                        }`}
                      >
                        LinkedIn
                      </button>
                      <select
                        value={state.cadence}
                        onChange={(e) => dispatch({ type: "set_cadence", payload: e.target.value as Cadence })}
                        className="h-8 border border-white/20 bg-black px-2 font-mono text-[10px] uppercase tracking-widest text-white/80"
                      >
                        <option>Light</option>
                        <option>Standard</option>
                        <option>Aggressive</option>
                      </select>
                    </div>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      This is what runs in the background: sending + follow-up + inbox triage
                    </p>
                  </>
                )}

                {state.step === 3 && (
                  <>
                    <p className="font-mono text-xs text-white/45 uppercase tracking-widest">Step 4 // Qualification logic</p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest min-h-[26px]">
                      {STEP_IMPACT_COPY[3]}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["Balanced", "Strict", "Fast-track"] as ReplyLogic[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => dispatch({ type: "set_reply_logic", payload: item })}
                          className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
                            state.replyLogic === item ? "border-white/55 text-white" : "border-white/20 text-white/55"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {state.step === 4 && (
                  <>
                    <p className="font-mono text-xs text-white/45 uppercase tracking-widest">Step 5 // Handoff window</p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest min-h-[26px]">
                      {STEP_IMPACT_COPY[4]}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["GMT", "IST", "EST", "PST"] as Timezone[]).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => dispatch({ type: "set_timezone", payload: item })}
                          className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-widest ${
                            state.timezone === item ? "border-white/55 text-white" : "border-white/20 text-white/55"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              {state.step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-3 py-1 border border-white/20 text-white/70 font-mono text-xs uppercase tracking-widest hover:border-white/45 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={goForward}
                className="px-3 py-1 border border-white/50 text-white font-mono text-xs uppercase tracking-widest cta-glow"
              >
                {state.step < 4 ? "Continue →" : "Generate AI Forecast →"}
              </button>
            </div>

            <div className="border border-white/15 p-3">
              <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">Trust Checkpoints</p>
              <div className="grid md:grid-cols-2 gap-1.5">
                {trustCheckpoints.map((item) => (
                  <p key={item.label} className={`font-mono text-[10px] uppercase tracking-widest ${item.done ? "text-emerald-200/85" : "text-white/35"}`}>
                    {item.done ? "✓" : "•"} {item.label}
                  </p>
                ))}
              </div>
            </div>

          </div>

          <div className="border border-white/12 bg-black/20 p-4 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`live-module-${state.step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="border border-white/15 p-4 min-h-[230px]"
              >
                {state.step === 0 && (
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Prospects Map</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Matched Accounts", value: Math.round(derived.emailsSent * 0.52).toLocaleString() },
                        { label: "ICP Fit Score", value: state.icp === "Enterprise" ? "89/100" : state.icp === "SMB" ? "83/100" : "86/100" },
                        { label: "Intent Signals", value: Math.round(derived.emailsSent * 0.14).toLocaleString() },
                      ].map((item) => (
                        <div key={item.label} className="border border-white/15 p-3">
                          <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">{item.label}</p>
                          <p className="font-bold text-lg mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {state.step === 1 && (
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Tone Lab</p>
                    <div className="border border-white/15 bg-white/[0.01] p-4 font-mono text-xs text-white/70 leading-relaxed">
                      <TypingLine text={emailPreview} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="border border-white/20 px-2 py-1 font-mono text-[10px] text-white/65 uppercase tracking-widest">Tone benchmark: {state.tone}</span>
                      <span className="border border-white/20 px-2 py-1 font-mono text-[10px] text-white/65 uppercase tracking-widest">Open {derived.openRate}%</span>
                      <span className="border border-white/20 px-2 py-1 font-mono text-[10px] text-white/65 uppercase tracking-widest">Reply {derived.replyRate}%</span>
                    </div>
                  </div>
                )}

                {state.step === 2 && (
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Channel Timeline</p>
                    <div className="space-y-3">
                      {[{ key: "Email", on: state.channels.email }, { key: "LinkedIn", on: state.channels.linkedin }].map((lane, i) => (
                        <div key={lane.key} className="border border-white/15 p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-[10px] text-white/55 uppercase tracking-widest">{lane.key}</p>
                            <span className="font-mono text-[10px] text-white/45 uppercase">{lane.on ? "Active" : "Paused"}</span>
                          </div>
                          <div className="relative h-[2px] bg-white/10 mt-3 overflow-hidden">
                            {lane.on && (
                              <motion.div
                                className="absolute left-0 top-0 h-full bg-white/65"
                                animate={{ x: ["-20%", "120%"] }}
                                transition={{ duration: state.cadence === "Aggressive" ? 1.2 : state.cadence === "Light" ? 2.2 : 1.7, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
                                style={{ width: "22%" }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {state.step === 3 && (
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Reply Qualifier</p>
                    <div className="grid md:grid-cols-3 gap-3">
                      {[
                        { label: "Interested", value: Math.round(derived.replies * 0.52) },
                        { label: "Not now", value: Math.round(derived.replies * 0.28) },
                        { label: "Not fit", value: Math.max(0, derived.replies - Math.round(derived.replies * 0.8)) },
                      ].map((item) => (
                        <div key={item.label} className="border border-white/15 p-3">
                          <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">{item.label}</p>
                          <p className="text-lg font-bold mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {state.step === 4 && (
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Meeting Handoff</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[`Tue 11:00 (${state.timezone})`, `Thu 16:30 (${state.timezone})`].map((slot) => (
                        <div key={slot} className="border border-white/15 p-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/70" />
                          <p className="font-mono text-xs text-white/70">{slot}</p>
                        </div>
                      ))}
                    </div>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      Timezone-ready handoff enabled for AE calendars
                    </p>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3">
                  <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest mb-2">Execution Notes</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {stepExecutionNotes.map((note) => (
                      <div key={note.label} className="border border-white/15 p-2.5 bg-white/[0.01]">
                        <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">{note.label}</p>
                        <p className="font-mono text-xs text-white/80 mt-1">{note.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="border border-white/15 p-4 md:p-5 min-h-[270px]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">Live Metrics</p>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest border border-white/20 px-2 py-1">
                  AI-calibrated
                </span>
              </div>

              <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Open", value: `${derived.openRate}%` },
                    { label: "Reply", value: `${derived.replyRate}%` },
                    { label: "Qualified", value: `${derived.qualifiedRate}%` },
                  ].map((metric) => (
                    <div key={metric.label} className="border border-white/15 bg-white/[0.01] p-3">
                      <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">{metric.label}</p>
                      <p className="font-bold text-xl mt-1">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="border border-white/15 bg-white/[0.01] p-3">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Pipeline Confidence</p>
                  <div className="relative h-[4px] bg-white/10 mt-3">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-white/70"
                      animate={{ width: `${pipelineConfidence}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                  <p className="font-mono text-sm text-white/80 mt-3">{pipelineConfidence}% confidence</p>
                </div>
              </div>

              <p className="mt-4 font-mono text-[10px] text-white/45 uppercase tracking-widest">
                Why this changed: {metricRationale}
              </p>

            </div>

            {anomalies.length > 0 && (
              <div className="grid md:grid-cols-1 gap-3">
                {anomalies.map((alert) => (
                  <div key={alert.id} className="border border-amber-300/35 bg-amber-500/5 p-3">
                    <p className="font-mono text-[10px] text-amber-200/80 uppercase tracking-widest">Live Alert</p>
                    <p className="font-mono text-xs text-amber-100/90 mt-1">{alert.title}</p>
                    <button
                      type="button"
                      onClick={() => resolveAnomaly(alert.id)}
                      className="mt-2 px-2.5 py-1 border border-amber-200/40 text-amber-100 font-mono text-[10px] uppercase tracking-widest hover:border-amber-100/70 transition-colors"
                    >
                      {alert.fixLabel}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="font-mono text-[10px] text-white/35 uppercase tracking-widest">
              No manual outreach required // Botlane orchestrates this continuously
            </p>
          </div>
        </div>

        <AnimatePresence>
          {state.phase === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm flex items-center justify-center px-6"
            >
              <div className="w-full max-w-xl border border-white/20 bg-black p-6 space-y-4">
                <p className="font-mono text-xs text-white/50 uppercase tracking-widest">AI Optimizer Running</p>
                <div className="space-y-2">
                  {["Sending wave", "Collecting replies", "Scheduling meetings"].map((item, i) => (
                    <motion.div key={item} className="flex items-center gap-3">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white"
                        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                      />
                      <p className="font-mono text-sm text-white/75">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {state.phase === "results" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm flex items-center justify-center px-4 py-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="w-full max-w-5xl border border-white/20 bg-black p-5 md:p-6 lg:max-h-[86vh] overflow-y-auto [scrollbar-color:rgba(255,255,255,0.25)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <p className="font-mono text-[10px] text-white/45 uppercase tracking-widest">
                    Results Dashboard // AI-optimized
                  </p>
                  <button
                    type="button"
                    onClick={closeResultsModal}
                    className="w-9 h-9 border border-white/25 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-colors"
                    aria-label="Close results"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="space-y-2">
                    <h4 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                      {derived.meetings} meetings/month projected
                      <br />
                      for {state.offer} in {state.location}
                    </h4>
                    <p className="font-mono text-xs text-white/50">Based on similar campaigns</p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href="/book-call"
                      onClick={() => trackEvent("pipeline_simulator_cta_click", { target: "/book-call" })}
                      className="px-6 py-3 border border-white/50 text-white font-mono text-xs uppercase tracking-widest cta-glow"
                    >
                      Start Your Pipeline →
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => trackEvent("pipeline_simulator_cta_click", { target: "/contact" })}
                      className="px-6 py-3 border border-white/25 text-white/80 font-mono text-xs uppercase tracking-widest cta-glow"
                    >
                      Book a Demo →
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid md:grid-cols-5 gap-3">
                  <div className="border border-white/15 p-3">
                    <p className="font-mono text-[10px] text-white/45 uppercase">Emails Sent</p>
                    <p className="text-2xl font-bold">{derived.emailsSent}</p>
                  </div>
                  <div className="border border-white/15 p-3">
                    <p className="font-mono text-[10px] text-white/45 uppercase">Open Rate</p>
                    <p className="text-2xl font-bold">{derived.openRate}%</p>
                  </div>
                  <div className="border border-white/15 p-3">
                    <p className="font-mono text-[10px] text-white/45 uppercase">Replies</p>
                    <p className="text-2xl font-bold">{derived.replies}</p>
                  </div>
                  <div className="border border-white/15 p-3">
                    <p className="font-mono text-[10px] text-white/45 uppercase">Qualified Leads</p>
                    <p className="text-2xl font-bold">{derived.qualified}</p>
                  </div>
                  <div className="border border-white/40 p-3 bg-white/[0.02]">
                    <p className="font-mono text-[10px] text-white/60 uppercase">Meetings Booked</p>
                    <p className="text-2xl font-bold">{derived.meetings}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-white/60">
                  <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email automation active</span>
                  <span className="inline-flex items-center gap-1"><Send className="w-3.5 h-3.5" /> Multi-channel delivery</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> AI qualification rules</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Calendar handoff ready</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
