import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SuiteNav } from '../components/SuiteNav';
import type { SuiteManifest, SuiteNavItem } from '../components/SuiteNav';
import { ModuleCockpit, ModuleDowntimes, ModuleLists, ModuleReporting } from '../components/icons';

/**
 * Core has no mark of its own yet, so the handoff uses a Lucide `boxes`
 * stand-in. `lucide-react` is not a dependency of this package, so the stories
 * inline the one glyph they need, exactly as a consuming app supplies its own.
 */
const CoreIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
    <path d="m7 16.5-4.74-2.85M7 16.5l5-3M7 16.5v5.17" />
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
    <path d="m17 16.5-5-3m5 3 4.74-2.85M17 16.5v5.17" />
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
    <path d="M12 8 7.26 5.15M12 8l4.74-2.85M12 8v5.5" />
  </svg>
);

const icons = {
  core: <CoreIcon />,
  cockpit: <ModuleCockpit />,
  downtimes: <ModuleDowntimes />,
  lists: <ModuleLists />,
  reporting: <ModuleReporting />,
};

const MantsuLogo: React.FC = () => (
  <div className="flex h-12 items-center gap-2">
    <span className="h-8 w-8 shrink-0 bg-primary-gradient" />
    <span className="text-h3 text-white">MANTSU</span>
  </div>
);

const fullLandscape: SuiteManifest = {
  schemaVersion: 1,
  self: 'downtimes',
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

const downtimesItems: SuiteNavItem[] = [
  { key: 'records', label: 'Downtimes', href: '/downtimes' },
  { key: 'report', label: 'Report', href: '/downtime-report' },
  { key: 'equipment', label: 'Equipment dashboard', href: '/equipment-status' },
  { key: 'reasons', label: 'Downtime reason tree', href: '/downtime-reasons', group: 'configuration' },
  { key: 'assignment', label: 'Reason tree assignment', href: '/reasoncode-assignment', group: 'configuration' },
];

/** Order cockpit after the decisions of 2026-09-12: ten sub-items, no Dashboard. */
const cockpitItems: SuiteNavItem[] = [
  { key: 'cockpit', label: 'Order cockpit', href: '/cockpit' },
  { key: 'overview', label: 'Order overview', href: '/production-orders' },
  { key: 'confirmations', label: 'Confirmations', href: '/confirmations' },
  { key: 'calendar', label: 'Calendar', href: '/calendar' },
  { key: 'progress', label: 'Production progress', href: '/production-progress' },
  { key: 'scrap', label: 'Scrap', href: '/scrap' },
  { key: 'runs', label: 'Production runs', href: '/production-runs' },
  { key: 'uptime', label: 'Uptime per shift', href: '/uptime-per-shift' },
  { key: 'scrap-tree', label: 'Scrap reason tree', href: '/scrap-reasons', group: 'configuration' },
  { key: 'assignment', label: 'Reason tree assignment', href: '/reason-assignment', group: 'configuration' },
];

/** Every story renders against the navy the rail is designed on. */
const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-[760px] items-stretch bg-white font-sans">{children}</div>
);

/** Toggling is the app's state, so the stories hold it the way an app would. */
const Interactive: React.FC<React.ComponentProps<typeof SuiteNav>> = (props) => {
  const [openApps, setOpenApps] = useState<Record<string, boolean>>(props.openApps ?? {});
  return (
    <Frame>
      <SuiteNav
        {...props}
        openApps={openApps}
        onToggleApp={(key) => setOpenApps((prev) => ({ ...prev, [key]: !prev[key] }))}
      />
    </Frame>
  );
};

const meta: Meta<typeof SuiteNav> = {
  title: 'Navigation/SuiteNav',
  component: SuiteNav,
  parameters: { layout: 'fullscreen', backgrounds: { default: 'white' } },
  args: {
    manifest: fullLandscape,
    ownItems: downtimesItems,
    icons,
    logo: <MantsuLogo />,
    onLogoClick: () => {},
    settingsHref: '/settings/downtimes',
    activeKey: 'records',
  },
  render: (args) => <Interactive {...args} />,
};
export default meta;

