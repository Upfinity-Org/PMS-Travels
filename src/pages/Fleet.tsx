import { Check } from 'lucide-react';
import { Link } from 'react-router';
import { CtaBand } from '../components/CtaBand';
import { FleetCard } from '../components/FleetCard';
import { PageHero } from '../components/PageHero';
import { fleet } from '../content/fleet';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, pageSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Fleet', path: '/fleet' },
];

const guide = [
  { guests: 'Up to 4 guests', pick: 'Sedan', slug: 'sedans', note: 'Couples, small families and business travel.' },
  { guests: '5 to 7 guests', pick: 'MPV or SUV', slug: 'mpv-suv', note: 'Family trips and long roads with luggage.' },
  { guests: '8 to 17 guests', pick: 'Group Traveller', slug: 'tempo-traveller', note: 'Groups that want to travel together.' },
];

export function Fleet() {
  return (
    <>
      <Seo
        title="Fleet: Sedans, MPVs, SUVs & Travellers"
        description="Explore our rental fleet: Swift Dzire and Hyundai Aura sedans, Ertiga and Innova Crysta, plus Tempo Traveller and Urbania for groups. Seats 4 to 17 guests, all with driver."
        path="/fleet"
        jsonLd={[businessSchema(), pageSchema('CollectionPage', 'Rental fleet', '/fleet'), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        eyebrow="OUR FLEET"
        title={
          <>
            Fleet for every kind
            <br />
            of together.
          </>
        }
        intro="Sedans, MPVs, SUVs and group travellers, each rented with an experienced driver for local plans and long outstation roads."
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {fleet.map((car, index) => (
            <FleetCard key={car.slug} car={car} index={index} />
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#ebe5da] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">WHICH ONE?</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-.04em] sm:text-4xl">Choosing the right vehicle</h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              Start with how many people are travelling, then think about luggage and the length of the route. Not sure? Tell us your plan and our team will
              suggest a fit.
            </p>
          </div>
          <ul className="divide-y divide-black/10 border-y border-black/10">
            {guide.map((g) => (
              <li key={g.slug} className="grid gap-1 py-5 sm:grid-cols-[.8fr_1.2fr] sm:gap-8">
                <div>
                  <p className="font-display text-xl font-semibold">{g.guests}</p>
                  <p className="text-sm font-semibold text-primary">
                    <Link to={`/fleet/${g.slug}`} className="hover:underline">
                      {g.pick}
                    </Link>
                  </p>
                </div>
                <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                  <Check size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
                  {g.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand eyebrow="NOT SURE WHICH TO PICK?" title="Tell us the trip and we’ll suggest a fit." />
    </>
  );
}
