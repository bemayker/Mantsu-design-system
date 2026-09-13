import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SettingsScopePage } from './SettingsScopePage';
import { APPS_WITHOUT_SETTINGS, SUITE_SCOPE, scopesFromManifest } from './scopes';
import type { SettingRowItem, SettingsScope } from './types';
import type { SuiteManifest } from '../SuiteNav/manifest';

const manifest = (self: SuiteManifest['self'] = 'core'): SuiteManifest => ({
  schemaVersion: 1,
  self,
  source: 'core',
  suite: {
    dashboardUrl: 'http://core.example/',
    settingsUrl: 'http://core.example/settings/suite',
  },
  apps: [
    { key: 'core', name: 'Core', icon: 'core', url: 'http://core.example', order: 10 },
    { key: 'cockpit', name: 'Order cockpit', icon: 'cockpit', url: 'http://cockpit.example', order: 20 },
    { key: 'downtimes', name: 'Downtimes', icon: 'downtimes', url: 'http://downtimes.example', order: 30 },
    { key: 'lists', name: 'Lists', icon: 'lists', url: 'http://lists.example', order: 40 },
    { key: 'reporting', name: 'Ask Mantsu', icon: 'reporting', url: 'http://ask.example', order: 50 },
  ],
});

const labels = { suite: 'Suite' };

const coreRows: SettingRowItem[] = [
  {
    key: 'redpanda',
    label: 'RedPanda',
    description: 'Cluster, topics en credentials van de RedPanda-broker.',
    href: '/settings/core/redpanda',
  },
  { key: 'batch-statuses', label: 'Batch statuses', href: '/settings/core/batch-statuses' },
];

const renderPage = (props: Partial<React.ComponentProps<typeof SettingsScopePage>> = {}) =>
  render(
    <SettingsScopePage
      scopes={scopesFromManifest(manifest(), { labels })}
      activeScope="core"
      title="Core"
      rows={coreRows}
      {...props}
    />,
  );

describe('scopesFromManifest', () => {
  it('offers a scope per installed app, plus Suite, in manifest order', () => {
    const scopes = scopesFromManifest(manifest(), { labels });
    expect(scopes.map((s) => s.key)).toEqual([SUITE_SCOPE, 'core', 'cockpit', 'downtimes', 'lists']);
  });

  it('drops an app that has no settings', () => {
    expect(APPS_WITHOUT_SETTINGS).toContain('reporting');
    const scopes = scopesFromManifest(manifest(), { labels });
    expect(scopes.map((s) => s.key)).not.toContain('reporting');
  });

  it('never offers a scope for an app this landscape does not have', () => {
    const m = manifest();
    m.apps = m.apps.filter((app) => app.key !== 'lists');
    // A row that navigates to an origin the manifest just said is not installed
    // is worse than no row.
    expect(scopesFromManifest(m, { labels }).map((s) => s.key)).not.toContain('lists');
  });

  it('marks the app that served the manifest as the local scope', () => {
    const scopes = scopesFromManifest(manifest('downtimes'), { labels });
    const local = scopes.filter((s) => s.local);
    expect(local.map((s) => s.key)).toEqual(['downtimes']);
  });

  it('links every other scope at that app own settings page', () => {
    const scopes = scopesFromManifest(manifest('downtimes'), { labels });
    expect(scopes.find((s) => s.key === 'cockpit')?.href).toBe('http://cockpit.example/settings/cockpit');
    expect(scopes.find((s) => s.key === 'downtimes')?.href).toBeUndefined();
  });

  it('takes the suite settings url from the manifest rather than assembling one', () => {
    const scopes = scopesFromManifest(manifest('lists'), { labels });
    expect(scopes.find((s) => s.key === SUITE_SCOPE)?.href).toBe('http://core.example/settings/suite');
  });

  it('makes Suite local only in Core', () => {
    expect(scopesFromManifest(manifest('core'), { labels })[0].local).toBe(true);
    expect(scopesFromManifest(manifest('lists'), { labels })[0].local).toBe(false);
  });

  it('offers no Suite scope in a landscape without Core', () => {
    const m: SuiteManifest = {
      schemaVersion: 1,
      self: 'lists',
      source: 'fallback',
      apps: [{ key: 'lists', name: 'Lists', icon: 'lists', url: 'http://lists.example', order: 0 }],
    };
    // Standalone Lists: the suite scope lives in Core, and there is no Core.
    expect(scopesFromManifest(m, { labels }).map((s) => s.key)).toEqual(['lists']);
  });
});

