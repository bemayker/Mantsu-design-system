import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SuiteNav } from './SuiteNav';
import type { SuiteManifest } from './manifest';
import type { SuiteNavItem, RenderSuiteNavLink } from './types';

const manifest = (): SuiteManifest => ({
  schemaVersion: 1,
  self: 'downtimes',
  source: 'core',
  suite: {
    dashboardUrl: 'http://core.example/',
    settingsUrl: 'http://core.example/settings/suite',
  },
  apps: [
    { key: 'core', name: 'Core', icon: 'core', url: 'http://core.example', order: 10 },
    {
      key: 'cockpit',
      name: 'Order cockpit',
      icon: 'cockpit',
      url: 'http://cockpit.example',
      order: 20,
      nav: [
        { key: 'cockpit-home', label: { en: 'Order cockpit', nl: 'Order cockpit' }, path: '/cockpit', group: null },
        {
          key: 'scrap',
          label: { en: 'Scrap reason tree', nl: 'Afkeurredenenboom' },
          path: '/scrap-reasons',
          group: 'configuration',
        },
      ],
    },
    { key: 'downtimes', name: 'Downtimes', icon: 'downtimes', url: 'http://downtimes.example', order: 30 },
  ],
});

const ownItems: SuiteNavItem[] = [
  { key: 'records', label: 'Downtimes', href: '/downtimes' },
  { key: 'report', label: 'Report', href: '/downtime-report', badge: 3 },
  { key: 'reasons', label: 'Downtime reason tree', href: '/downtime-reasons', group: 'configuration' },
];

const renderRail = (props: Partial<React.ComponentProps<typeof SuiteNav>> = {}) =>
  render(
    <SuiteNav
      manifest={manifest()}
      ownItems={ownItems}
      settingsHref="/settings/downtimes"
      {...props}
    />,
  );

describe('structure', () => {
  it('renders the rail as a labelled nav with the manifest source on it', () => {
    renderRail();
    const nav = screen.getByRole('navigation', { name: 'Suite navigation' });
    expect(nav).toHaveAttribute('data-suite-source', 'core');
  });

  it('shows Dashboard from the manifest and Settings pinned at the bottom', () => {
    renderRail();
    expect(screen.getByTestId('suitenav-dashboard')).toHaveAttribute('href', 'http://core.example/');
    expect(screen.getByTestId('suitenav-settings')).toHaveAttribute('href', '/settings/downtimes');
  });

  it('drops the Dashboard row when there is no Core to point it at', () => {
    const m = manifest();
    delete m.suite;
    m.apps = m.apps.filter((app) => app.key !== 'core');
    renderRail({ manifest: m });
    expect(screen.queryByTestId('suitenav-dashboard')).not.toBeInTheDocument();
    expect(screen.getByTestId('suitenav-settings')).toBeInTheDocument();
  });

  it('renders this app own items and expands them without being told to', () => {
    renderRail();
    expect(screen.getByTestId('suitenav-item-downtimes-records')).toBeVisible();
    expect(screen.getByTestId('suitenav-app-downtimes')).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders an app with no items as a link to its origin, not a disclosure', () => {
    renderRail();
    const core = screen.getByTestId('suitenav-app-core');
    expect(core.tagName).toBe('A');
    expect(core).toHaveAttribute('href', 'http://core.example');
    expect(core).not.toHaveAttribute('aria-expanded');
  });

  it('renders another app with phase 2 nav as a collapsed disclosure', () => {
    renderRail();
    const cockpit = screen.getByTestId('suitenav-app-cockpit');
    expect(cockpit.tagName).toBe('BUTTON');
    expect(cockpit).toHaveAttribute('aria-expanded', 'false');
    expect(cockpit).toHaveAttribute('aria-controls', 'suitenav-panel-cockpit');
    expect(document.getElementById('suitenav-panel-cockpit')).not.toBeVisible();
  });

  it('joins another app url and path into an absolute href', () => {
    renderRail({ openApps: { cockpit: true } });
    expect(screen.getByTestId('suitenav-item-cockpit-cockpit-home')).toHaveAttribute(
      'href',
      'http://cockpit.example/cockpit',
    );
  });

  it('orders apps by order, not by the array it was handed', () => {
    const m = manifest();
    m.apps = [m.apps[2], m.apps[0], m.apps[1]];
    renderRail({ manifest: m });
    const rows = screen.getAllByTestId(/^suitenav-app-/);
    expect(rows.map((r) => r.getAttribute('data-testid'))).toEqual([
      'suitenav-app-core',
      'suitenav-app-cockpit',
      'suitenav-app-downtimes',
    ]);
  });
});

