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

// Resolve path relative to the project root regardless of cwd at runtime
const DATA_DIR  = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log("[store] Created data dir:", DATA_DIR);
  }
}

function read(): Store {
  try {
    ensureDir();
    const raw    = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed?.registrations)) return { registrations: [] };
    return parsed;
  } catch {
    return { registrations: [] };
  }
}

function write(store: Store): void {
  ensureDir();
  // Atomic write: write to .tmp then rename to prevent partial-write corruption
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2), "utf-8");
  fs.renameSync(tmp, DATA_FILE);
  console.log("[store] ✅ Wrote", store.registrations.length, "registrations to", DATA_FILE);
}

function normalise(email: string): string {
  return email.trim().toLowerCase();
}

export function hasEmail(email: string): boolean {
  const norm = normalise(email);
  return read().registrations.some((r) => normalise(r.email) === norm);
}

export function saveRegistration(reg: Registration): void {
  const norm  = normalise(reg.email);
  const store = read();

  // Guard against race-condition duplicates
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
