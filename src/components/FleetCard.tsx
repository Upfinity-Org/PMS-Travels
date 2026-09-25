import { ArrowUpRight, UsersRound } from 'lucide-react';
import { Link } from 'react-router';
import type { FleetCar } from '../content/fleet';
import { Photo } from './Photo';

export function FleetCard({ car, index }: { car: FleetCar; index: number }) {
  return (
    <article className="group relative min-h-[475px] overflow-hidden bg-dark text-white" data-dark="">
      <Photo
        id={car.photo}
        alt={car.imageAlt}
        widths={[480, 720, 960, 1200]}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <span className="absolute left-5 top-5 grid size-10 place-items-center rounded-full border border-white/30 bg-black/25 font-display text-sm font-bold backdrop-blur">
        0{index + 1}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-secondary">{car.accent}</p>
        <h3 className="mt-2 font-display text-3xl font-bold tracking-[-.04em]">
          <Link to={`/fleet/${car.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {car.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-white/70">{car.models}</p>
        <p className="mt-4 max-w-xs text-sm leading-6 text-white/80">{car.copy}</p>
        <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <UsersRound size={16} className="text-secondary" aria-hidden="true" />
            {car.seats}
          </span>
          <span className="flex items-center gap-2 text-secondary" aria-hidden="true">
            Details <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </article>
  );
}
