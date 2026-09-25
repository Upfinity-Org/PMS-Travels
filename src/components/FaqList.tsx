import { Plus } from 'lucide-react';
import type { Faq } from '../content/faqs';

/** Native <details> keeps every answer in the HTML (crawlable) and works without JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-black/10 border-y border-black/10">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus size={18} className="shrink-0 text-primary transition group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
