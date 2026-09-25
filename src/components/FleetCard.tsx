import { ArrowUpRight, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import type { FleetCar } from '../content/fleet';
import { VehiclePhoto } from './Photo';

export function FleetCard({ car, index }: { car: FleetCar; index: number }) {
  return (
    <article className="group relative flex flex-col overflow-hidden border border-black/10 bg-card transition hover:border-primary hover:shadow-[0_18px_40px_rgba(0,0,0,.08)]">
      <span className="absolute left-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-dark text-xs font-bold text-white">
        0{index + 1}
      </span>
      {/* The photo is a studio cutout on a near-white background, so it's shown whole
          (object-contain) on a matching light panel rather than cropped to fill the tile. */}
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[#F1ECE3] p-8">
        <VehiclePhoto
          slug={car.slug}
          alt={car.imageAlt}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-gold-ink">{car.accent}</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-[-.03em]">
          <Link to={`/fleet/${car.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {car.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{car.models}</p>
        <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{car.copy}</p>
        <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <UsersRound size={16} className="text-primary" aria-hidden="true" />
            {car.seats}
          </span>
          <span className="flex items-center gap-2 text-primary" aria-hidden="true">
            Details <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </article>
  );
}
