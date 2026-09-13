import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SettingsScopePage, scopesFromManifest } from '../components/SettingsScopePage';
import type { SettingRowItem } from '../components/SettingsScopePage';
import type { SuiteManifest } from '../components/SuiteNav';

/**
 * The handoff's icons are Lucide, which is deliberately not a dependency of this
 * package. The stories inline the few glyphs they need, exactly as a consuming
 * app supplies its own.
 */
const Glyph: React.FC<{ d: string; size?: number }> = ({ d, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const icons = {
  suite: <Glyph d="m12 2 9 5-9 5-9-5 9-5Zm9 10-9 5-9-5m18 5-9 5-9-5" />,
  core: <Glyph d="M3 7h7V3H3v4Zm11 0h7V3h-7v4ZM3 21h7v-4H3v4Zm11 0h7v-4h-7v4Z" />,
  cockpit: <Glyph d="M12 21a9 9 0 1 0-9-9m9 9a9 9 0 0 0 9-9M12 12l4-4" />,
  downtimes: <Glyph d="M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  lists: <Glyph d="M8 6h11M8 12h11M8 18h11M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
};

const rowIcon = {
  server: <Glyph d="M4 5h16v5H4V5Zm0 9h16v5H4v-5Zm3.5-6.5h.01M7.5 16.5h.01" size={20} />,
  radio: <Glyph d="M5 8a9 9 0 0 1 14 0M8 11a5 5 0 0 1 8 0m-4 3v5" size={20} />,
  list: <Glyph d="M8 6h11M8 12h11M8 18h11M3.5 6h.01M3.5 12h.01M3.5 18h.01" size={20} />,
  key: <Glyph d="M14 8a4 4 0 1 1-3.9 5H7v3H4v-3l6.1-.001A4 4 0 0 1 14 8Z" size={20} />,
  users: <Glyph d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 6.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 19v-1a4 4 0 0 0-3-3.87" size={20} />,
  bell: <Glyph d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0" size={20} />,
};

const fullLandscape: SuiteManifest = {
  schemaVersion: 1,
  self: 'core',
  source: 'core',
  suite: {
    dashboardUrl: 'http://core.10.10.10.4.nip.io/',
    settingsUrl: 'http://core.10.10.10.4.nip.io/settings/suite',
  },
  apps: [
    { key: 'core', name: 'Core', icon: 'core', url: 'http://core.10.10.10.4.nip.io', order: 10 },
    { key: 'cockpit', name: 'Order cockpit', icon: 'cockpit', url: 'http://cockpit.10.10.10.4.nip.io', order: 20 },
    { key: 'downtimes', name: 'Downtimes', icon: 'downtimes', url: 'http://downtimes.10.10.10.4.nip.io', order: 30 },
    { key: 'lists', name: 'Lists', icon: 'lists', url: 'http://lists.10.10.10.4.nip.io', order: 40 },
    { key: 'reporting', name: 'Ask Mantsu', icon: 'reporting', url: 'http://ask.10.10.10.4.nip.io', order: 50 },
  ],
};

/** Copy is verbatim from the handoff. In an app it comes from i18n. */
const CONTENT: Record<string, { title: string; intro: string; rows: SettingRowItem[] }> = {
  suite: {
    title: 'Suite-instellingen',
    intro: 'Geldt voor elke module. Eén keer instellen, overal actief.',
    rows: [
      {
        key: 'users',
        label: 'Users & access',
        description: 'Rollen per module en per plant, single sign-on, audit trail.',
        icon: rowIcon.users,
        href: '/settings/suite/users',
      },
      {
        key: 'notifications',
        label: 'Notifications',
        description: 'Wie krijgt welke melding, en via welk kanaal.',
        icon: rowIcon.bell,
        href: '/settings/suite/notifications',
      },
    ],
  },
  core: {
    title: 'Core',
    intro: 'De technische instellingen waar de rest van de suite op loopt.',
    rows: [
      {
        key: 'redpanda',
        label: 'RedPanda',
        description: 'Cluster, topics en credentials van de RedPanda-broker waar de modules op publiceren.',
        icon: rowIcon.server,
        href: '/settings/core/redpanda',
      },
      {
        key: 'mqtt',
        label: 'MQTT broker',
        description: 'Broker-adres, client-ID en de topics die naar RedPanda doorlopen.',
        icon: rowIcon.radio,
        href: '/settings/core/mqtt',
      },
      {
        key: 'batch-statuses',
        label: 'Batch statuses',
        description: 'De statussen die een batch doorloopt en wie ze mag zetten.',
        icon: rowIcon.list,
        href: '/settings/core/batch-statuses',
      },
      {
        key: 'api-keys',
        label: 'API keys & webhooks',
        description: 'Technische toegang voor ERP en externe systemen.',
        icon: rowIcon.key,
        href: '/settings/core/api-keys',
      },
    ],
  },
  downtimes: {
    title: 'Downtimes',
    intro: 'De redenenboom staat in de module zelf, onder Configuration.',
    rows: [
      {
        key: 'redpanda',
        label: 'RedPanda',
        description: 'Topics waarop stops en statuswissels gepubliceerd worden.',
        icon: rowIcon.server,
        href: '/settings/downtimes/redpanda',
      },
      {
        key: 'mqtt',
        label: 'MQTT broker',
        description: 'Signalen die een stop openen en sluiten, per equipment.',
        icon: rowIcon.radio,
        href: '/settings/downtimes/mqtt',
      },
    ],
  },
  lists: {
    title: 'Lists',
    intro: 'SOPs die op tablet of terminal uitgevoerd worden.',
    rows: [
      {
        key: 'answers',
        label: 'Answer templates',
        description: 'De antwoordtypes die een stap kan vragen, en hun standaardwaarden.',
        icon: rowIcon.list,
        href: '/settings/lists/answers',
      },
      {
        key: 'redpanda',
        label: 'RedPanda',
        description: 'Topics waarop uitgevoerde lijsten en antwoorden gepubliceerd worden.',
        icon: rowIcon.server,
        href: '/settings/lists/redpanda',
      },
    ],
  },
};

/** The local scope is app state, so the stories hold it the way an app would. */
const Interactive: React.FC<{ manifest: SuiteManifest; initialScope: string }> = ({
  manifest,
  initialScope,
}) => {
  const [scope, setScope] = useState(initialScope);
  const content = CONTENT[scope] ?? CONTENT[manifest.self];
  return (
    <div className="h-[720px] bg-white">
      <SettingsScopePage
        scopes={scopesFromManifest(manifest, { labels: { suite: 'Suite' }, icons })}
        activeScope={scope}
        onSelectScope={setScope}
        title={content.title}
        intro={content.intro}
        rows={content.rows}
      />
    </div>
  );
};

const meta: Meta<typeof SettingsScopePage> = {
  title: 'Navigation/SettingsScopePage',
  component: SettingsScopePage,
  parameters: { layout: 'fullscreen', backgrounds: { default: 'white' } },
};
export default meta;

type Story = StoryObj<typeof SettingsScopePage>;

/**
 * Core's settings page. Suite is local here, because Core owns `app_users` and
 * the role matrix; the three module scopes are links to their own apps.
 */
export const CoreContext: Story = {
  render: () => <Interactive manifest={fullLandscape} initialScope="core" />,
};

/** The same page with the suite-wide scope selected. Only reachable in Core. */
export const SuiteScopeInCore: Story = {
  render: () => <Interactive manifest={fullLandscape} initialScope="suite" />,
};

/**
 * Downtimes' settings page. Its own scope renders here; Suite and every other
 * module are links, because they live on another origin.
 */
export const DowntimesContext: Story = {
  render: () => (
    <Interactive manifest={{ ...fullLandscape, self: 'downtimes' }} initialScope="downtimes" />
  ),
};

/**
 * Lists installed without Core. No Suite scope, because the suite scope lives in
 * Core, and no other modules. The app is fully usable.
 */
export const StandaloneWithoutCore: Story = {
  render: () => (
    <Interactive
      manifest={{
        schemaVersion: 1,
        self: 'lists',
        source: 'fallback',
        apps: [
          { key: 'lists', name: 'Lists', icon: 'lists', url: 'http://lists.10.10.10.4.nip.io', order: 0 },
        ],
      }}
      initialScope="lists"
    />
  ),
};
