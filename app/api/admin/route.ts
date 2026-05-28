import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAllRegistrations } from "@/lib/waitlistStore";

const TEAM_EMAIL      = "contact@o-fashmarkett.com";
const MAX_PAGES       = 10;
const FETCH_TIMEOUT_MS = 12_000;

function checkAuth(req: NextRequest): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  return pw === (process.env.ADMIN_PASSWORD ?? "");
}

interface ResendEmailRow {
  id: string;
  recipient: string;       // full, unmasked
  subject: string;
  sentAt: string;
  status: string;
  role: string | null;
  businessName: string | null;
}

interface ResendResult {
  emails: ResendEmailRow[];
  total: number;
  permissionError: boolean;
  rateLimited: boolean;
  error?: string;
}

async function fetchResendEmails(
  idToRole: Map<string, string>,
  idToBusinessName: Map<string, string | undefined>,
  emailToRole: Map<string, string>,
  emailToBusinessName: Map<string, string | undefined>
): Promise<ResendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { emails: [], total: 0, permissionError: false, rateLimited: false, error: "No API key configured" };
  }

  const resend    = new Resend(key);
  const collected: ResendEmailRow[] = [];
  let   after: string | undefined;
  let   pages = 0;

  while (pages < MAX_PAGES) {
    pages++;

    const result = await resend.emails.list(
      after ? { limit: 100, after } : { limit: 100 }
    );

    if (result.error) {
      const code = (result.error as { statusCode?: number }).statusCode ?? 0;
      if (code === 429) {
        return { emails: collected, total: collected.length, permissionError: false, rateLimited: true, error: result.error.message };
      }
      return {
        emails: [],
        total: 0,
        permissionError: code === 401 || code === 403,
        rateLimited: false,
        error: result.error.message ?? `Resend error ${code}`,
      };
    }

    const raw = result.data as
      | { data: Array<{ id: string; to: string[] | string; subject?: string; created_at?: string; last_event?: string }> }
      | Array<{ id: string; to: string[] | string; subject?: string; created_at?: string; last_event?: string }>
      | null;

    const batch = Array.isArray(raw) ? raw : (raw?.data ?? []);

    // Skip team-notification copies
    const userBatch = batch.filter((e) => {
      const to = Array.isArray(e.to) ? e.to.join(",") : (e.to ?? "");
      return !to.includes(TEAM_EMAIL);
    });

    for (const e of userBatch) {
      const recipient = (Array.isArray(e.to) ? e.to[0] : e.to) ?? "";

      // Resolve role: match by Resend email ID first, then by address
      const role         = idToRole.get(e.id)         ?? emailToRole.get(recipient)         ?? null;
      const businessName = idToBusinessName.get(e.id) ?? emailToBusinessName.get(recipient) ?? null;

      collected.push({
        id:           e.id,
        recipient,                          // full, unmasked
        subject:      e.subject    ?? "",
        sentAt:       e.created_at ?? "",
        status:       e.last_event ?? "sent",
        role,
        businessName: businessName ?? null,
      });
    }

    if (batch.length < 100) break;
    after = batch[batch.length - 1].id;
  }

  return { emails: collected, total: collected.length, permissionError: false, rateLimited: false };
}

// ── GET /api/admin ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = getAllRegistrations();
  const buyers  = registrations.filter((r) => r.role === "buyer").length;
  const vendors = registrations.filter((r) => r.role === "vendor").length;
  const riders  = registrations.filter((r) => r.role === "rider").length;

  // Build lookup maps so Resend emails can be annotated with role info
  const idToRole          = new Map(registrations.filter((r) => r.emailId).map((r) => [r.emailId!, r.role]));
  const idToBusinessName  = new Map(registrations.filter((r) => r.emailId).map((r) => [r.emailId!, r.businessName]));
  const emailToRole       = new Map(registrations.map((r) => [r.email, r.role]));
  const emailToBusinessName = new Map(registrations.map((r) => [r.email, r.businessName]));

  // Local email records — always available as fallback
  const localEmails: ResendEmailRow[] = [...registrations]
    .reverse()
    .filter((r) => r.emailId)
    .map((r) => ({
      id:           r.emailId!,
      recipient:    r.email,          // full, unmasked
      subject:      "🎉 Welcome to O-Fash Markett Waitlist!",
      sentAt:       r.timestamp,
      status:       "sent",
      role:         r.role,
      businessName: r.businessName ?? null,
    }));

  const emptyResult: ResendResult = { emails: [], total: 0, permissionError: false, rateLimited: false, error: "Request timed out" };
  const timeoutPromise = new Promise<ResendResult>((resolve) =>
    setTimeout(() => resolve(emptyResult), FETCH_TIMEOUT_MS)
  );

  const resend = await Promise.race([
    fetchResendEmails(idToRole, idToBusinessName, emailToRole, emailToBusinessName),
    timeoutPromise,
  ]);

  const emailsToShow = resend.emails.length > 0 ? resend.emails : localEmails;

  return NextResponse.json({
    total: registrations.length,
    buyers,
    vendors,
    riders,
    resendCount:           resend.error && !resend.rateLimited ? null : resend.total,
    resendError:           resend.error ?? null,
    resendPermissionError: resend.permissionError,
    resendRateLimited:     resend.rateLimited,
    resendEmails:          emailsToShow,
    emailSource:           resend.emails.length > 0 ? "resend" : "local",
    // Full registration data — no masking (admin-only endpoint)
    registrations: [...registrations].reverse(),
  });
}