describe('the two columns', () => {
  it('renders the scope column with the handoff metrics', () => {
    renderPage();
    const column = screen.getByRole('navigation', { name: 'Scope' });
    expect(column.className).toContain('w-[248px]');
    expect(column.className).toContain('bg-slate-50');
  });

  it('marks the active scope and leaves the others unmarked', () => {
    renderPage();
    expect(screen.getByTestId('settings-scope-core')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTestId('settings-scope-cockpit')).not.toHaveAttribute('aria-current');
  });

  it('renders the title, intro and rows', () => {
    renderPage({ intro: 'De technische instellingen waar de rest van de suite op loopt.' });
    expect(screen.getByRole('heading', { name: 'Core' })).toBeInTheDocument();
    expect(screen.getByText(/technische instellingen/)).toBeInTheDocument();
    expect(screen.getByTestId('settings-row-redpanda')).toBeInTheDocument();
    expect(screen.getByText('Cluster, topics en credentials van de RedPanda-broker.')).toBeInTheDocument();
  });

  it('renders children under the rows, for a scope that needs more than a list', () => {
    renderPage({ children: <p>Extra detail</p> });
    expect(screen.getByText('Extra detail')).toBeInTheDocument();
  });
});

describe('switching scope', () => {
  it('switches a local scope in place, with no navigation', async () => {
    const onSelectScope = vi.fn();
    renderPage({ scopes: scopesFromManifest(manifest('core'), { labels }), onSelectScope });

    const suite = screen.getByTestId('settings-scope-suite');
    expect(suite.tagName).toBe('BUTTON');
    await userEvent.click(suite);
    expect(onSelectScope).toHaveBeenCalledWith('suite');
  });

  it('navigates for an external scope, because it is another origin', () => {
    renderPage({ scopes: scopesFromManifest(manifest('core'), { labels }) });
    const downtimes = screen.getByTestId('settings-scope-downtimes');
    // A real link, so middle-click and open-in-new-tab behave.
    expect(downtimes.tagName).toBe('A');
    expect(downtimes).toHaveAttribute('href', 'http://downtimes.example/settings/downtimes');
  });

  it('tells renderLink which scope links leave this origin', () => {
    const seen: Array<{ href: string; external: boolean }> = [];
    renderPage({
      renderLink: (props) => {
        seen.push({ href: props.href, external: props.external });
        return (
          <a href={props.href} className={props.className} data-testid={props.testId}>
            {props.children}
          </a>
        );
      },
    });
    expect(seen.find((s) => s.href === 'http://downtimes.example/settings/downtimes')?.external).toBe(true);
    expect(seen.find((s) => s.href === '/settings/core/redpanda')?.external).toBe(false);
  });

  it('drops an external scope that has no href rather than rendering a dead row', () => {
    const scopes: SettingsScope[] = [
      { key: 'core', label: 'Core', local: true },
      { key: 'lists', label: 'Lists', local: false },
    ];
    renderPage({ scopes });
    expect(screen.queryByTestId('settings-scope-lists')).not.toBeInTheDocument();
  });
});

describe('setting rows', () => {
  it('renders a row without an href as a button', async () => {
    const onSelect = vi.fn();
    renderPage({ rows: [{ key: 'mqtt', label: 'MQTT broker', onSelect }] });
    const row = screen.getByTestId('settings-row-mqtt');
    expect(row.tagName).toBe('BUTTON');
    await userEvent.click(row);
    expect(onSelect).toHaveBeenCalled();
  });

  it('carries the hover treatment from the handoff', () => {
    renderPage();
    const row = screen.getByTestId('settings-row-redpanda');
    expect(row.className).toContain('hover:border-primary-blue');
    expect(row.className).toContain('hover:bg-slate-50');
  });

  it('keeps the platform focus ring instead of removing it', async () => {
    renderPage();
    const row = screen.getByTestId('settings-row-redpanda');
    // The design says: "Focus: keep the platform focus ring; the design does not
    // remove it." outline-none alone would do exactly that, so the visible
    // replacement has to come with it.
    expect(row.className).toContain('focus-visible:ring-2');
    await userEvent.tab();
    expect(document.activeElement).not.toBe(document.body);
  });

  it('renders no row list when the scope has none', () => {
    renderPage({ rows: [] });
    expect(screen.queryByRole('list', { name: undefined })).not.toBeNull();
    expect(screen.queryByTestId('settings-row-redpanda')).not.toBeInTheDocument();
  });
});

describe('a landscape without Core', () => {
  it('shows only this app own scope, and it is local', () => {
    const m: SuiteManifest = {
      schemaVersion: 1,
      self: 'lists',
      source: 'fallback',
      apps: [{ key: 'lists', name: 'Lists', icon: 'lists', url: 'http://lists.example', order: 0 }],
    };
    renderPage({
      scopes: scopesFromManifest(m, { labels }),
      activeScope: 'lists',
      title: 'Lists',
      rows: [{ key: 'answers', label: 'Answer templates', href: '/settings/lists/answers' }],
    });

    const column = screen.getByRole('navigation', { name: 'Scope' });
    expect(within(column).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByTestId('settings-scope-lists')).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByTestId('settings-scope-suite')).not.toBeInTheDocument();
  });
});
