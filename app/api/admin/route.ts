import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { hasEmail, markEmailSent, type Registration } from "@/lib/waitlistStore";

const TEAM_EMAIL       = "contact@o-fashmarkett.com";
const MAX_PAGES        = 20;          // up to 2 000 emails
const FETCH_TIMEOUT_MS = 20_000;

function checkAuth(req: NextRequest): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  return pw === (process.env.ADMIN_PASSWORD ?? "");
}

// ── Raw email shape from Resend SDK ─────────────────────────────────
interface RawEmail {
  id: string;
  to: string[] | string;
  subject: string;
  created_at: string;
  last_event?: string;
}

// ── Fetch ALL Resend emails (user + team) using cursor pagination ────
async function fetchAllRaw(resend: Resend): Promise<{ rows: RawEmail[]; permissionError: boolean; rateLimited: boolean; error?: string }> {
  const rows: RawEmail[] = [];
  let after: string | undefined;
  let pages = 0;

  while (pages < MAX_PAGES) {
    pages++;
    const result = await resend.emails.list(after ? { limit: 100, after } : { limit: 100 });

    if (result.error) {
      const code = (result.error as { statusCode?: number }).statusCode ?? 0;
      if (code === 429) return { rows, permissionError: false, rateLimited: true, error: result.error.message };
      return { rows: [], permissionError: code === 401 || code === 403, rateLimited: false, error: result.error.message ?? `Resend ${code}` };
    }

    const raw   = result.data as { data?: RawEmail[] } | RawEmail[] | null;
    const batch = Array.isArray(raw) ? raw : (raw?.data ?? []);
    rows.push(...batch);
    if (batch.length < 100) break;
    after = batch[batch.length - 1].id;
  }

  return { rows, permissionError: false, rateLimited: false };
}

// ── Parse role/details from the (…) block at the end of a subject ───
// Works for:
//   User confirmation: "🎉 Welcome to O-Fash Markett Waitlist! (Vendor · Shop · WA:+234…)"
//   Legacy team notif: "🆕 New Waitlist Signup: user@ex.com (Vendor · Shop · WA:+234…)"
function parseParens(subject: string): { role: string; businessName?: string; whatsapp?: string } | null {
  const pOpen  = subject.lastIndexOf("(");
  const pClose = subject.lastIndexOf(")");
  if (pOpen === -1 || pClose === -1 || pClose < pOpen) return null;

  const parts = subject.slice(pOpen + 1, pClose).split("·").map((s) => s.trim());
  const role  = parts[0].toLowerCase();
  if (!["buyer", "vendor", "rider"].includes(role)) return null;

  let businessName: string | undefined;
  let whatsapp: string | undefined;

  for (let i = 1; i < parts.length; i++) {
    if (parts[i].toUpperCase().startsWith("WA:")) {
      whatsapp = parts[i].slice(3).trim() || undefined;
    } else if (parts[i]) {
      businessName = businessName ? `${businessName} · ${parts[i]}` : parts[i];
    }
  }

  return { role, businessName, whatsapp };
}

// ── Parse legacy team-notification subject for the recipient email ───
// "🆕 New Waitlist Signup: user@ex.com (Vendor · …)"
function parseNotifEmail(subject: string): string | null {
  const marker = "New Waitlist Signup: ";
  const idx    = subject.indexOf(marker);
  if (idx === -1) return null;
  const rest  = subject.slice(idx + marker.length).trim();
  const pOpen = rest.lastIndexOf("(");
  const email = (pOpen !== -1 ? rest.slice(0, pOpen) : rest).trim().toLowerCase();
  return email.includes("@") ? email : null;
}

// ── Shared email row type ────────────────────────────────────────────
interface EmailRow {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: string;
  role: string | null;
  businessName: string | null;
}

