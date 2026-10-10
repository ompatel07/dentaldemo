import { site } from "@/content/site.config";

/**
 * The contact enquiry seam. Same shape and same reasoning as lib/booking.ts:
 * one function to point at a real destination, kept out of the component so
 * wiring it never means touching the UI.
 */

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  message: string;
  preferred: "phone" | "whatsapp" | "email";
};

export type EnquiryResult = { ok: true } | { ok: false; error: string };

export async function submitEnquiry(enquiry: Enquiry): Promise<EnquiryResult> {
  const endpoint = site.booking.endpoint;

  if (!endpoint) {
    await new Promise((r) => setTimeout(r, 800));
    return { ok: true };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "enquiry", ...enquiry }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "send-failed" };
  } catch {
    return { ok: false, error: "offline" };
  }
}
