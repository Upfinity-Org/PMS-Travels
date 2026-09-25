import { ArrowUpRight, Check, Phone, UsersRound } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { CtaBand } from '../components/CtaBand';
import { PageHero } from '../components/PageHero';
import { VehiclePhoto } from '../components/Photo';
import { SITE } from '../config/site';
import { fleet, getCar } from '../content/fleet';
import { services } from '../content/services';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, vehicleServiceSchema } from '../seo/schema';
import { NotFound } from './NotFound';

export function FleetDetail() {
  const { slug } = useParams();
  const car = getCar(slug);
  if (!car) return <NotFound />;

  const path = `/fleet/${car.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: car.name, path },
  ];
  const related = services.filter((s) => s.vehicles.slice(0, 2).includes(car.slug));
  const others = fleet.filter((c) => c.slug !== car.slug);

  return (
    <>
      <Seo
        title={car.detail.metaTitle}
        description={car.detail.metaDescription}
        path={path}
        jsonLd={[businessSchema(), vehicleServiceSchema(car), breadcrumbSchema(crumbs)]}
      />
      <PageHero eyebrow={car.accent.toUpperCase()} title={car.detail.h1} intro={<p>{car.copy}</p>} crumbs={crumbs} compact />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr] lg:gap-16">
          <div>
            {/* A studio cutout on a near-white background, shown whole (object-contain) on a
                matching light panel rather than cropped to fill the frame. */}
            <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-[#F1ECE3] p-10">
              <VehiclePhoto slug={car.slug} alt={car.imageAlt} sizes="(min-width: 1024px) 55vw, 100vw" priority className="h-full w-full object-contain" />
            </div>

            <div className="prose-copy mt-10">
              {car.detail.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold tracking-[-.03em]">Best for</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {car.detail.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-3 border-t border-black/10 pt-3 text-[15px]">
                  <Check size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-bold tracking-[-.03em]">Vehicles in this class</h2>
            <ul className="mt-5 divide-y divide-black/10 border-y border-black/10">
              {car.detail.vehicles.map((v) => (
                <li key={v.name} className="flex items-center justify-between gap-4 py-4">
                  <span className="font-display text-lg font-semibold">{v.name}</span>
                  <span className="text-sm text-muted-foreground">{v.note}</span>
                </li>
              ))}
            </ul>

            {related.length > 0 && (
              <>
                <h2 className="mt-12 font-display text-2xl font-bold tracking-[-.03em]">Popular for</h2>
                <ul className="mt-5 flex flex-wrap gap-3">
                  {related.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/services/${s.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                      >
                        {s.name} <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="self-start border border-black/10 bg-card p-7 lg:sticky lg:top-28" aria-label={`${car.name} at a glance`}>
            <p className="eyebrow-gold">AT A GLANCE</p>
            <dl className="mt-5 divide-y divide-black/10">
              <div className="py-3">
                <dt className="text-xs font-semibold text-muted-foreground">Seats</dt>
                <dd className="mt-1 flex items-center gap-2 font-display text-lg font-semibold">
                  <UsersRound size={17} className="text-primary" aria-hidden="true" />
                  {car.seats}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-xs font-semibold text-muted-foreground">Pricing</dt>
                <dd className="mt-1 text-sm">Contact our team for a quote tailored to your route, dates and group size.</dd>
              </div>
            </dl>
            <Link
              to={`/contact?vehicle=${car.slug}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-[#c53a2c]"
            >
              Enquire about this vehicle <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a href={`tel:${SITE.phone.tel}`} className="mt-3 flex items-center justify-center gap-2 rounded-full border border-black/20 px-6 py-3.5 font-semibold transition hover:border-primary hover:text-primary">
              <Phone size={16} aria-hidden="true" /> {SITE.phone.display}
            </a>
            <Link to="/pricing" className="mt-4 block text-center text-sm font-semibold text-primary hover:underline">
              How pricing works
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#ebe5da] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-[-.03em]">Other vehicles</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link to={`/fleet/${c.slug}`} className="group flex items-center justify-between gap-4 border border-black/10 bg-card p-5 transition hover:border-primary">
                  <span>
                    <span className="block font-display text-xl font-semibold">{c.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {c.models} · {c.seats}
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand formQuery={`vehicle=${car.slug}`} />
    </>
  );
}
