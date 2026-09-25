import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router';

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail. The matching BreadcrumbList JSON-LD is added by each page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item.path}>
              <li>
                {last ? (
                  <span aria-current="page" className="font-semibold text-dark">
                    {item.name}
                  </span>
                ) : (
                  <Link to={item.path} className="font-semibold text-primary hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
              {!last && (
                <li aria-hidden="true" className="text-muted-foreground">
                  <ChevronRight size={14} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
