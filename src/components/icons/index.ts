/**
 * Mantsu module icons.
 *
 * Published as `@bemayker/mantsu-design-system/icons`. These are the suite's
 * own marks (Core, Order cockpit, Downtimes, Lists, Reporting); generic
 * pictograms stay with the consuming app, which passes them to components as
 * `ReactNode`. `lucide-react` is deliberately not a dependency of this
 * package for that reason.
 *
 * The module icons themselves land in NAV-2 together with the SuiteNav rail;
 * this barrel exists so the export path is stable from v1.0.0 on.
 */

export type IconProps = {
  /** Rendered width and height in px. Defaults to 20. */
  size?: number;
  className?: string;
  /** Accessible name. Omit for a decorative icon next to a text label. */
  title?: string;
};
