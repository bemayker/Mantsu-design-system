import React, { useEffect, useRef } from 'react';

import { cn } from '../cn';
import { SUITE_MANIFEST_SCHEMA_VERSION, sortApps, type SuiteApp } from './manifest';
import {
  ACTIVE_BAR,
  APP_ICON,
  BADGE,
  ITEM_ICON,
  SUBTITLE,
  appRowClass,
  subItemClass,
  topLevelRowClass,
} from './railStyles';
import type { RenderSuiteNavLink, SuiteNavItem, SuiteNavProps } from './types';

const DEFAULT_LABELS = {
  dashboard: 'Dashboard',
  settings: 'Settings',
  configuration: 'Configuration',
  railAriaLabel: 'Suite navigation',
};

/** Rendered for an app whose `icon` key the consumer has no component for. */
const GenericAppIcon: React.FC = () => (
  <svg viewBox="0 0 20 20" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <rect x="2.75" y="2.75" width="6" height="6" />
    <rect x="11.25" y="2.75" width="6" height="6" />
    <rect x="2.75" y="11.25" width="6" height="6" />
    <rect x="11.25" y="11.25" width="6" height="6" />
  </svg>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={cn('ml-auto shrink-0 text-sky-mist transition-transform duration-150 ease-linear', open && 'rotate-90')}
    aria-hidden
  >
    <path d="m7.5 4.5 6 5.5-6 5.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const defaultRenderLink: RenderSuiteNavLink = ({ href, external, className, ariaCurrent, testId, children }) => (
  <a
    href={href}
    className={className}
    aria-current={ariaCurrent}
    data-testid={testId}
    {...(external ? { rel: 'noreferrer' } : {})}
  >
    {children}
  </a>
);

/** Same-origin comparison that cannot throw on a relative or malformed href. */
function isExternal(href: string): boolean {
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(href)) return false;
  const origin = typeof globalThis !== 'undefined' ? globalThis.location?.origin : undefined;
  if (!origin) return true;
  try {
    return new URL(href).origin !== origin;
  } catch {
    return true;
  }
}

/**
 * SuiteNav — the Mantsu suite navigation rail.
 *
 * Pure presentation. No router, no i18n, no fetch, no localStorage: the app owns
 * all four and passes the results in. That is what lets one component serve four
 * apps built on different registries, and it is the whole reason this is a
 * package rather than a fifth hand-copied shell.
 *
 * Structure, from the menu-unification handoff: a Dashboard row, one collapsible
 * row per app with its items beneath it, an inert *Configuration* subtitle above
 * configuration items, and a Settings row pinned to the bottom.
 *
 * The rail never renders empty. A manifest whose `schemaVersion` this component
 * does not implement falls back to this app's own items plus Settings, which is
 * the same shape as a landscape where Core could not be reached.
 */
