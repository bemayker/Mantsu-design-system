import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';
import { Tag } from '../components/Tag';
import { Card, MetricCard } from '../components/Card';
import { OptionCard } from '../components/OptionCard';

const meta: Meta = { title: 'Components/Data Display', tags: ['autodocs'] };
export default meta;

export const Badges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge status="info" dot>Running</Badge>
      <Badge status="success" dot>Completed</Badge>
      <Badge status="warning" dot>Paused</Badge>
      <Badge status="error" dot>Failed</Badge>
      <Badge status="neutral">Draft</Badge>
    </div>
  ),
};
export const Tags: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag>Plant A</Tag>
      <Tag onRemove={() => {}}>Line 3</Tag>
      <Tag onRemove={() => {}}>Shift: Morning</Tag>
    </div>
  ),
};
export const Cards: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      <Card className="p-6 w-64"><p className="text-body text-midnight">Generic card surface.</p></Card>
      <MetricCard label="OEE" value="84%" delta="+2.1% vs last week" deltaDirection="up" />
      <MetricCard label="Downtime" value="3.2h" delta="+0.5h" deltaDirection="down" />
    </div>
  ),
};
export const OptionCards: StoryObj = {
  render: () => (
    <div className="flex gap-4 w-[640px]">
      <OptionCard title="Blank recipe" description="Start from scratch." selected />
      <OptionCard title="From template" description="Use an existing template." />
      <OptionCard title="Import" description="Upload a definition file." disabled />
    </div>
  ),
};
