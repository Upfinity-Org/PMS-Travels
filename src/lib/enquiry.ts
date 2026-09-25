export type EnquiryValues = {
  name: string;
  phone: string;
  email: string;
  service: string;
  vehicle: string;
  pickup: string;
  dropoff: string;
  travel_date: string;
  passengers: string;
  message: string;
  /** Honeypot: real visitors never see or fill this. */
  website: string;
};

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>;

export const emptyEnquiry: EnquiryValues = {
  name: '',
  phone: '',
  email: '',
  service: '',
  vehicle: '',
  pickup: '',
  dropoff: '',
  travel_date: '',
  passengers: '',
  message: '',
  website: '',
};

export const todayISO = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Mirrors the server-side rules (backend/app/schemas.py) so people get instant feedback. */
export function validateEnquiry(v: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = v.name.trim();
  if (name.length < 2) errors.name = 'Please enter your name.';
  else if (name.length > 80) errors.name = 'Please keep your name under 80 characters.';

  const phone = v.phone.trim();
  const digits = phone.replace(/\D/g, '');
  if (!phone) errors.phone = 'Please enter a phone number so we can reach you.';
  else if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Enter a valid phone number, for example +91 98765 43210.';
  }

  const email = v.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email address doesn’t look right.';

  if (v.travel_date && v.travel_date < todayISO()) errors.travel_date = 'Please choose today or a later date.';

  if (v.passengers) {
    const n = Number(v.passengers);
    if (!Number.isInteger(n) || n < 1 || n > 60) errors.passengers = 'Enter a number of guests between 1 and 60.';
  }
  if (v.pickup.length > 120) errors.pickup = 'Please keep this under 120 characters.';
  if (v.dropoff.length > 120) errors.dropoff = 'Please keep this under 120 characters.';
  if (v.message.length > 1500) errors.message = 'Please keep your message under 1,500 characters.';
  return errors;
}

export type SubmitResult =
  | { ok: true; reference: string }
  | { ok: false; kind: 'validation'; errors: EnquiryErrors; message: string }
  | { ok: false; kind: 'rate-limit' | 'server' | 'network'; message: string };

export async function submitEnquiry(values: EnquiryValues, elapsedMs: number): Promise<SubmitResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...values,
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        passengers: values.passengers ? Number(values.passengers) : null,
        travel_date: values.travel_date || null,
        elapsed_ms: elapsedMs,
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as {
      reference?: string;
      errors?: EnquiryErrors;
      message?: string;
    };
    if (res.ok && data.reference) return { ok: true, reference: data.reference };
    if (res.status === 422) {
      return { ok: false, kind: 'validation', errors: data.errors ?? {}, message: 'Please check the highlighted fields.' };
    }
    if (res.status === 429) {
      return { ok: false, kind: 'rate-limit', message: data.message ?? 'You have sent several enquiries in a short time. Please call us instead.' };
    }
    return { ok: false, kind: 'server', message: data.message ?? 'We could not send your enquiry just now.' };
  } catch {
    return { ok: false, kind: 'network', message: 'We could not reach the server. Check your connection and try again.' };
  } finally {
    window.clearTimeout(timeout);
  }
}
