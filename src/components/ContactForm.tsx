import { CheckCircle2, Loader2, MessageCircle, Phone, Send } from 'lucide-react';
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { SITE } from '../config/site';
import { fleet } from '../content/fleet';
import {
  emptyEnquiry,
  submitEnquiry,
  todayISO,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from '../lib/enquiry';

const SERVICE_OPTIONS = [
  'Local rental (city package)',
  'Outstation trip',
  'Airport pickup or drop',
  'Temple & pilgrimage circuit',
  'Family or weekend outing',
  'Corporate or college travel',
  'Custom South India itinerary',
  'Something else',
];

const VEHICLE_OPTIONS = ['Not sure yet', ...fleet.map((c) => `${c.name} (${c.seats})`)];

const noopSubscribe = () => () => {};

type Status = 'idle' | 'submitting' | 'success' | 'error';

function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
  className = '',
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-primary">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-primary">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const uid = useId();
  const [params] = useSearchParams();
  // False while hydrating, true afterwards: lets us apply ?service= / ?vehicle= prefill without a hydration mismatch.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [edits, setEdits] = useState<Partial<EnquiryValues>>({});
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [reference, setReference] = useState('');
  const [failure, setFailure] = useState('');
  const [openedAt] = useState(() => Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  const prefill: Partial<EnquiryValues> = {};
  if (hydrated) {
    const service = params.get('service');
    const vehicle = params.get('vehicle');
    if (service && SERVICE_OPTIONS.includes(service)) prefill.service = service;
    const car = fleet.find((c) => c.slug === vehicle);
    if (car) prefill.vehicle = `${car.name} (${car.seats})`;
  }
  const values: EnquiryValues = { ...emptyEnquiry, ...prefill, ...edits };

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const id = (field: keyof EnquiryValues) => `${uid}-${field}`;
  const set =
    (field: keyof EnquiryValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setEdits((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  const a11y = (field: keyof EnquiryValues) => ({
    id: id(field),
    name: field,
    'aria-invalid': errors[field] ? (true as const) : undefined,
    'aria-describedby': errors[field] ? `${id(field)}-error` : `${id(field)}-hint`,
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    const found = validateEnquiry(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as (keyof EnquiryValues)[])[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }
    setStatus('submitting');
    setFailure('');
    const result = await submitEnquiry(values, Date.now() - openedAt);
    if (result.ok) {
      setReference(result.reference);
      setStatus('success');
      return;
    }
    if (result.kind === 'validation') {
      setErrors(result.errors);
      const first = (Object.keys(result.errors) as (keyof EnquiryValues)[])[0];
      if (first) document.getElementById(id(first))?.focus();
    }
    setFailure(result.message);
    setStatus('error');
  }

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="border border-black/10 bg-card p-8 outline-none sm:p-10">
        <CheckCircle2 className="text-primary" size={36} aria-hidden="true" />
        <h2 className="mt-5 font-display text-3xl font-bold tracking-[-.03em]">Thank you, we have your enquiry.</h2>
        <p className="mt-3 max-w-md leading-7 text-muted-foreground">
          Our travel team will call or message you shortly with a vehicle suggestion and a clear fare. Your reference is{' '}
          <strong className="text-foreground">{reference}</strong>.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${SITE.phone.tel}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-[#c53a2c]"
          >
            <Phone size={16} aria-hidden="true" /> Call {SITE.phone.display}
          </a>
          <button
            type="button"
            onClick={() => {
              setEdits({});
              setStatus('idle');
            }}
            className="inline-flex items-center justify-center rounded-full border border-black/20 px-6 py-3.5 font-semibold transition hover:border-primary hover:text-primary"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-black/10 bg-card p-6 sm:p-9" aria-label="Enquiry form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={id('name')} label="Your name" required error={errors.name}>
          <input {...a11y('name')} type="text" autoComplete="name" value={values.name} onChange={set('name')} className="field" required maxLength={80} />
        </Field>
        <Field id={id('phone')} label="Phone number" required error={errors.phone} hint="We’ll call or WhatsApp this number.">
          <input
            {...a11y('phone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set('phone')}
            className="field"
            required
            maxLength={24}
          />
        </Field>
        <Field id={id('email')} label="Email (optional)" error={errors.email}>
          <input {...a11y('email')} type="email" autoComplete="email" value={values.email} onChange={set('email')} className="field" maxLength={120} />
        </Field>
        <Field id={id('service')} label="Type of trip" error={errors.service}>
          <select {...a11y('service')} value={values.service} onChange={set('service')} className="field">
            <option value="">Select one</option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field id={id('vehicle')} label="Vehicle" error={errors.vehicle}>
          <select {...a11y('vehicle')} value={values.vehicle} onChange={set('vehicle')} className="field">
            <option value="">Select one</option>
            {VEHICLE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field id={id('passengers')} label="Number of guests" error={errors.passengers}>
          <input
            {...a11y('passengers')}
            type="number"
            inputMode="numeric"
            min={1}
            max={60}
            value={values.passengers}
            onChange={set('passengers')}
            className="field"
          />
        </Field>
        <Field id={id('pickup')} label="Pickup location" error={errors.pickup}>
          <input {...a11y('pickup')} type="text" autoComplete="off" value={values.pickup} onChange={set('pickup')} className="field" maxLength={120} />
        </Field>
        <Field id={id('dropoff')} label="Destination" error={errors.dropoff}>
          <input {...a11y('dropoff')} type="text" autoComplete="off" value={values.dropoff} onChange={set('dropoff')} className="field" maxLength={120} />
        </Field>
        <Field id={id('travel_date')} label="Travel date" error={errors.travel_date} className="sm:col-span-2 sm:max-w-[calc(50%-.625rem)]">
          <input
            {...a11y('travel_date')}
            type="date"
            min={hydrated ? todayISO() : undefined}
            value={values.travel_date}
            onChange={set('travel_date')}
            className="field"
          />
        </Field>
        <Field id={id('message')} label="Anything else we should know?" error={errors.message} className="sm:col-span-2">
          <textarea {...a11y('message')} rows={4} value={values.message} onChange={set('message')} className="field resize-y" maxLength={1500} />
        </Field>

        {/* Honeypot: hidden from people, irresistible to form-filling bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={id('website')}>Leave this field empty</label>
          <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </div>
      </div>

      <div aria-live="polite" className="mt-5 min-h-6">
        {status === 'error' && (
          <p role="alert" className="text-sm font-medium text-primary">
            {failure}{' '}
            <a href={`tel:${SITE.phone.tel}`} className="underline">
              Call {SITE.phone.display}
            </a>{' '}
            or{' '}
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="underline">
              message us on WhatsApp
            </a>
            .
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-white shadow-[0_12px_35px_rgba(168,50,38,.25)] transition hover:-translate-y-0.5 hover:bg-[#c53a2c] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" /> Send enquiry
            </>
          )}
        </button>
        <p className="text-xs leading-5 text-muted-foreground">
          We use your details only to reply to this enquiry. See our <Link to="/privacy-policy" className="font-semibold text-primary underline">privacy policy</Link>.
        </p>
      </div>

      <p className="mt-6 flex items-center gap-2 border-t border-black/10 pt-5 text-sm text-muted-foreground">
        <MessageCircle size={16} className="text-primary" aria-hidden="true" />
        In a hurry? Call or WhatsApp {SITE.phone.display}.
      </p>
    </form>
  );
}
