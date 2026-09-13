import type { ReactNode } from 'react';

import type { SuiteAppKey, SuiteManifest } from './manifest';

/**
 * One item in the rail, as the consuming app supplies it: label already
 * translated, href already built, visibility already decided.
 *
 * The component never filters. An app knows its own capabilities; this component
 * knows how a rail looks, and mixing the two is what made four hand-copied
 * shells drift in the first place.
 */
export interface SuiteNavItem {
  /** Stable, and what `activeKey` is matched against. */
  key: string;
  label: string;
  href: string;
  /** `'configuration'` renders under the inert Configuration subtitle. */
  group?: 'configuration' | null;
  /** 20px is the rail's icon size. Optional: an item may be label-only. */
  icon?: ReactNode;
  /** A count beside the label, e.g. users waiting for access. */
  badge?: number | string;
}

/** What `renderLink` is handed for every clickable row in the rail. */
export interface SuiteNavLinkProps {
  href: string;
  /**
   * True when `href` points at another origin. An app's router cannot handle
   * those, so this is the signal to render a plain `<a>` instead of a `NavLink`.
   */
  external: boolean;
  active: boolean;
  /** All of the rail's styling. Pass it through, or the row loses its design. */
  className: string;
  /** Ready to spread onto the element; `'page'` when active, otherwise undefined. */
  ariaCurrent: 'page' | undefined;
  testId: string;
  children: ReactNode;
}

export type RenderSuiteNavLink = (props: SuiteNavLinkProps) => ReactNode;

export interface SuiteNavLabels {
  /** Top-level row that links to the suite dashboard. */
  dashboard?: string;
  /** Pinned bottom row. */
  settings?: string;
  /** The inert subtitle above configuration items. */
  configuration?: string;
  /** `aria-label` on the `nav` element. */
  railAriaLabel?: string;
}

export interface SuiteNavProps {
  /** The landscape, from `GET /api/v1/suite/manifest`, through `parseManifest`. */
  manifest: SuiteManifest;
  /** This app's own items, already filtered and translated. */
  ownItems: SuiteNavItem[];
  /**
   * Key of the active item. Matched against `ownItems[].key`, plus the two
   * reserved keys `'dashboard'` and `'settings'`.
   */
  activeKey?: string;
  /**
   * Which app submenus are expanded. The app that served the manifest is always
   * expanded regardless of what this says, per the design: you can never
   * collapse yourself out of your own navigation.
   */
  openApps?: Record<string, boolean>;
  onToggleApp?: (key: SuiteAppKey) => void;
  /**
   * How every clickable row is rendered. Defaults to a plain `<a>`, which is
   * correct for cross-origin rows and adequate for Storybook; an app passes its
   * own router link so same-origin rows do not reload the page.
   */
  renderLink?: RenderSuiteNavLink;
  /**
   * Icon per app `key`, supplied by the app. Spread `moduleIcons` from
   * `@bemayker/mantsu-design-system/icons` and add `core` yourself: Core has no
   * mark of its own yet and uses a Lucide `boxes` stand-in.
   */
  icons?: Partial<Record<string, ReactNode>>;
  /** Rail metrics. `'touch'` enlarges the hit areas for terminal and tablet use. */
  density?: 'comfortable' | 'touch';
  logo?: ReactNode;
  onLogoClick?: () => void;
  /**
   * Target of the top-level Dashboard row. Defaults to `manifest.suite.dashboardUrl`.
   * The row is omitted when neither exists, because without Core there is no
   * suite dashboard to point at.
   */
  dashboardHref?: string;
  /** Target of the pinned Settings row. Required for the row to appear. */
  settingsHref?: string;
  settingsBadge?: number | string;
  /** Which of the two languages in a manifest `nav` label to render. */
  language?: 'en' | 'nl';
  labels?: SuiteNavLabels;
  /**
   * Prepended to every `data-testid` this component emits.
   *
   * An app renders the rail twice: once as the persistent desktop rail and
   * once inside its mobile drawer. Below the breakpoint both are in the DOM at
   * the same time (the desktop one merely `display: none`), so without a
   * prefix every id exists twice on one page and `getByTestId` is ambiguous in
   * Testing Library and an error in Playwright's strict mode. The drawer
   * passes something like `'mobile-'`; the rail passes nothing.
   */
  testIdPrefix?: string;
  /**
   * Called once when the manifest's `schemaVersion` is not the one this
   * component implements. The rail then renders this app's own items and
   * Settings only. Never an empty menu.
   */
  onUnsupportedSchema?: (received: number, supported: number) => void;
  className?: string;
}
