import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';
import { SITE } from '../config/site';

type CtaBandProps = {
  eyebrow?: string;
  title?: string;
  /** Query string for the contact form so the enquiry arrives pre-filled, e.g. "service=..." */
  formQuery?: string;
};

export function CtaBand({ eyebrow = 'NEED A TAILORED QUOTE?', title = 'Let’s find the right fit.', formQuery }: CtaBandProps) {
  return (
    <section className="bg-dark px-5 py-14 text-white" data-dark="">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:px-3">
        <div>
          <p className="eyebrow text-secondary">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-bold">{title}</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={formQuery ? `/contact?${formQuery}` : '/contact'}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 font-bold text-white transition hover:bg-[#c53a2c]"
          >
            Send an enquiry <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-4 font-bold text-dark transition hover:bg-[#e8b24a]"
          >
            <MessageCircle size={18} aria-hidden="true" /> Ask our team
          </a>
        </div>
      </div>
    </section>
  );
}
