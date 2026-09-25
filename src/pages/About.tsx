import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Feature, Stat } from '../components/bits';
import { CtaBand } from '../components/CtaBand';
import { HowItWorks } from '../components/HowItWorks';
import { PageHero } from '../components/PageHero';
import { features } from '../content/features';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, pageSchema } from '../seo/schema';

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
];

export function About() {
  return (
    <>
      <Seo
        title="About Our Travel Team"
        description="P.M.S Tours & Travels is a local team with a straightforward promise: comfortable vehicles, safe travel and honest help, for local and outstation journeys across South India."
        path="/about"
        jsonLd={[businessSchema(), pageSchema('AboutPage', 'About P.M.S Tours & Travels', '/about'), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        eyebrow="A NOTE FROM PMS"
        title="Easy journeys, built on trust."
        intro="PMS Tours & Travels is a local team with a straightforward promise: comfortable vehicles, safe travel and honest help when you need it. No complicated process, just travel sorted."
        crumbs={crumbs}
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">THE PMS PROMISE</p>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-.04em]">The little things make the whole trip.</h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              A calm ride starts long before the engine does. We put care into the details so you can simply enjoy the view.
            </p>
          </div>
          <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {features.map((f) => (
              <Feature key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#ebe5da] py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-.04em] sm:text-4xl">Local rides and long roads.</h2>
          </div>
          <div className="prose-copy">
            <p>
              We rent sedans, MPVs, SUVs and group travellers with an experienced driver. For plans within the city, a local package covers a set number of
              hours. For longer journeys, outstation rates are charged per kilometre, with driver allowance extra.
            </p>
            <p>
              Our travel support runs around the clock, so you can reach a real person when plans change. Browse the{' '}
              <Link to="/fleet" className="font-semibold text-primary underline">
                fleet
              </Link>
              , read about our{' '}
              <Link to="/services" className="font-semibold text-primary underline">
                services
              </Link>{' '}
              or check the{' '}
              <Link to="/pricing" className="font-semibold text-primary underline">
                pricing page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="bg-dark text-white" data-dark="">
        <div className="mx-auto grid max-w-7xl grid-cols-3 px-5 lg:px-8">
          <Stat value="24 / 7" label="Travel support" />
          <Stat value="1–17" label="Seat options" />
          <Stat value="South India" label="Made to explore" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="eyebrow">HOW IT WORKS</p>
        <h2 className="mb-10 mt-4 font-display text-3xl font-bold tracking-[-.04em] sm:text-4xl">Travel, sorted in three steps.</h2>
        <HowItWorks />
        <Link to="/contact" className="mt-10 inline-flex items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary">
          Start with an enquiry <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <CtaBand eyebrow="READY WHEN YOU ARE" title="Let’s plan your next journey." />
    </>
  );
}