describe('toggling', () => {
  it('reports a toggle rather than owning the state', async () => {
    const onToggleApp = vi.fn();
    renderRail({ onToggleApp });
    await userEvent.click(screen.getByTestId('suitenav-app-cockpit'));
    expect(onToggleApp).toHaveBeenCalledWith('cockpit');
    // Still collapsed: openApps did not change, and the component does not
    // pretend it did.
    expect(screen.getByTestId('suitenav-app-cockpit')).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens an app when openApps says so', () => {
    renderRail({ openApps: { cockpit: true } });
    expect(screen.getByTestId('suitenav-app-cockpit')).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('suitenav-panel-cockpit')).toBeVisible();
  });

  it('keeps this app expanded even when openApps tries to collapse it', () => {
    renderRail({ openApps: { downtimes: false } });
    expect(screen.getByTestId('suitenav-app-downtimes')).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('active state', () => {
  it('marks the active item with aria-current and the accent bar', () => {
    const { container } = renderRail({ activeKey: 'report' });
    const active = screen.getByTestId('suitenav-item-downtimes-report');
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('suitenav-item-downtimes-records')).not.toHaveAttribute('aria-current');
    expect(container.querySelectorAll('.bg-accent-blue').length).toBeGreaterThan(0);
  });

  it('marks the app row of the app that served the manifest', () => {
    renderRail();
    expect(screen.getByTestId('suitenav-app-downtimes').className).toContain('bg-atlantic');
    expect(screen.getByTestId('suitenav-app-cockpit').className).not.toContain('bg-atlantic ');
  });

  it('puts the accent bar on the app row, not around its whole submenu', () => {
    renderRail();
    const row = screen.getByTestId('suitenav-app-downtimes');
    const bar = row.parentElement!.querySelector('.bg-accent-blue');
    expect(bar).not.toBeNull();
    // The bar's positioning context must contain the row and nothing else; a
    // context that also wrapped the panel would stretch the bar down the list.
    expect(bar!.parentElement!.contains(document.getElementById('suitenav-panel-downtimes'))).toBe(false);
  });

  it('accepts dashboard and settings as active keys', () => {
    renderRail({ activeKey: 'settings' });
    expect(screen.getByTestId('suitenav-settings')).toHaveAttribute('aria-current', 'page');
  });
});

describe('the Configuration subtitle', () => {
  it('renders configuration items under it regardless of array order', () => {
    renderRail();
    const panel = document.getElementById('suitenav-panel-downtimes')!;
    // Children, not getAllByRole: the subtitle is aria-hidden and so has no
    // role, which is exactly the property the next test asserts.
    const labels = Array.from(panel.children).map((el) => el.textContent);
    expect(labels).toEqual(['Downtimes', 'Report3', 'Configuration', 'Downtime reason tree']);
  });

  it('is inert: no click target, not focusable, not in the accessibility tree', () => {
    renderRail();
    const panel = document.getElementById('suitenav-panel-downtimes')!;
    const subtitle = within(panel).getByText('Configuration');
    expect(subtitle).toHaveAttribute('aria-hidden', 'true');
    expect(subtitle.tagName).toBe('LI');
    expect(subtitle.querySelector('a, button')).toBeNull();
    expect(subtitle).not.toHaveAttribute('tabindex');
    // Uppercasing is presentation, so the text a screen reader would reach is
    // title case and the CSS carries the design.
    expect(subtitle.className).toContain('uppercase');
  });

  it('is absent when an app has no configuration items', () => {
    renderRail({ ownItems: ownItems.filter((i) => i.group !== 'configuration') });
    const panel = document.getElementById('suitenav-panel-downtimes')!;
    expect(within(panel).queryByText('Configuration')).not.toBeInTheDocument();
  });

  it('takes its wording from labels, since the component does no i18n', () => {
    renderRail({ labels: { configuration: 'Configuratie', railAriaLabel: 'Suite-navigatie' } });
    const panel = document.getElementById('suitenav-panel-downtimes')!;
    expect(within(panel).getByText('Configuratie')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Suite-navigatie' })).toBeInTheDocument();
  });
});

describe('renderLink', () => {
  it('is told which hrefs cross an origin so a router link is not used for them', () => {
    const seen: Array<{ href: string; external: boolean }> = [];
    const renderLink: RenderSuiteNavLink = (props) => {
      seen.push({ href: props.href, external: props.external });
      return (
        <a href={props.href} className={props.className} data-testid={props.testId}>
          {props.children}
        </a>
      );
    };
    renderRail({ renderLink });

    // jsdom serves the rail from http://localhost, so every absolute URL here
    // is another origin and every app-relative path is not.
    expect(seen.find((s) => s.href === '/downtimes')?.external).toBe(false);
    expect(seen.find((s) => s.href === '/settings/downtimes')?.external).toBe(false);
    expect(seen.find((s) => s.href === 'http://core.example')?.external).toBe(true);
    expect(seen.find((s) => s.href === 'http://core.example/')?.external).toBe(true);
  });

  it('hands over the styling, so an app cannot accidentally render an unstyled rail', () => {
    const renderLink = vi.fn<RenderSuiteNavLink>((props) => <a href={props.href}>{props.children}</a>);
    renderRail({ renderLink });
    expect(renderLink.mock.calls[0][0].className).toContain('pl-6');
  });
});

describe('density', () => {
  it('uses the comfortable metrics by default', () => {
    renderRail();
    expect(screen.getByTestId('suitenav-item-downtimes-records').className).toContain('py-[11px]');
    expect(screen.getByTestId('suitenav-app-downtimes').className).toContain('py-3');
  });

  it('enlarges the hit areas on touch', () => {
    renderRail({ density: 'touch' });
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('data-suite-density', 'touch');
    expect(screen.getByTestId('suitenav-item-downtimes-records').className).toContain('py-4');
    expect(screen.getByTestId('suitenav-app-downtimes').className).toContain('py-4');
  });
});

describe('schema skew', () => {
  it('renders this app only, and never an empty menu, on an unsupported version', () => {
    const onUnsupportedSchema = vi.fn();
    const m = { ...manifest(), schemaVersion: 2 };
    renderRail({ manifest: m, onUnsupportedSchema });

    expect(onUnsupportedSchema).toHaveBeenCalledWith(2, 1);
    expect(screen.queryByTestId('suitenav-app-core')).not.toBeInTheDocument();
    expect(screen.queryByTestId('suitenav-app-cockpit')).not.toBeInTheDocument();
    expect(screen.getByTestId('suitenav-app-downtimes')).toBeInTheDocument();
    expect(screen.getByTestId('suitenav-item-downtimes-records')).toBeVisible();
    expect(screen.getByTestId('suitenav-settings')).toBeInTheDocument();
  });

  it('reports the mismatch once, not on every render', () => {
    const onUnsupportedSchema = vi.fn();
    const m = { ...manifest(), schemaVersion: 2 };
    const { rerender } = renderRail({ manifest: m, onUnsupportedSchema });
    rerender(<SuiteNav manifest={m} ownItems={ownItems} onUnsupportedSchema={onUnsupportedSchema} />);
    expect(onUnsupportedSchema).toHaveBeenCalledTimes(1);
  });

  it('still renders items when the payload does not even list this app', () => {
    const m = { ...manifest(), schemaVersion: 9, apps: [manifest().apps[0]] };
    renderRail({ manifest: m });
    expect(screen.getByTestId('suitenav-item-downtimes-records')).toBeInTheDocument();
  });
});

describe('fallback landscape', () => {
  it('exposes the degraded source for E2E and shows no other apps', () => {
    const m: SuiteManifest = {
      schemaVersion: 1,
      self: 'downtimes',
      source: 'fallback',
      apps: [{ key: 'downtimes', name: 'Downtimes', icon: 'downtimes', url: 'http://downtimes.example', order: 0 }],
    };
    renderRail({ manifest: m });
    expect(screen.getByRole('navigation')).toHaveAttribute('data-suite-source', 'fallback');
    expect(screen.queryByTestId('suitenav-dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('suitenav-app-core')).not.toBeInTheDocument();
    expect(screen.getByTestId('suitenav-item-downtimes-records')).toBeVisible();
  });
});

describe('keyboard', () => {
  it('walks the rail with the arrow keys, and wraps', async () => {
    renderRail();
    const dashboard = screen.getByTestId('suitenav-dashboard');
    dashboard.focus();

    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByTestId('suitenav-app-core'));

    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(dashboard);

    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByTestId('suitenav-settings'));

    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(dashboard);
  });

  it('skips the items of a collapsed app', async () => {
    renderRail();
    screen.getByTestId('suitenav-app-cockpit').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByTestId('suitenav-app-downtimes'));
  });
});

describe('icons and logo', () => {
  it('renders the icon the app supplies for an app key', () => {
    renderRail({ icons: { downtimes: <svg data-testid="downtimes-mark" /> } });
    expect(screen.getByTestId('downtimes-mark')).toBeInTheDocument();
  });

  it('falls back to a generic glyph for an icon key the app does not know', () => {
    renderRail({ icons: {} });
    expect(screen.getByTestId('suitenav-app-core')).toBeInTheDocument();
  });

  it('makes the logo a button only when there is somewhere to click to', async () => {
    const onLogoClick = vi.fn();
    const { rerender } = renderRail({ logo: <img alt="Mantsu" />, onLogoClick });
    await userEvent.click(screen.getByTestId('suitenav-logo'));
    expect(onLogoClick).toHaveBeenCalled();

    rerender(<SuiteNav manifest={manifest()} ownItems={ownItems} logo={<img alt="Mantsu" />} />);
    expect(screen.queryByTestId('suitenav-logo')).not.toBeInTheDocument();
  });
});

describe('the ten-item app the design asks for', () => {
  it('renders all of them without collapsing or truncating the list', () => {
    const ten: SuiteNavItem[] = Array.from({ length: 10 }, (_, i) => ({
      key: `item-${i}`,
      label: `Item ${i}`,
      href: `/item-${i}`,
      group: i >= 8 ? 'configuration' : null,
    }));
    renderRail({ ownItems: ten });
    const panel = document.getElementById('suitenav-panel-downtimes')!;
    expect(within(panel).getAllByRole('link')).toHaveLength(10);
  });
});
