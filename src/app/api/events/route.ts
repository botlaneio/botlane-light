import { NextRequest, NextResponse } from "next/server";

type EventPayload = {
  event: string;
  path: string;
  ts: string;
  meta?: Record<string, string | number | boolean>;
};

type RateBucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 5 * 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 120;
const rateBuckets = new Map<string, RateBucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > MAX_EVENTS_PER_WINDOW;
}

function isValidEvent(payload: EventPayload): boolean {
  if (!payload.event || payload.event.trim().length < 2) {
    return false;
  }
  if (!payload.path || !payload.path.startsWith("/")) {
    return false;
  }
  if (!payload.ts || Number.isNaN(Date.parse(payload.ts))) {
    return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let payload: EventPayload;
  try {
    payload = (await request.json()) as EventPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isValidEvent(payload)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const webhookUrl = process.env.ANALYTICS_WEBHOOK_URL;
  const eventEnvelope = {
    ...payload,
    ip,
    receivedAt: new Date().toISOString(),
  };

  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventEnvelope),
      cache: "no-store",
    });
  } else {
    console.info("Analytics event", eventEnvelope);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
