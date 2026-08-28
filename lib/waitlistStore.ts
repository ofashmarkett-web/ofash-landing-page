import { getAdminDb } from "@/lib/firebaseAdmin";

export interface Registration {
  email: string;
  name?: string;
  role: string;
  businessName?: string;
  whatsapp?: string;
  timestamp: string;
  emailId?: string;
}

const COLLECTION = "waitlistRegistrations";
const _sent = new Set<string>();
const norm = (email: string) => email.trim().toLowerCase();
export function hasEmail(email: string) { return _sent.has(norm(email)); }
export function markEmailSent(email: string) { _sent.add(norm(email)); }

export async function getStoredRegistrations(): Promise<Registration[]> {
  const snapshot = await getAdminDb().collection(COLLECTION).orderBy("timestamp", "desc").get();
  return snapshot.docs.map((document) => document.data() as Registration);
}

export async function storeRegistration(registration: Registration): Promise<void> {
  await getAdminDb().collection(COLLECTION).doc(norm(registration.email)).set({
    ...registration,
    email: norm(registration.email),
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}
