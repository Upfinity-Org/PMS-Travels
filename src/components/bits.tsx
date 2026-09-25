import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-r border-white/10 py-4 text-center last:border-0 sm:py-5">
      <p className="font-display text-lg font-bold text-secondary sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[.13em] text-white/60 sm:text-[10px]">{label}</p>
    </div>
  );
}

export function Feature({ icon: Icon, title, copy }: { icon: LucideIcon; title: string; copy: string }) {
  return (
    <div className="group border-t border-black/10 pt-5">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-primary" strokeWidth={1.8} aria-hidden="true" />
        <h3 className="font-display text-xl font-semibold">{title}</h3>
      </div>
      <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}

export function Rate({ label, value }: { label: string; value: string }) {
  return (
    <div role="cell">
      <p className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground md:hidden">{label}</p>
      <p className="mt-1 font-display text-lg font-semibold text-primary md:mt-0">{value}</p>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-.04em] sm:text-4xl">{title}</h2>
      {children}
    </div>
  );
}
