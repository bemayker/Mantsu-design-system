import type { ReactNode } from 'react';

import { sortApps, type SuiteAppKey, type SuiteManifest } from '../SuiteNav/manifest';
import type { SettingsScope } from './types';

/** The scope key for settings that apply to the whole suite. Lives in Core. */
export const SUITE_SCOPE = 'suite';

/**
 * Apps that have no settings and therefore no scope.
 *
 * Ask Mantsu is the one today (handoff: "Ask Mantsu has no settings and
 * therefore no scope in this list"). Keeping it as a named constant rather than
 * a condition scattered across four apps means the next app without settings is
 * one edit.
 */
export const APPS_WITHOUT_SETTINGS: readonly SuiteAppKey[] = ['reporting'];

export interface ScopeLabels {
  /** Label for the suite-wide scope. Supplied by the app: i18n stays there. */
  suite: string;
  /**
   * Label per app key. Falls back to the app's `name` from the manifest, which
   * is a product name and not translated anyway.
   */
  apps?: Partial<Record<SuiteAppKey, string>>;
}

export interface ScopesFromManifestOptions {
  labels: ScopeLabels;
  /** Icon per scope key, including `suite`. Supplied by the app. */
  icons?: Partial<Record<string, ReactNode>>;
  /**
   * Path template for another app's settings page. The deep-link convention is
   * `/settings/:scope/:row` (NAV-1), so the default is `/settings/{scope}`.
   */
  settingsPath?: (scope: string) => string;
}

/**
 * Turn a suite manifest into the scope column.
 *
 * The rules this encodes, so four apps do not each re-derive them:
 *
 * - A scope exists only for an app that is in the manifest. An app that is not
 *   installed in this landscape has no settings to link to, and a row that
 *   navigates to a dead origin is worse than no row.
 * - The `suite` scope exists only when Core does, because Core owns `app_users`
 *   and the role matrix. It is local in Core and a link everywhere else.
 * - An app with no settings gets no scope.
 * - The app that served the manifest is the local scope; every other is a link
 *   to that app's own settings page.
 */
export function scopesFromManifest(
  manifest: SuiteManifest,
  options: ScopesFromManifestOptions,
): SettingsScope[] {
  const { labels, icons, settingsPath = (scope) => `/settings/${scope}` } = options;
  const scopes: SettingsScope[] = [];

  const core = manifest.apps.find((app) => app.key === 'core');
  if (core) {
    const local = manifest.self === 'core';
    scopes.push({
      key: SUITE_SCOPE,
      label: labels.suite,
      icon: icons?.[SUITE_SCOPE],
      local,
      // Prefer the manifest's own settingsUrl: it is what Core says its suite
      // settings live at, rather than a path this consumer assembled.
      href: local ? undefined : (manifest.suite?.settingsUrl ?? `${core.url}${settingsPath(SUITE_SCOPE)}`),
    });
  }

  for (const app of sortApps(manifest.apps)) {
    if (APPS_WITHOUT_SETTINGS.includes(app.key)) continue;
    const local = app.key === manifest.self;
    scopes.push({
      key: app.key,
      label: labels.apps?.[app.key] ?? app.name,
      icon: icons?.[app.key],
      local,
      href: local ? undefined : `${app.url}${settingsPath(app.key)}`,
    });
  }

  return scopes;
}
