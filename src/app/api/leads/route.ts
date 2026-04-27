import { NextRequest, NextResponse } from "next/server";
import { persistLead } from "@/lib/server/persistence";

type LeadPayload = {
  name: string;
  email: string;
  company: string;
  monthlyTarget: string;
  message?: string;
  website?: string;
  elapsedMs?: number;
  sourcePage: "contact" | "book-call";
};

type RateBucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
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
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLead(payload: LeadPayload): string | null {
  if (!payload.name || payload.name.trim().length < 2) {
    return "Please provide a valid name.";
  }
  if (!payload.email || !isValidEmail(payload.email)) {
    return "Please provide a valid work email.";
  }
  if (!payload.company || payload.company.trim().length < 2) {
    return "Please provide a valid company name.";
  }
  if (!payload.monthlyTarget || payload.monthlyTarget.trim().length < 2) {
    return "Please provide your monthly meeting target.";
  }
  if (!payload.sourcePage || !["contact", "book-call"].includes(payload.sourcePage)) {
    return "Invalid lead source.";
  }
  if (typeof payload.elapsedMs === "number" && payload.elapsedMs < 1500) {
    return "Submission blocked. Please try again.";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (payload.website?.trim()) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const validationError = validateLead(payload);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const leadId = `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const receivedAt = new Date().toISOString();
  const leadEnvelope = {
    leadId,
    status: "new",
    ...payload,
    receivedAt,
    ip,
  };

  await persistLead(leadEnvelope);

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadEnvelope),
      cache: "no-store",
    });
  } else {
    console.info("Lead captured", leadEnvelope);
  }

  return NextResponse.json({ ok: true, leadId }, { status: 200 });
}
