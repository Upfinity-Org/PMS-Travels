import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { Seo } from '../seo/Seo';

export function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for could not be found." path="/404" noindex />
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="eyebrow">ERROR 404</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-bold leading-[1] tracking-[-.05em] sm:text-6xl">This road doesn’t go anywhere.</h1>
        <p className="mt-6 max-w-md leading-7 text-muted-foreground">
          The page you asked for has moved or never existed. Try one of these instead, or call our team and we’ll point you the right way.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white hover:bg-[#c53a2c]">
            Back to home <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <Link to="/fleet" className="inline-flex items-center rounded-full border border-black/20 px-6 py-3.5 font-semibold hover:border-primary hover:text-primary">
            See the fleet
          </Link>
          <Link to="/contact" className="inline-flex items-center rounded-full border border-black/20 px-6 py-3.5 font-semibold hover:border-primary hover:text-primary">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
