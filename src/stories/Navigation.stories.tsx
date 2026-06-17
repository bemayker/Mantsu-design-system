import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../components/Tabs';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { TopNavBar } from '../components/TopNavBar';
import { Tree } from '../components/Tree';

const meta: Meta = { title: 'Components/Navigation', tags: ['autodocs'] };
export default meta;

export const TabsExample: StoryObj = {
  render: () => (
    <Tabs items={[
      { id: 'config', label: 'Configuration' },
      { id: 'exec', label: 'Execution' },
      { id: 'report', label: 'Reporting' },
      { id: 'archive', label: 'Archive', disabled: true },
    ]} defaultValue="config" />
  ),
};
export const BreadcrumbsExample: StoryObj = {
  render: () => (
    <Breadcrumbs items={[
      { label: 'Plant A', href: '#' },
      { label: 'Lines', href: '#' },
      { label: 'Line 3' },
    ]} />
  ),
};
export const SidebarExample: StoryObj = {
  render: () => (
    <div className="h-[420px]">
      <Sidebar
        header={<span className="text-h4 text-white">Mantsu</span>}
        items={[
          { id: 'dash', label: 'Dashboard' },
          { id: 'recipes', label: 'Recipes' },
          { id: 'templates', label: 'Templates' },
        ]}
        activeId="recipes"
      />
    </div>
  ),
};
export const TopNavBarExample: StoryObj = {
  render: () => (
    <TopNavBar title="Production Orders"
      right={<span className="h-9 w-9 rounded-full bg-frost" />} />
  ),
};
export const TreeExample: StoryObj = {
  render: () => (
    <div className="w-72">
      <Tree
        defaultExpanded={['site', 'b1']}
        selectedId="z1"
        nodes={[{
          id: 'site', label: 'Site Bruges',
          children: [{
            id: 'b1', label: 'Building 1',
            children: [
              { id: 'z1', label: 'Zone A' },
              { id: 'z2', label: 'Zone B' },
            ],
          }],
        }]}
      />
    </div>
  ),
};
