import fs   from "fs";
import path from "path";

export interface Registration {
  email: string;
  role: string;
  businessName?: string;
  whatsapp?: string;
  timestamp: string;
  emailId?: string;
}

interface Store {
  registrations: Registration[];
}

// Primary path (works on VPS / local dev)
const DATA_DIR_PRIMARY  = path.resolve(process.cwd(), "data");
const DATA_FILE_PRIMARY = path.join(DATA_DIR_PRIMARY, "waitlist.json");

// Fallback path for read-only filesystems (Vercel, etc.)
const DATA_FILE_TMP = "/tmp/ofash-waitlist.json";

function normalise(email: string): string {
  return email.trim().toLowerCase();
}

// ── Try to write to a path; return true on success ────────────────────
function tryWrite(filePath: string, content: string): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const tmp = filePath + ".tmp";
    fs.writeFileSync(tmp, content, "utf-8");
    fs.renameSync(tmp, filePath);
    return true;
  } catch {
    return false;
  }
}

// ── Read from a path; return null if unreadable ───────────────────────
function tryRead(filePath: string): Store | null {
  try {
    const raw    = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Store;
    return Array.isArray(parsed?.registrations) ? parsed : null;
  } catch {
    return null;
  }
}

// ── Read registrations from both locations, deduplicated ─────────────
function read(): Store {
  const primary = tryRead(DATA_FILE_PRIMARY);
  const tmp     = tryRead(DATA_FILE_TMP);

  if (!primary && !tmp) return { registrations: [] };
  if (!primary) return tmp!;
  if (!tmp)     return primary;

  // Merge: primary is base, tmp adds any extras not already in primary
  const seen = new Set(primary.registrations.map((r) => normalise(r.email)));
  const extras = tmp.registrations.filter((r) => !seen.has(normalise(r.email)));
  return { registrations: [...primary.registrations, ...extras] };
}

// ── Write store; try primary first, fall back to /tmp ────────────────
function write(store: Store): void {
  const json = JSON.stringify(store, null, 2);

  const primaryOk = tryWrite(DATA_FILE_PRIMARY, json);
  if (primaryOk) {
    console.log("[store] ✅ Wrote", store.registrations.length, "records to primary:", DATA_FILE_PRIMARY);
    return;
  }

  const tmpOk = tryWrite(DATA_FILE_TMP, json);
  if (tmpOk) {
    console.log("[store] ✅ Wrote", store.registrations.length, "records to /tmp fallback");
    return;
  }

  // Both paths failed — throw so caller can decide how to handle
  throw new Error("WRITE_FAILED: could not write to primary or /tmp");
}

export function hasEmail(email: string): boolean {
  const norm = normalise(email);
  return read().registrations.some((r) => normalise(r.email) === norm);
}

export function saveRegistration(reg: Registration): void {
  const norm  = normalise(reg.email);
  const store = read();

  if (store.registrations.some((r) => normalise(r.email) === norm)) {
    console.warn("[store] ⚠️ Duplicate skipped:", reg.email);
    throw new Error("DUPLICATE_EMAIL");
  }

  store.registrations.push({ ...reg, email: norm });
  write(store);
}

export function getAllRegistrations(): Registration[] {
  return read().registrations;
}
