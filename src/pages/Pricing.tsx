import { ArrowUpRight, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { CtaBand } from '../components/CtaBand';
import { FaqList } from '../components/FaqList';
import { PageHero } from '../components/PageHero';
import { VehiclePhoto } from '../components/Photo';
import { SITE } from '../config/site';
import { rateFaqs } from '../content/faqs';
import { fleet } from '../content/fleet';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, pageSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
];

const factors = [
  { title: 'Vehicle class', copy: 'A sedan, MPV/SUV and group traveller each cost differently to run — pick what fits your group.' },
  { title: 'Route & duration', copy: 'A same-city local trip and a multi-day outstation journey are priced on different terms.' },
  { title: 'Dates & availability', copy: 'Peak travel dates and last-minute requests can affect which vehicles are available.' },
];

export function Pricing() {
  return (
    <>
      <Seo
        title="Pricing: Get a Quote"
        description="We don't publish a fixed rate card — fares depend on the vehicle, route and dates. Contact P.M.S Tours & Travels directly for an accurate quote on your trip."
        path="/pricing"
        jsonLd={[businessSchema(), pageSchema('CollectionPage', 'Pricing', '/pricing'), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        eyebrow="PMS PRICING"
        title={
          <>
            A fair fare,
            <br />
            confirmed up front.
          </>
        }
        intro="We don't publish a fixed price list, because the right fare depends on your vehicle, route and dates. Tell us your trip and we'll confirm a clear quote before you travel."
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">WHAT SHAPES YOUR FARE</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-.04em] sm:text-4xl">No two trips cost the same.</h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              That's why we quote every trip individually instead of publishing one-size-fits-all numbers. Share your plans and we'll get back to you with a
              fare that actually reflects your journey.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-[#c53a2c]">
                Request a quote <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a href={`tel:${SITE.phone.tel}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3.5 font-semibold transition hover:border-primary hover:text-primary">
                <Phone size={16} aria-hidden="true" /> {SITE.phone.display}
              </a>
            </div>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3">
            {factors.map((f) => (
              <li key={f.title} className="border-t border-black/10 pt-5">
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{f.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#ebe5da] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">OUR FLEET</p>
          <h2 className="mb-10 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">Pick a vehicle, then ask us the price.</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {fleet.map((car) => (
              <Link
                key={car.slug}
                to={`/contact?vehicle=${car.slug}`}
                className="group flex flex-col overflow-hidden border border-black/10 bg-card transition hover:border-primary"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-[#F1ECE3] p-6">
                  <VehiclePhoto slug={car.slug} alt={car.imageAlt} sizes="(min-width: 1024px) 22vw, 90vw" className="h-full w-full object-contain" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold">{car.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{car.seats}</p>
                  <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                    Get a quote <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-start gap-5 border border-black/10 bg-card p-7 sm:items-center sm:gap-8">
          <ShieldCheck size={28} className="shrink-0 text-primary" aria-hidden="true" />
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            <strong className="text-foreground">No hidden surprises.</strong> Whatever fare our team confirms with you before the trip is the fare you pay —
            we won't change it once you're on the road.
          </p>
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-bold text-dark transition hover:bg-[#e8b24a]"
          >
            <MessageCircle size={16} aria-hidden="true" /> Ask on WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16 lg:pb-20">
        <p className="eyebrow">QUESTIONS</p>
        <h2 className="mb-8 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">About our pricing</h2>
        <FaqList items={rateFaqs} />
      </section>

      <CtaBand />
    </>
  );
}
