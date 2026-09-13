/**
 * Rail metrics, one to one with the menu-unification handoff (sections *Rail
 * structure* and *Rail item metrics*).
 *
 * They live here rather than inline so the two densities sit side by side and a
 * change to one is visibly a change to the other. The paddings are arbitrary
 * Tailwind values on purpose: 11px and 15px are rail metrics, not steps in the
 * design system's spacing or type scale, and promoting them would imply they are
 * reusable elsewhere.
 */
import { cn } from '../cn';

export type Density = 'comfortable' | 'touch';

/** Every row is a positioning context for its 4px active bar. */
export const ROW_BASE =
  'group relative flex w-full items-center gap-3 text-left whitespace-nowrap ' +
  'transition-colors duration-150 ease-linear ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-blue';

/** App rows and the two top-level rows share their metrics. */
const APP_ROW_PADDING: Record<Density, string> = {
  comfortable: 'py-3 pr-2 pl-6',
  touch: 'py-4 pr-2 pl-6',
};

const SUB_ITEM_PADDING: Record<Density, string> = {
  comfortable: 'py-[11px] pr-2 pl-9',
  touch: 'py-4 pr-2 pl-9',
};

export const appRowClass = (density: Density, active: boolean) =>
  cn(
    ROW_BASE,
    APP_ROW_PADDING[density],
    'text-[15px] font-bold',
    active ? 'bg-atlantic text-white' : 'text-white hover:bg-atlantic/60',
  );

export const topLevelRowClass = (density: Density, active: boolean) =>
  cn(
    ROW_BASE,
    APP_ROW_PADDING[density],
    'text-[15px] font-bold',
    active ? 'bg-primary-blue text-white' : 'text-white hover:bg-atlantic/60',
  );

export const subItemClass = (density: Density, active: boolean) =>
  cn(
    ROW_BASE,
    SUB_ITEM_PADDING[density],
    'text-body-sm',
    active ? 'bg-primary-blue font-bold text-white' : 'text-white hover:bg-atlantic/60',
  );

/**
 * The 4px accent bar pinned to the left edge of an active row. A sibling
 * element rather than a border, so it cannot shift the row's text by a pixel.
 */
export const ACTIVE_BAR = 'pointer-events-none absolute inset-y-0 left-0 w-1 bg-accent-blue';

export const SUBTITLE =
  'pt-4 pr-6 pb-1.5 pl-9 text-[11px] font-bold uppercase tracking-[1px] text-slate-400 select-none';

/** Radius 0 everywhere in this design, except this. */
export const BADGE =
  'ml-auto shrink-0 rounded-full bg-primary-orange px-2 py-0.5 text-body-xs-emphasis text-white';

/** Icons are 20px and take the rail's pale blue on app rows, white on items. */
export const APP_ICON = 'shrink-0 text-sky-mist [&>svg]:h-5 [&>svg]:w-5';
export const ITEM_ICON = 'shrink-0 text-current [&>svg]:h-5 [&>svg]:w-5';
