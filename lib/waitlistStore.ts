// ── Shared type used by admin API response ─────────────────────────
export interface Registration {
  email: string;
  role: string;
  businessName?: string;
  whatsapp?: string;
  timestamp: string;
  emailId?: string;
}

// ── In-memory duplicate guard (best-effort within a process) ────────
// Resend is the real source of truth; this just prevents double-sends
// on the same warm Lambda/server instance.
const _sent = new Set<string>();

function norm(email: string): string {
  return email.trim().toLowerCase();
}

export function hasEmail(email: string): boolean {
  return _sent.has(norm(email));
}

export function markEmailSent(email: string): void {
  _sent.add(norm(email));
}
