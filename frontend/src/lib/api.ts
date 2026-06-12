import type { ContactMessage, ContactResponse } from "@/types/profile";

export async function sendContactMessage(msg: ContactMessage): Promise<ContactResponse> {
  const res = await fetch("/api/contact", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(msg),
    cache:   "no-store",
  });

  let data: ContactResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Contact form failed (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data?.detail ?? `Contact form failed (${res.status})`);
  }

  return data;
}