export const SuiteNav: React.FC<SuiteNavProps> = ({
  manifest,
  ownItems,
  activeKey,
  openApps,
  onToggleApp,
  renderLink = defaultRenderLink,
  icons,
  density = 'comfortable',
  logo,
  onLogoClick,
  dashboardHref,
  settingsHref,
  settingsBadge,
  language = 'en',
  labels,
  onUnsupportedSchema,
  className,
}) => {
  const text = { ...DEFAULT_LABELS, ...labels };
  const supported = manifest.schemaVersion === SUITE_MANIFEST_SCHEMA_VERSION;
  const navRef = useRef<HTMLElement>(null);

  const reportedFor = useRef<number | null>(null);
  useEffect(() => {
    if (supported || reportedFor.current === manifest.schemaVersion) return;
    reportedFor.current = manifest.schemaVersion;
    onUnsupportedSchema?.(manifest.schemaVersion, SUITE_MANIFEST_SCHEMA_VERSION);
  }, [supported, manifest.schemaVersion, onUnsupportedSchema]);

  // Arrow keys walk the rail's own controls. Scoped to the rail so it never
  // competes with a listbox or a tree inside the page content.
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const focusable = Array.from(
      navRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      // A collapsed panel keeps its items in the DOM under `hidden`. They are
      // out of the tab order, so they must be out of the arrow order too.
    ).filter((el) => el.closest('[hidden]') === null);
    if (focusable.length === 0) return;
    const current = focusable.indexOf(document.activeElement as HTMLElement);
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = focusable.length - 1;
    else if (event.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % focusable.length;
    else next = current <= 0 ? focusable.length - 1 : current - 1;
    event.preventDefault();
    focusable[next]?.focus();
  };

  const link = (
    item: { href: string; testId: string; active: boolean; className: string },
    children: React.ReactNode,
  ) => (
    <>
      {item.active ? <span className={ACTIVE_BAR} /> : null}
      {renderLink({
        href: item.href,
        external: isExternal(item.href),
        active: item.active,
        className: item.className,
        ariaCurrent: item.active ? 'page' : undefined,
        testId: item.testId,
        children,
      })}
    </>
  );

  const renderItems = (appKey: string, items: SuiteNavItem[]) => {
    const ordinary = items.filter((item) => item.group !== 'configuration');
    const configuration = items.filter((item) => item.group === 'configuration');

    const row = (item: SuiteNavItem) => {
      const active = item.key === activeKey;
      return (
        <li key={item.key} className="relative">
          {link(
            {
              href: item.href,
              testId: `suitenav-item-${appKey}-${item.key}`,
              active,
              className: subItemClass(density, active),
            },
            <>
              {item.icon ? <span className={ITEM_ICON}>{item.icon}</span> : null}
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && item.badge !== null ? (
                <span className={BADGE}>{item.badge}</span>
              ) : null}
            </>,
          )}
        </li>
      );
    };

    return (
      <>
        {ordinary.map(row)}
        {configuration.length > 0 ? (
          <>
            {/* Inert by design: no click target, no hover, not focusable, not in
                the tab order. `aria-hidden` keeps it out of the a11y tree too,
                since the items below it are self-describing. */}
            <li className={SUBTITLE} aria-hidden>
              {text.configuration}
            </li>
            {configuration.map(row)}
          </>
        ) : null}
      </>
    );
  };

  /** Items of an app other than this one, from the phase 2 manifest `nav`. */
  const itemsFromManifest = (app: SuiteApp): SuiteNavItem[] =>
    (app.nav ?? []).map((entry) => ({
      key: entry.key,
      label: entry.label[language],
      href: `${app.url}${entry.path}`,
      group: entry.group,
    }));

  const renderApp = (app: SuiteApp) => {
    const isSelf = app.key === manifest.self;
    const items = isSelf ? ownItems : itemsFromManifest(app);
    // The current app is always expanded: you cannot collapse yourself out of
    // your own navigation. Everything else follows `openApps`.
    const open = isSelf || openApps?.[app.key] === true;
    const panelId = `suitenav-panel-${app.key}`;
    const icon = icons?.[app.icon] ?? <GenericAppIcon />;

    // Phase 1: an app with no items is a link to its origin, not a toggle. A
    // disclosure that opens onto nothing is worse than no disclosure.
    if (items.length === 0) {
      return (
        <li key={app.key} className="relative">
          {link(
            {
              href: app.url,
              testId: `suitenav-app-${app.key}`,
              active: false,
              className: appRowClass(density, false),
            },
            <>
              <span className={APP_ICON}>{icon}</span>
              <span className="truncate">{app.name}</span>
            </>,
          )}
        </li>
      );
    }

    return (
      <li key={app.key}>
        {/* The positioning context is the row, not the whole list item: an
            inset-y-0 bar on the li would run the full height of the open
            submenu instead of marking the row. */}
        <div className="relative">
          {isSelf ? <span className={ACTIVE_BAR} /> : null}
          <button
            type="button"
            onClick={() => onToggleApp?.(app.key)}
            aria-expanded={open}
            aria-controls={panelId}
            className={appRowClass(density, isSelf)}
            data-testid={`suitenav-app-${app.key}`}
          >
            <span className={APP_ICON}>{icon}</span>
            <span className="truncate">{app.name}</span>
            <ChevronIcon open={open} />
          </button>
        </div>
        <ul id={panelId} hidden={!open}>
          {renderItems(app.key, items)}
        </ul>
      </li>
    );
  };

  const dashboard = dashboardHref ?? manifest.suite?.dashboardUrl;
  const apps = supported ? sortApps(manifest.apps) : [];
  const selfApp = manifest.apps.find((app) => app.key === manifest.self);

  return (
    <nav
      ref={navRef}
      onKeyDown={onKeyDown}
      aria-label={text.railAriaLabel}
      data-suite-source={manifest.source}
      data-suite-density={density}
      className={cn(
        'flex w-[239px] shrink-0 flex-col overflow-y-auto bg-midnight',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {logo ? (
        <div className="px-6 py-5">
          {onLogoClick ? (
            <button
              type="button"
              onClick={onLogoClick}
              className="block h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
              data-testid="suitenav-logo"
            >
              {logo}
            </button>
          ) : (
            <div className="h-12">{logo}</div>
          )}
        </div>
      ) : null}

      <ul>
        {/* Without Core there is no suite dashboard, so the row is absent rather
            than pointing at an origin the manifest says is not installed. */}
        {dashboard ? (
          <li className="relative">
            {link(
              {
                href: dashboard,
                testId: 'suitenav-dashboard',
                active: activeKey === 'dashboard',
                className: topLevelRowClass(density, activeKey === 'dashboard'),
              },
              <span className="truncate">{text.dashboard}</span>,
            )}
          </li>
        ) : null}

        {supported
          ? apps.map(renderApp)
          : // Schema this component does not implement: this app's own items,
            // and nothing claimed about a landscape it cannot read.
            selfApp
            ? [renderApp({ ...selfApp, nav: undefined })]
            : renderItems(manifest.self, ownItems)}
      </ul>

      {settingsHref ? (
        <div className="relative mt-auto border-t border-rail-divider pt-2">
          {link(
            {
              href: settingsHref,
              testId: 'suitenav-settings',
              active: activeKey === 'settings',
              className: topLevelRowClass(density, activeKey === 'settings'),
            },
            <>
              <span className="truncate">{text.settings}</span>
              {settingsBadge !== undefined && settingsBadge !== null ? (
                <span className={BADGE}>{settingsBadge}</span>
              ) : null}
            </>,
          )}
        </div>
      ) : null}
    </nav>
  );
};

export default SuiteNav;
