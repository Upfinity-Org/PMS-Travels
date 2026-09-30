import { ArrowUpRight, ChevronRight, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { Feature, Stat } from '../components/bits';
import { FleetCard } from '../components/FleetCard';
import { Instagram } from '../components/icons';
import { Photo } from '../components/Photo';
import { SITE } from '../config/site';
import { features } from '../content/features';
import { fleet } from '../content/fleet';
import { services } from '../content/services';
import { PHOTOS, photoSrcSet, photoUrl } from '../lib/images';
import { Seo } from '../seo/Seo';
import { businessSchema, websiteSchema } from '../seo/schema';

const HERO_WIDTHS = [640, 960, 1280, 1600, 2000];

export function Home() {
  return (
    <>
      <Seo
        absoluteTitle
        title="Car Rental with Driver, Local & Outstation | PMS Tours & Travels"
        description="Local and outstation car rentals with driver across Tamil Nadu and South India. Sedans, MPVs, SUVs and Tempo Travellers with clear fares. Call +91 63807 98106."
        path="/"
        jsonLd={[businessSchema(), websiteSchema()]}
        preload={{ href: photoUrl(PHOTOS.temple, 1280), srcSet: photoSrcSet(PHOTOS.temple, HERO_WIDTHS), sizes: '100vw' }}
      />

      <section id="home" className="relative isolate min-h-[760px] bg-dark pt-[76px] text-white lg:min-h-[790px]" data-dark="">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,19,18,.96)_5%,rgba(20,19,18,.72)_47%,rgba(20,19,18,.15))]" />
        <Photo
          id={PHOTOS.temple}
          alt="Colourful South Indian temple architecture at dusk"
          widths={HERO_WIDTHS}
          sizes="100vw"
          quality={80}
          priority
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_center] opacity-80"
        />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-dark to-transparent" />
        <div className="absolute bottom-0 right-0 hidden h-[62%] w-[43%] overflow-hidden border-l border-t border-white/20 lg:block">
          <Photo
            id={PHOTOS.hills}
            alt="Misty Tamil Nadu mountain landscape"
            widths={[600, 900, 1200]}
            sizes="43vw"
            className="h-full w-full object-cover opacity-75 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/20 to-transparent" />
          <div className="absolute bottom-7 right-7 border-l border-secondary pl-4 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-secondary">Tamil landscapes</p>
            <p className="mt-1 font-display text-xl font-semibold text-white">Temples to hill roads</p>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-24 pt-28 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:pt-32">
          <div className="flex flex-col justify-center">
            <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-secondary backdrop-blur">
              <Sparkles size={13} aria-hidden="true" /> Local rides · long roads · big plans
            </div>
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-[76px]">
              The road is better <span className="text-secondary">when it’s yours.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              Our team makes local and outstation car rentals with driver feel easy, from airport drops to family temple tours across South India.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 font-semibold shadow-[0_12px_35px_rgba(168,50,38,.35)] transition hover:-translate-y-0.5 hover:bg-[#c33c2e]"
              >
                Plan your journey{' '}
                <ArrowUpRight size={18} aria-hidden="true" className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/25 px-6 py-4 font-semibold transition hover:border-secondary hover:text-secondary"
              >
                See how pricing works <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <aside className="w-full max-w-[390px] border border-white/20 bg-[#1a1a1a]/75 p-6 backdrop-blur-md" aria-label="Travel desk">
              <div className="flex items-start justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[.18em] text-secondary">PMS travel desk</span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold text-dark">OPEN NOW</span>
              </div>
              <p className="mt-5 font-display text-2xl font-semibold leading-tight">Tell our team where you’re headed.</p>
              <p className="mt-2 text-sm leading-6 text-white/70">We’ll help you choose the right vehicle and confirm a clear fare.</p>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-sm font-semibold"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={17} className="text-secondary" aria-hidden="true" /> WhatsApp booking
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </aside>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/20">
          <div className="mx-auto grid max-w-7xl grid-cols-3 px-5 lg:px-8">
            <Stat value="24 / 7" label="Travel support" />
            <Stat value="1–17" label="Seat options" />
            <Stat value="South India" label="Made to explore" />
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="eyebrow">THE PMS PROMISE</p>
              <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-[-.04em] sm:text-5xl">
                The little things make the whole trip.
              </h2>
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
        </div>
      </section>

      <section id="fleet" className="border-y border-black/5 bg-[#ebe5da] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">CHOOSE YOUR RIDE</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-[-.04em] sm:text-5xl">
                Fleet for every kind
                <br />
                of together.
              </h2>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link to="/fleet" className="group inline-flex w-fit items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary">
                Explore the fleet <ArrowUpRight size={16} aria-hidden="true" className="transition group-hover:translate-x-0.5" />
              </Link>
              <Link to="/pricing" className="group inline-flex w-fit items-center gap-2 border-b border-primary pb-1 text-sm font-bold text-primary">
                See pricing <ArrowUpRight size={16} aria-hidden="true" className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {fleet.map((car, index) => (
              <FleetCard key={car.slug} car={car} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-dark py-20 text-white lg:py-28" data-dark="">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1fr_1fr] lg:gap-24 lg:px-8">
          <div>
            <p className="eyebrow text-secondary">DESIGNED AROUND YOU</p>
            <h2 className="mt-5 max-w-lg font-display text-4xl font-bold leading-[1.05] tracking-[-.04em] sm:text-5xl">
              More than a cab.
              <br />
              <span className="text-white/40">A proper travel plan.</span>
            </h2>
            <p className="mt-7 max-w-md leading-7 text-white/70">
              From the first stop to the last, we make getting your people where they need to be feel simple.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3.5 text-sm font-bold text-dark transition hover:bg-[#e8b24a]"
              >
                <MessageCircle size={17} aria-hidden="true" /> Start on WhatsApp
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-bold transition hover:border-secondary hover:text-secondary"
              >
                All services
              </Link>
            </div>
          </div>
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {services.map((service, index) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className="group flex items-center justify-between gap-4 py-5 sm:py-6">
                  <span className="font-display text-xl font-semibold sm:text-2xl">
                    <span className="mr-4 font-sans text-xs font-bold text-secondary">0{index + 1}</span>
                    {service.name}
                  </span>
                  <ChevronRight className="shrink-0 text-secondary transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid overflow-hidden bg-primary text-white lg:grid-cols-[.95fr_1.05fr]" data-dark="">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="eyebrow text-[#F7D98B]">A NOTE FROM PMS</p>
              <h2 className="mt-5 font-display text-4xl font-bold leading-tight tracking-[-.04em]">Easy journeys, built on trust.</h2>
              <p className="mt-6 max-w-md leading-7 text-white/80">
                PMS Tours &amp; Travels is a local team with a straightforward promise: comfortable vehicles, safe travel and honest help when you need it. No
                complicated process, just travel sorted.
              </p>
              <Link to="/about" className="mt-8 inline-flex items-center gap-2 border-b border-white/60 pb-1 text-sm font-bold hover:border-secondary hover:text-secondary">
                More about us <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <div className="mt-10 flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-full bg-white/15 font-display text-lg font-bold" aria-hidden="true">
                  P
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">PMS travel team</p>
                  <p className="text-sm text-white/70">Here for every journey</p>
                </div>
              </div>
            </div>
            <div id="contact" className="flex flex-col justify-center bg-[#f1c35e] p-8 text-dark sm:p-12 lg:p-16">
              <p className="text-xs font-bold uppercase tracking-[.16em]">Ready when you are</p>
              <a href={`tel:${SITE.phone.tel}`} className="mt-4 font-display text-3xl font-bold tracking-[-.04em] transition hover:text-primary sm:text-4xl">
                {SITE.phone.display}
              </a>
              <p className="mt-2 text-sm text-dark/75">Contact Us for an instant quote or trip advice.</p>
              <div className="mt-9 space-y-3">
                <a href={`tel:${SITE.phone.tel}`} className="flex items-center justify-between border-b border-dark/20 pb-3 font-semibold">
                  <span className="flex items-center gap-3">
                    <Phone size={18} aria-hidden="true" /> Contact Us
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <Link to="/contact" className="flex items-center justify-between border-b border-dark/20 pb-3 font-semibold">
                  <span className="flex items-center gap-3">
                    <MessageCircle size={18} aria-hidden="true" /> Send an enquiry online
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
                <a
                  href={SITE.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border-b border-dark/20 pb-3 font-semibold"
                >
                  <span className="flex items-center gap-3">
                    <Instagram size={18} /> {SITE.instagram.handle}
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
