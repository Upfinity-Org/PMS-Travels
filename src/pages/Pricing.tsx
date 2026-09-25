import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { Rate } from '../components/bits';
import { CtaBand } from '../components/CtaBand';
import { FaqList } from '../components/FaqList';
import { PageHero } from '../components/PageHero';
import { Photo } from '../components/Photo';
import { SITE } from '../config/site';
import { fleet, localRateLabel, outstationRateLabel } from '../content/fleet';
import { rateFaqs } from '../content/faqs';
import { rupees } from '../lib/format';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, pageSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Rates', path: '/pricing' },
];

const cheapestLocal = Math.min(...fleet.map((c) => c.local.from));
const cheapestKm = Math.min(...fleet.map((c) => c.outstation.from));

export function Pricing() {
  return (
    <>
      <Seo
        title="Car Rental Rates: Local & Outstation"
        description={`Starting rates for sedans, MPVs, SUVs and Tempo Travellers with driver: local packages from ${rupees(cheapestLocal)} for 8 hours and outstation from ${rupees(cheapestKm)} per km. Driver allowance extra.`}
        path="/pricing"
        jsonLd={[businessSchema(), pageSchema('CollectionPage', 'Rate card', '/pricing'), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        eyebrow="PMS RATE CARD"
        title={
          <>
            Clear fares for
            <br />
            the open road.
          </>
        }
        intro="Explore starting rates by vehicle category. Final quotes may vary with the route, dates, tolls and trip duration. Our team will always confirm before you go."
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow-gold">STARTING RATES</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[-.04em]">Find your vehicle</h2>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">Last updated: {SITE.ratesUpdated}</p>
        </div>

        <div role="table" aria-label="Starting rates by vehicle class" className="overflow-hidden border border-black/10 bg-card">
          <div
            role="row"
            className="hidden grid-cols-[1.25fr_1fr_1fr_.85fr] border-b border-black/10 bg-dark px-6 py-4 text-[10px] font-bold uppercase tracking-[.14em] text-white/70 md:grid"
          >
            <span role="columnheader">Vehicle class</span>
            <span role="columnheader">Local package</span>
            <span role="columnheader">Outstation</span>
            <span role="columnheader">Notes</span>
          </div>
          {fleet.map((car) => (
            <div
              key={car.slug}
              role="row"
              className="group grid gap-4 border-b border-black/10 p-5 last:border-0 md:grid-cols-[1.25fr_1fr_1fr_.85fr] md:items-center md:px-6 md:py-6"
            >
              <div role="cell" className="flex items-center gap-4">
                <Photo id={car.photo} alt="" widths={[128, 192]} sizes="64px" width={64} height={64} className="size-16 object-cover" />
                <div>
                  <p className="font-display text-xl font-bold">
                    <Link to={`/fleet/${car.slug}`} className="hover:text-primary">
                      {car.name}
                    </Link>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{car.models}</p>
                </div>
              </div>
              <Rate label="Local package" value={localRateLabel(car)} />
              <Rate label="Outstation" value={outstationRateLabel(car)} />
              <div role="cell">
                <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground md:hidden">Notes</p>
                <p className="mt-1 text-sm text-muted-foreground md:mt-0">{car.driver}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 border-y border-black/10 py-6 text-sm text-muted-foreground sm:grid-cols-3">
          <p>
            <Check className="mr-2 inline size-4 text-primary" aria-hidden="true" />
            Transparent estimates
          </p>
          <p>
            <Check className="mr-2 inline size-4 text-primary" aria-hidden="true" />
            Clean, maintained vehicles
          </p>
          <p>
            <Check className="mr-2 inline size-4 text-primary" aria-hidden="true" />
            Team support throughout
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16 lg:pb-20">
        <p className="eyebrow">ABOUT OUR RATES</p>
        <h2 className="mb-8 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">How pricing works</h2>
        <FaqList items={rateFaqs} />
      </section>

      <CtaBand />
    </>
  );
}
