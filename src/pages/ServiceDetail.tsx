import { ArrowUpRight, Check } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { CtaBand } from '../components/CtaBand';
import { PageHero } from '../components/PageHero';
import { fleet, getCar, localRateLabel } from '../content/fleet';
import { getService, services } from '../content/services';
import { Seo } from '../seo/Seo';
import { breadcrumbSchema, businessSchema, serviceSchema } from '../seo/schema';
import { NotFound } from './NotFound';

export function ServiceDetail() {
  const { slug } = useParams();
  const service = getService(slug);
  if (!service) return <NotFound />;

  const path = `/services/${service.slug}`;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: service.name, path },
  ];
  const suggested = service.vehicles.map(getCar).filter((c): c is (typeof fleet)[number] => Boolean(c));
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        path={path}
        jsonLd={[businessSchema(), serviceSchema(service), breadcrumbSchema(crumbs)]}
      />
      <PageHero eyebrow="SERVICE" title={service.h1} intro={<p>{service.summary}</p>} crumbs={crumbs} compact />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:gap-20">
          <div>
            <div className="prose-copy">
              {service.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold tracking-[-.03em]">What we arrange</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.arrange.map((item) => (
                <li key={item} className="flex items-start gap-3 border-t border-black/10 pt-3 text-[15px]">
                  <Check size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 font-display text-2xl font-bold tracking-[-.03em]">Good to know</h2>
            <ul className="mt-5 space-y-3 text-[15px] leading-7 text-muted-foreground">
              {service.goodToKnow.map((item) => (
                <li key={item} className="border-t border-black/10 pt-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside aria-label="Suggested vehicles" className="self-start">
            <p className="eyebrow-gold">VEHICLES WE SUGGEST</p>
            <ul className="mt-5 space-y-4">
              {suggested.map((car) => (
                <li key={car.slug}>
                  <Link to={`/fleet/${car.slug}`} className="group block border border-black/10 bg-card p-5 transition hover:border-primary">
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block font-display text-xl font-semibold">{car.name}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {car.models} · {car.seats}
                        </span>
                      </span>
                      <ArrowUpRight size={18} className="shrink-0 text-primary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-primary">{localRateLabel(car)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="mt-5 inline-block text-sm font-semibold text-primary hover:underline">
              See the full rate card
            </Link>
          </aside>
        </div>
      </section>

      <section className="border-t border-black/10 bg-[#ebe5da] py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-[-.03em]">More services</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  {s.name} <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand formQuery={`service=${encodeURIComponent(service.enquiryType)}`} />
    </>
  );
}
