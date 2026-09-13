/**
 * Mantsu module icons.
 *
 * Published as `@bemayker/mantsu-design-system/icons`. These are the suite's own
 * marks. Generic pictograms stay with the consuming app, which passes them to
 * components as `ReactNode`; `lucide-react` is deliberately not a dependency of
 * this package for that reason.
 *
 * Core has no mark of its own yet and uses a Lucide `boxes` stand-in supplied by
 * the app (NAV-1, open point 6), so there is no `ModuleCore` here.
 *
 * The four components below are generated from the handoff's SVG sheet by
 * `scripts/generate-module-icons.mjs`. Do not hand-edit them.
 */

export type { IconProps } from './IconProps';
export { ModuleCockpit } from './ModuleCockpit';
export { ModuleDowntimes } from './ModuleDowntimes';
export { ModuleLists } from './ModuleLists';
export { ModuleReporting } from './ModuleReporting';