type Story = StoryObj<typeof SuiteNav>;

/**
 * The whole landscape, served by Downtimes. The other four apps carry no `nav`
 * yet, so in phase 1 each is a single row linking to its origin.
 */
export const FullLandscape: Story = {};

/**
 * The active app row takes the deeper navy and the accent bar; the active item
 * takes the blue and the same bar.
 */
export const ActiveAppAndItem: Story = {
  args: { activeKey: 'report' },
};

/**
 * Configuration is a subtitle, not a route: no click target, no hover, not
 * focusable, and not in the accessibility tree.
 */
export const ConfigurationSubtitle: Story = {
  args: { activeKey: 'reasons' },
};

/**
 * Core's pending-access count moved out of the rail and onto Settings when
 * Users became Settings › Suite › Users & access.
 */
export const WithBadges: Story = {
  args: {
    settingsBadge: 4,
    ownItems: downtimesItems.map((item) =>
      item.key === 'report' ? { ...item, badge: 12 } : item,
    ),
  },
};

/**
 * Core could not be reached, or is not installed at all. Same payload either
 * way: no Dashboard, no other apps, and this app fully usable. The rail carries
 * `data-suite-source="fallback"` for E2E.
 */
export const FallbackWithoutCore: Story = {
  args: {
    manifest: {
      schemaVersion: 1,
      self: 'downtimes',
      source: 'fallback',
      apps: [
        {
          key: 'downtimes',
          name: 'Downtimes',
          icon: 'downtimes',
          url: 'http://downtimes.10.10.10.4.nip.io',
          order: 0,
        },
      ],
    },
  },
};

/** Larger hit areas for a terminal or a tablet on the shop floor. */
export const TouchDensity: Story = {
  args: { density: 'touch' },
};

/**
 * Order cockpit has ten sub-items after the decisions of 2026-09-12. The rail
 * scrolls; it does not collapse or truncate the list.
 */
export const TenSubItems: Story = {
  args: {
    manifest: { ...fullLandscape, self: 'cockpit' },
    ownItems: cockpitItems,
    activeKey: 'cockpit',
    settingsHref: '/settings/cockpit',
  },
};

/**
 * Labels never wrap. A label longer than the 239px rail is clipped, which keeps
 * every row exactly one line high.
 */
export const LongLabels: Story = {
  args: {
    ownItems: [
      { key: 'records', label: 'Downtimes', href: '/downtimes' },
      {
        key: 'long',
        label: 'Equipment availability and downtime analysis per production line',
        href: '/long',
      },
      {
        key: 'long-config',
        label: 'Downtime reason tree assignment per equipment class',
        href: '/long-config',
        group: 'configuration',
      },
    ],
  },
};

/**
 * Phase 2. Once each backend publishes its own nav, the other apps' items appear
 * in the rail too, and the app rows become disclosures instead of links.
 */
export const PhaseTwoWithOtherAppItems: Story = {
  args: {
    openApps: { cockpit: true },
    manifest: {
      ...fullLandscape,
      apps: fullLandscape.apps.map((app) =>
        app.key === 'cockpit'
          ? {
              ...app,
              nav: cockpitItems.map((item) => ({
                key: item.key,
                label: { en: item.label, nl: item.label },
                path: item.href,
                group: item.group ?? null,
              })),
            }
          : app,
      ),
    },
  },
};

/**
 * A manifest from a newer major than this component implements. The rail shows
 * this app's own items and Settings, and says nothing about a landscape it
 * cannot read. Never an empty menu.
 */
export const UnsupportedSchemaVersion: Story = {
  args: {
    manifest: { ...fullLandscape, schemaVersion: 2 },
    onUnsupportedSchema: (received, supported) =>
      console.warn(`[SuiteNav] manifest schemaVersion ${received}, this build implements ${supported}`),
  },
};
