import type { Meta, StoryObj } from '@storybook/react';
import { PieChart } from '../components/PieChart';
import { GaugeChart } from '../components/GaugeChart';
import { ProgressBar } from '../components/ProgressBar';
import { Card } from '../components/Card';

const meta: Meta = { title: 'Components/Charts', tags: ['autodocs'] };
export default meta;

export const Pie: StoryObj = {
  render: () => (
    <Card className="p-6 w-fit">
      <PieChart data={[
        { label: 'Running', value: 62, color: '#155799' },
        { label: 'Idle', value: 24, color: '#94a3b8' },
        { label: 'Down', value: 14, color: '#f43f5e' },
      ]} />
    </Card>
  ),
};
export const Gauge: StoryObj = {
  render: () => (
    <Card className="p-6 w-fit">
      <GaugeChart value={84} label="OEE" />
    </Card>
  ),
};
export const Progress: StoryObj = {
  render: () => (
    <div className="w-80 flex flex-col gap-4">
      <ProgressBar value={32} showLabel />
      <ProgressBar value={76} showLabel />
      <ProgressBar value={100} showLabel />
    </div>
  ),
};
