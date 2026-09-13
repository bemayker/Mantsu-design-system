import React from 'react';

import { cn } from '../cn';
import type { RenderSuiteNavLink } from '../SuiteNav/types';
import type { SettingRowItem, SettingsScope, SettingsScopePageProps } from './types';

/**
 * Metrics from the menu-unification handoff, *Screen 1 — Settings*. Arbitrary
 * values where the number is a page metric rather than a step in the design
 * system's scales.
 */
const SCOPE_COLUMN = 'w-[248px] shrink-0 border-r border-slate-200 bg-slate-50 py-4';
const SCOPE_EYEBROW =
  'px-5 pt-2 pb-3 text-[11px] font-bold uppercase tracking-[1px] text-slate-500';
const SCOPE_ROW_BASE =
  'flex w-full items-center gap-2.5 border-l-[3px] px-5 py-[11px] text-left text-body-sm ' +
  'transition-colors duration-150 ease-linear ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-blue';
const SETTING_ROW =
  'flex w-full items-center gap-4 border border-slate-200 bg-white px-5 py-4 text-left ' +
  'transition-colors duration-150 ease-linear hover:border-primary-blue hover:bg-slate-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue';

const scopeRowClass = (selected: boolean) =>
  cn(
    SCOPE_ROW_BASE,
    selected
      ? 'border-l-primary-blue bg-white font-bold text-midnight'
      : 'border-l-transparent text-slate-600 hover:bg-white/60',
  );

const ChevronRight: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="ml-auto shrink-0 text-slate-400"
    aria-hidden
  >
    <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const defaultRenderLink: RenderSuiteNavLink = ({ href, external, className, testId, children }) => (
  <a href={href} className={className} data-testid={testId} {...(external ? { rel: 'noreferrer' } : {})}>
    {children}
  </a>
);

function isExternalHref(href: string): boolean {
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
 * SettingsScopePage — the suite's settings chrome.
 *
 * The design shows one settings page for the whole suite. In a multi-origin
 * suite that becomes one page *per app* with the same scope column: the local
 * scope renders here, and every other scope is a link to that app's own settings
 * page. Pretending otherwise would mean rendering another origin's settings
 * behind this one's session, which is not something the suite can do or should.
 *
 * Pure presentation, like `SuiteNav`: no router, no i18n, no fetch. The app
 * supplies the scopes (built from the suite manifest, so a scope for an app that
 * is not installed cannot appear), the copy, and `renderLink`.
 */
export const SettingsScopePage: React.FC<SettingsScopePageProps> = ({
  scopes,
  activeScope,
  onSelectScope,
  title,
  intro,
  rows,
  children,
  renderLink = defaultRenderLink,
  labels,
  className,
}) => {
  const link = (
    args: { href: string; testId: string; className: string; active?: boolean },
    content: React.ReactNode,
  ) =>
    renderLink({
      href: args.href,
      external: isExternalHref(args.href),
      active: args.active ?? false,
      className: args.className,
      ariaCurrent: args.active ? 'page' : undefined,
      testId: args.testId,
      children: content,
    });

  const scopeContent = (scope: SettingsScope) => (
    <>
      {scope.icon ? (
        <span className="shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">{scope.icon}</span>
      ) : null}
      <span>{scope.label}</span>
    </>
  );

  const renderScope = (scope: SettingsScope) => {
    const selected = scope.key === activeScope;

    // An external scope is a navigation, not a tab: it leaves this origin, so it
    // has to be a real link that middle-click and "open in new tab" understand.
    if (!scope.local) {
      if (!scope.href) return null;
      return (
        <li key={scope.key}>
          {link(
            {
              href: scope.href,
              testId: `settings-scope-${scope.key}`,
              className: scopeRowClass(false),
            },
            scopeContent(scope),
          )}
        </li>
      );
    }

    return (
      <li key={scope.key}>
        <button
          type="button"
          onClick={() => onSelectScope?.(scope.key)}
          aria-current={selected ? 'page' : undefined}
          className={scopeRowClass(selected)}
          data-testid={`settings-scope-${scope.key}`}
        >
          {scopeContent(scope)}
        </button>
      </li>
    );
  };

  const rowContent = (row: SettingRowItem) => (
    <>
      {row.icon ? (
        <span className="shrink-0 text-primary-blue [&>svg]:h-5 [&>svg]:w-5">{row.icon}</span>
      ) : null}
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-bold text-midnight">{row.label}</span>
        {row.description ? (
          <span className="text-body-sm leading-[1.5] text-slate-600">{row.description}</span>
        ) : null}
      </span>
      <ChevronRight />
    </>
  );

  const renderRow = (row: SettingRowItem) => {
    if (row.href) {
      return (
        <li key={row.key}>
          {link(
            { href: row.href, testId: `settings-row-${row.key}`, className: SETTING_ROW },
            rowContent(row),
          )}
        </li>
      );
    }
    return (
      <li key={row.key}>
        <button
          type="button"
          onClick={row.onSelect}
          className={SETTING_ROW}
          data-testid={`settings-row-${row.key}`}
        >
          {rowContent(row)}
        </button>
      </li>
    );
  };

  return (
    <div className={cn('flex min-h-full items-stretch bg-white font-sans', className)}>
      <nav aria-label={labels?.scope ?? 'Scope'} className={SCOPE_COLUMN}>
        <p className={SCOPE_EYEBROW}>{labels?.scope ?? 'Scope'}</p>
        <ul>{scopes.map(renderScope)}</ul>
      </nav>

      <div className="flex-1 p-8">
        <h1 className="text-[22px] font-bold text-midnight">{title}</h1>
        {intro ? (
          <p className="mt-2 max-w-[640px] text-[15px] leading-[1.6] text-slate-600">{intro}</p>
        ) : null}

        {rows && rows.length > 0 ? (
          <ul className="mt-6 flex max-w-[720px] flex-col gap-3">{rows.map(renderRow)}</ul>
        ) : null}

        {children}
      </div>
    </div>
  );
};

export default SettingsScopePage;
