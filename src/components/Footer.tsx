import { Link } from 'react-router';
import { SITE, hasAddress } from '../config/site';
import { fleet } from '../content/fleet';
import { services } from '../content/services';
import { Instagram } from './icons';

const linkClass = 'text-sm text-muted-foreground transition hover:text-primary';

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-3" aria-label="PMS Tours and Travels home">
            <span className="flex h-11 shrink-0 items-center rounded-lg bg-dark px-2.5">
              <img src="/logo-mark.png" width={1447} height={463} alt="" className="h-6 w-auto" loading="lazy" />
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-dark/70">Tours &amp; Travels</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Local and outstation car rentals with driver, thoughtfully arranged across Tamil Nadu and South India.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li>
              <a href={`tel:${SITE.phone.tel}`} className="font-semibold text-primary hover:text-dark">
                {SITE.phone.display}
              </a>
            </li>
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className={linkClass}>
                  {SITE.email}
                </a>
              </li>
            )}
            <li>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 ${linkClass}`}>
                <Instagram size={16} /> {SITE.instagram.handle}
              </a>
            </li>
            {hasAddress && (
              <li className="text-muted-foreground">
                {[SITE.address.street, SITE.address.locality, SITE.address.region, SITE.address.postalCode].filter(Boolean).join(', ')}
              </li>
            )}
          </ul>
        </div>

        <nav aria-label="Vehicles">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-dark">Fleet</p>
          <ul className="mt-4 space-y-2.5">
            {fleet.map((car) => (
              <li key={car.slug}>
                <Link to={`/fleet/${car.slug}`} className={linkClass}>
                  {car.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/pricing" className={linkClass}>
                Pricing
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-dark">Services</p>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={`/services/${service.slug}`} className={linkClass}>
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-dark">Company</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link to="/about" className={linkClass}>
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass}>
                Contact &amp; enquiries
              </Link>
            </li>
            <li>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp
              </a>
            </li>
            <li>
              <Link to="/privacy-policy" className={linkClass}>
                Privacy policy
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-black/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> P.M.S Tours &amp; Travels
          </p>
          <p>Local &amp; outstation travel, thoughtfully arranged.</p>
          <a href={SITE.developer.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary transition hover:text-dark">
            Designed and developed by {SITE.developer.name}
          </a>
        </div>
      </div>
    </footer>
  );
}
