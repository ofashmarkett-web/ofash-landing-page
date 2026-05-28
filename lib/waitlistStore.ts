import fs from "fs";
import path from "path";

export interface Registration {
  email: string;
  role: string;
  businessName?: string;
  whatsapp?: string;
  timestamp: string;
  emailId?: string;        // Resend message ID from confirmation send
}

interface Store {
  registrations: Registration[];
}

const DATA_FILE = path.join(process.cwd(), "data", "waitlist.json");

function read(): Store {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Store;
  } catch {
    return { registrations: [] };
  }
}

function write(store: Store): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function hasEmail(email: string): boolean {
  return read().registrations.some((r) => r.email === email);
}

export function saveRegistration(reg: Registration): void {
  const store = read();
  store.registrations.push(reg);
  write(store);
}

export function getAllRegistrations(): Registration[] {
  return read().registrations;
}
