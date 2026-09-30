import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { FaqList } from '../components/FaqList';
import { Instagram } from '../components/icons';
import { PageHero } from '../components/PageHero';
import { SITE, hasAddress } from '../config/site';
import { bookingFaqs } from '../content/faqs';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, pageSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

const row = 'flex items-center justify-between gap-3 border-b border-black/10 py-4 font-semibold transition hover:text-primary';

export function Contact() {
  return (
    <>
      <Seo
        title="Contact & Book Your Ride"
        description="Send an enquiry or call +91 63807 98106 to book a car, MPV, SUV or Tempo Traveller with driver. Tell us your route and dates and we’ll confirm a clear fare."
        path="/contact"
        jsonLd={[businessSchema(), pageSchema('ContactPage', 'Contact P.M.S Tours & Travels', '/contact'), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        eyebrow="READY WHEN YOU ARE"
        title={
          <>
            Tell us where
            <br />
            you’re headed.
          </>
        }
        intro="Share your route, dates and how many people are travelling. Our team will reply with a vehicle suggestion and a clear fare."
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
          <ContactForm />

          <aside aria-label="Contact details" className="self-start">
            <p className="eyebrow-gold">TALK TO THE TEAM</p>
            <a href={`tel:${SITE.phone.tel}`} className="mt-3 block font-display text-3xl font-bold tracking-[-.04em] transition hover:text-primary">
              {SITE.phone.display}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">Call for an instant quote or trip advice.</p>

            <div className="mt-7 border-t border-black/10">
              <a href={`tel:${SITE.phone.tel}`} className={row}>
                <span className="flex items-center gap-3">
                  <Phone size={18} aria-hidden="true" /> Contact Us
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={row}>
                <span className="flex items-center gap-3">
                  <MessageCircle size={18} aria-hidden="true" /> WhatsApp booking
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className={row}>
                <span className="flex items-center gap-3">
                  <Instagram size={18} /> {SITE.instagram.handle}
                </span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>

            <div className="mt-7 border-t border-black/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">Our team</p>
              <ul className="mt-3 space-y-3">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-sm">
                    <span className="font-semibold text-foreground">{SITE.team.owner.name}</span>{' '}
                    <span className="text-muted-foreground">· {SITE.team.owner.role}</span>
                  </span>
                  <a href={`tel:${SITE.phone.tel}`} className="text-sm font-semibold text-primary hover:underline">
                    {SITE.phone.display}
                  </a>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-sm">
                    <span className="font-semibold text-foreground">{SITE.team.manager.name}</span>{' '}
                    <span className="text-muted-foreground">· {SITE.team.manager.role}</span>
                  </span>
                  <a href={`tel:${SITE.team.manager.phone.tel}`} className="text-sm font-semibold text-primary hover:underline">
                    {SITE.team.manager.phone.display}
                  </a>
                </li>
              </ul>
            </div>

            <ul className="mt-7 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Clock3 size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                Travel support is available 24 hours a day, 7 days a week.
              </li>
              {SITE.email && (
                <li>
                  <a href={`mailto:${SITE.email}`} className="font-semibold text-primary hover:underline">
                    {SITE.email}
                  </a>
                </li>
              )}
              {hasAddress && (
                <li className="flex items-start gap-3">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  {[SITE.address.street, SITE.address.locality, SITE.address.region, SITE.address.postalCode].filter(Boolean).join(', ')}
                </li>
              )}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#ebe5da] py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-5">
          <p className="eyebrow">QUESTIONS</p>
          <h2 className="mb-8 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">Before you book</h2>
          <FaqList items={bookingFaqs} />
        </div>
      </section>
    </>
  );
}
