"use client";

type EventPayload = {
  event: string;
  path: string;
  ts: string;
  meta?: Record<string, string | number | boolean>;
};

export function trackEvent(
  event: string,
  meta?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: EventPayload = {
    event,
    path: window.location.pathname,
    ts: new Date().toISOString(),
    meta,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/events", blob);
    return;
  }

  void fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  });
}
