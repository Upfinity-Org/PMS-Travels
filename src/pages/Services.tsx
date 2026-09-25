import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { CtaBand } from '../components/CtaBand';
import { FaqList } from '../components/FaqList';
import { HowItWorks } from '../components/HowItWorks';
import { PageHero } from '../components/PageHero';
import { bookingFaqs } from '../content/faqs';
import { services } from '../content/services';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, pageSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
];

export function Services() {
  return (
    <>
      <Seo
        title="Travel Services: Temples, Airports, Groups"
        description="Temple and pilgrimage circuits, family outings, corporate and college travel, airport pickups and custom South India itineraries, all with a driver and a clear fare."
        path="/services"
        jsonLd={[businessSchema(), pageSchema('CollectionPage', 'Travel services', '/services'), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        eyebrow="DESIGNED AROUND YOU"
        title={
          <>
            More than a cab.
            <br />A proper travel plan.
          </>
        }
        intro="From the first stop to the last, we make getting your people where they need to be feel simple."
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <ul className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                to={`/services/${s.slug}`}
                className="group flex h-full flex-col justify-between gap-8 border border-black/10 bg-card p-7 transition hover:border-primary"
              >
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-[-.03em]">{s.name}</h2>
                  <p className="mt-3 max-w-sm leading-7 text-muted-foreground">{s.summary}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Learn more <ArrowUpRight size={16} aria-hidden="true" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-black/10 bg-[#ebe5da] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 className="mb-10 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">Booking is three simple steps.</h2>
          <HowItWorks />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
        <p className="eyebrow">QUESTIONS</p>
        <h2 className="mb-8 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">Before you book</h2>
        <FaqList items={bookingFaqs} />
      </section>

      <CtaBand />
    </>
  );
}
