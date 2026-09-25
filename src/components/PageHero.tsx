import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Crumb[];
  /** Smaller headline for long titles (detail pages). */
  compact?: boolean;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, intro, crumbs, compact = false, children }: PageHeroProps) {
  return (
    <section className="border-b border-black/10 bg-[#ebe5da]">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.7fr]">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1
              className={`mt-4 font-display font-bold tracking-[-.05em] ${
                compact ? 'text-4xl leading-[1.05] sm:text-5xl' : 'text-5xl leading-[1] sm:text-6xl'
              }`}
            >
              {title}
            </h1>
          </div>
          {intro && <div className="max-w-md self-end leading-7 text-muted-foreground">{intro}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
