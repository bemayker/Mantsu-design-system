import React from 'react';
import { cn } from './cn';

/** Breadcrumbs — hierarchical navigation trail. */
export interface Crumb { label: string; href?: string; }
export interface BreadcrumbsProps { items: Crumb[]; className?: string; }
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => (
  <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-body-sm', className)}>
    {items.map((c, i) => {
      const last = i === items.length - 1;
      return (
        <React.Fragment key={i}>
          {c.href && !last ? (
            <a href={c.href} className="text-slate-500 hover:text-primary-blue">{c.label}</a>
          ) : (
            <span className={last ? 'text-midnight font-bold' : 'text-slate-500'}>{c.label}</span>
          )}
          {!last && <span className="text-slate-400">/</span>}
        </React.Fragment>
      );
    })}
  </nav>
);
export default Breadcrumbs;
