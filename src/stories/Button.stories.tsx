import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'outline', 'link', 'gradient'] },
    size: { control: 'select', options: ['sm', 'default', 'lg'] },
  },
};
export default meta;
type S = StoryObj<typeof Button>;

export const Default: S = { args: { variant: 'default' } };
export const Secondary: S = { args: { variant: 'secondary' } };
export const Outline: S = { args: { variant: 'outline' } };
export const Link: S = { args: { variant: 'link' } };
export const Gradient: S = { args: { variant: 'gradient', children: 'New' } };
export const Disabled: S = { args: { disabled: true } };
export const Sizes: S = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
export const IconOnly: S = { args: { iconOnly: true, variant: 'outline', children: '+' } };