// ── Exported admin: GET stats — 100% Resend, no local file reads ────
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;

  type ResendResult = { rows: RawEmail[]; permissionError: boolean; rateLimited: boolean; error?: string };
  const empty: ResendResult = { rows: [], permissionError: false, rateLimited: false, error: "Request timed out" };
  const timeoutP = new Promise<ResendResult>((res) => setTimeout(() => res(empty), FETCH_TIMEOUT_MS));
  const resendP  = (async (): Promise<ResendResult> => {
    if (!key) return { ...empty, error: "No API key" };
    return fetchAllRaw(new Resend(key));
  })();

  const { rows, permissionError, rateLimited, error } = await Promise.race([resendP, timeoutP]);

  // ── Separate user confirmation emails from legacy team notifications ─
  const isTeam = (e: RawEmail) => {
    const to = Array.isArray(e.to) ? e.to.join(",") : (e.to ?? "");
    return to.includes(TEAM_EMAIL);
  };
  const userRows = rows.filter((e) => !isTeam(e));
  const teamRows = rows.filter((e) =>  isTeam(e));

  // ── Legacy fallback: role map from old team notification emails ──────
  // Used only for historical signups sent before the subject-encoding change.
  const legacyRoleMap = new Map<string, { role: string; businessName?: string; whatsapp?: string }>();
  for (const e of teamRows) {
    const email  = parseNotifEmail(e.subject ?? "");
    const parsed = email ? parseParens(e.subject ?? "") : null;
    if (email && parsed && !legacyRoleMap.has(email)) {
      legacyRoleMap.set(email, { role: parsed.role, businessName: parsed.businessName, whatsapp: parsed.whatsapp });
    }
  }

  // ── Build registration map from user confirmation emails ─────────────
  // New signups: role is encoded in the confirmation subject (…)
  // Old signups: subject has no role → fall back to legacyRoleMap
  const regMap = new Map<string, Registration>();

  for (const e of userRows) {
    const addr   = (Array.isArray(e.to) ? e.to[0] : e.to ?? "").trim().toLowerCase();
    if (!addr.includes("@")) continue;

    // Try parsing role from the confirmation subject first
    const fromSubject = parseParens(e.subject ?? "");
    // Fall back to legacy team notification map for old signups
    const roleInfo    = fromSubject ?? legacyRoleMap.get(addr) ?? null;

    if (!regMap.has(addr)) {
      regMap.set(addr, {
        email:        addr,
        role:         roleInfo?.role         ?? "unknown",
        businessName: roleInfo?.businessName ?? undefined,
        whatsapp:     roleInfo?.whatsapp     ?? undefined,
        timestamp:    e.created_at ?? new Date().toISOString(),
        emailId:      e.id,
      });
    }
  }

  // ── Registrations list — newest first ────────────────────────────
  const registrations: Registration[] = [...regMap.values()].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // ── Emails Sent tab rows ──────────────────────────────────────────
  // One row per user confirmation email; role pulled from regMap
  const resendEmails: EmailRow[] = userRows.map((e) => {
    const addr = (Array.isArray(e.to) ? e.to[0] : e.to ?? "").trim().toLowerCase();
    const reg  = regMap.get(addr);
    return {
      id:           e.id,
      recipient:    (Array.isArray(e.to) ? e.to[0] : e.to) ?? "",
      subject:      e.subject ?? "",
      sentAt:       e.created_at ?? "",
      status:       e.last_event ?? "sent",
      role:         reg?.role ?? null,
      businessName: reg?.businessName ?? null,
    };
  });

  // ── Stat counts ───────────────────────────────────────────────────
  const total   = registrations.length;
  const buyers  = registrations.filter((r) => r.role === "buyer").length;
  const vendors = registrations.filter((r) => r.role === "vendor").length;
  const riders  = registrations.filter((r) => r.role === "rider").length;
  const resendCount = error && !rateLimited ? null : userRows.length;

  // Seed the in-memory duplicate guard from Resend data
  for (const r of registrations) markEmailSent(r.email);

  return NextResponse.json({
    total, buyers, vendors, riders,
    resendCount,
    resendError:           error ?? null,
    resendPermissionError: permissionError,
    resendRateLimited:     rateLimited,
    resendEmails,
    emailSource:           rows.length > 0 ? "resend" : "local",
    registrations,
  });
}

// ── POST /api/admin — no longer needed (Resend is the store) ────────
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ message: "All data is read live from Resend. No local sync needed." });
}
