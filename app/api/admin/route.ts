import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAllRegistrations, hasEmail, saveRegistration } from "@/lib/waitlistStore";

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

// ── Parse team-notification subject for email + role + business ──────
// Subject format: "🆕 New Waitlist Signup: user@ex.com (Vendor · Kemi's Boutique)"
function parseNotifSubject(subject: string): { email: string; role: string; businessName?: string } | null {
  const marker = "New Waitlist Signup: ";
  const idx    = subject.indexOf(marker);
  if (idx === -1) return null;

  const rest    = subject.slice(idx + marker.length).trim();
  const pOpen   = rest.lastIndexOf("(");
  const pClose  = rest.lastIndexOf(")");
  if (pOpen === -1 || pClose === -1 || pClose < pOpen) return null;

  const email   = rest.slice(0, pOpen).trim().toLowerCase();
  const inParen = rest.slice(pOpen + 1, pClose);
  const parts   = inParen.split("·");
  const role    = parts[0].trim().toLowerCase();
  const businessName = parts.slice(1).join("·").trim() || undefined;

  if (!email.includes("@")) return null;
  if (!["buyer", "vendor", "rider"].includes(role)) return null;

  return { email, role, businessName };
}

// ── Exported admin: GET stats ───────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = getAllRegistrations();
  const buyers  = registrations.filter((r) => r.role === "buyer").length;
  const vendors = registrations.filter((r) => r.role === "vendor").length;
  const riders  = registrations.filter((r) => r.role === "rider").length;

  const idToRole            = new Map(registrations.filter((r) => r.emailId).map((r) => [r.emailId!, r.role]));
  const idToBusinessName    = new Map(registrations.filter((r) => r.emailId).map((r) => [r.emailId!, r.businessName]));
  const emailToRole         = new Map(registrations.map((r) => [r.email, r.role]));
  const emailToBusinessName = new Map(registrations.map((r) => [r.email, r.businessName]));

  // Local fallback
  const localEmails = [...registrations].reverse().filter((r) => r.emailId).map((r) => ({
    id: r.emailId!, recipient: r.email,
    subject: "🎉 Welcome to O-Fash Markett Waitlist!",
    sentAt: r.timestamp, status: "sent",
    role: r.role as string | null, businessName: r.businessName ?? null,
  }));

  const key = process.env.RESEND_API_KEY;
  type EmailsResult = {
    emails: typeof localEmails; total: number;
    permissionError: boolean; rateLimited: boolean; error?: string;
  };

  const emptyResult: EmailsResult = { emails: [], total: 0, permissionError: false, rateLimited: false, error: "Request timed out" };
  const timeoutP = new Promise<EmailsResult>((res) => setTimeout(() => res(emptyResult), FETCH_TIMEOUT_MS));

  const resendP = (async (): Promise<EmailsResult> => {
    if (!key) return { ...emptyResult, error: "No API key" };
    const resend = new Resend(key);
    const { rows, permissionError, rateLimited, error } = await fetchAllRaw(resend);
    if (error && !rateLimited) return { emails: [], total: 0, permissionError, rateLimited, error };

    const userRows = rows.filter((e) => {
      const to = Array.isArray(e.to) ? e.to.join(",") : (e.to ?? "");
      return !to.includes(TEAM_EMAIL);
    });

    const emails = userRows.map((e) => {
      const recipient    = (Array.isArray(e.to) ? e.to[0] : e.to) ?? "";
      const role         = idToRole.get(e.id) ?? emailToRole.get(recipient) ?? null;
      const businessName = idToBusinessName.get(e.id) ?? emailToBusinessName.get(recipient) ?? null;
      return { id: e.id, recipient, subject: e.subject ?? "", sentAt: e.created_at ?? "", status: e.last_event ?? "sent", role, businessName: businessName ?? null };
    });

    return { emails, total: emails.length, permissionError, rateLimited, error };
  })();

  const resend = await Promise.race([resendP, timeoutP]);
  const emailsToShow = resend.emails.length > 0 ? resend.emails : localEmails;

  return NextResponse.json({
    total: registrations.length,
    buyers, vendors, riders,
    resendCount:           resend.error && !resend.rateLimited ? null : resend.total,
    resendError:           resend.error ?? null,
    resendPermissionError: resend.permissionError,
    resendRateLimited:     resend.rateLimited,
    resendEmails:          emailsToShow,
    emailSource:           resend.emails.length > 0 ? "resend" : "local",
    registrations:         [...registrations].reverse(),
  });
}

// ── POST /api/admin/sync — backfill local store from Resend history ──
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "No Resend API key configured" }, { status: 500 });

  const resend = new Resend(key);

  // Fetch all emails with a generous timeout
  const fetchPromise  = fetchAllRaw(resend);
  const timeoutPromise = new Promise<{ rows: RawEmail[]; permissionError: boolean; rateLimited: boolean; error?: string }>(
    (resolve) => setTimeout(() => resolve({ rows: [], permissionError: false, rateLimited: false, error: "Timeout" }), FETCH_TIMEOUT_MS)
  );
  const { rows, permissionError, error } = await Promise.race([fetchPromise, timeoutPromise]);

  if (permissionError) {
    return NextResponse.json({ error: "Resend API key does not have Full Access permission." }, { status: 403 });
  }
  if (error && rows.length === 0) {
    return NextResponse.json({ error: `Could not fetch from Resend: ${error}` }, { status: 502 });
  }

  // Build role map from team notification emails
  // Subject: "🆕 New Waitlist Signup: user@ex.com (Vendor · Kemi's Boutique)"
  const roleMap = new Map<string, { role: string; businessName?: string; timestamp: string }>();
  const teamRows = rows.filter((e) => {
    const to = Array.isArray(e.to) ? e.to.join(",") : (e.to ?? "");
    return to.includes(TEAM_EMAIL);
  });

  for (const e of teamRows) {
    const parsed = parseNotifSubject(e.subject ?? "");
    if (parsed) {
      roleMap.set(parsed.email, {
        role:         parsed.role,
        businessName: parsed.businessName,
        timestamp:    e.created_at ?? new Date().toISOString(),
      });
    }
  }

  // User confirmation emails — one per signup
  const userRows = rows.filter((e) => {
    const to = Array.isArray(e.to) ? e.to.join(",") : (e.to ?? "");
    return !to.includes(TEAM_EMAIL);
  });

  let imported = 0;
  let skipped  = 0;
  let unknown  = 0;

  for (const e of userRows) {
    const email = ((Array.isArray(e.to) ? e.to[0] : e.to) ?? "").trim().toLowerCase();
    if (!email.includes("@")) { skipped++; continue; }
    if (hasEmail(email))      { skipped++; continue; }

    const info = roleMap.get(email);
    if (!info) { unknown++; skipped++; continue; } // can't determine role — skip

    try {
      saveRegistration({
        email,
        role:         info.role,
        businessName: info.businessName,
        timestamp:    info.timestamp,
        emailId:      e.id,
      });
      imported++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({
    imported,
    skipped,
    unknown,
    total: userRows.length,
    message: `Imported ${imported} registrations. Skipped ${skipped} (${unknown} had no role info).`,
  });
}
