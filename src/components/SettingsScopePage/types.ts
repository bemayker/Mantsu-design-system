import type { ReactNode } from 'react';

import type { SuiteNavLinkProps } from '../SuiteNav/types';

/**
 * One entry in the scope column.
 *
 * A scope is local when its settings live in the app rendering this page, and
 * external when they live in another app. External scopes are ordinary links to
 * that app's own settings page, because in a multi-origin suite there is no
 * other honest way to reach them.
 */
export interface SettingsScope {
  /** `suite`, or an app key. Matched against `activeScope`. */
  key: string;
  label: string;
  icon?: ReactNode;
  /** Rendered in this page. */
  local: boolean;
  /** Where an external scope points, typically `{app.url}/settings/{scope}`. */
  href?: string;
}

/** One clickable setting inside the local scope. */
export interface SettingRowItem {
  key: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  /** A same-origin path. Omit and pass `onSelect` for a row that is not a route. */
  href?: string;
  onSelect?: () => void;
}

export interface SettingsScopePageProps {
  /**
   * Every scope this landscape has, in display order. Build it from the suite
   * manifest so a scope for an app that is not installed cannot appear.
   */
  scopes: SettingsScope[];
  activeScope: string;
  /** Called for a local scope. An external scope navigates instead. */
  onSelectScope?: (key: string) => void;
  title: string;
  intro?: string;
  /**
   * The rows of the active local scope. A scope with no rows and no `children`
   * is dropped from the column entirely: Ask Mantsu has no settings, so it has
   * no scope.
   */
  rows?: SettingRowItem[];
  /** Rendered under the rows, for a scope that needs more than a row list. */
  children?: ReactNode;
  /** Same contract as `SuiteNav`: the app supplies its own link element. */
  renderLink?: (props: SuiteNavLinkProps) => ReactNode;
  labels?: {
    /** Eyebrow above the scope column. */
    scope?: string;
  };
  className?: string;
}
