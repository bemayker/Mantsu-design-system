import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../components/Table';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';

const meta: Meta = { title: 'Components/Table', tags: ['autodocs'] };
export default meta;

type Order = { id: string; name: string; status: string; qty: number };
const rows: Order[] = [
  { id: 'PO-1001', name: 'Batch Alpha', status: 'Running', qty: 120 },
  { id: 'PO-1002', name: 'Batch Beta', status: 'Completed', qty: 80 },
  { id: 'PO-1003', name: 'Batch Gamma', status: 'Paused', qty: 200 },
];
const statusColor = (s: string) =>
  s === 'Running' ? 'info' : s === 'Completed' ? 'success' : 'warning';

export const WithData: StoryObj = {
  render: () => (
    <Table<Order>
      columns={[
        { key: 'id', header: 'Order' },
        { key: 'name', header: 'Name' },
        { key: 'status', header: 'Status', render: (r) => <Badge status={statusColor(r.status) as any} dot>{r.status}</Badge> },
        { key: 'qty', header: 'Qty', align: 'right' },
      ]}
      data={rows}
    />
  ),
};
export const Empty: StoryObj = {
  render: () => (
    <Table<Order>
      columns={[{ key: 'id', header: 'Order' }, { key: 'name', header: 'Name' }]}
      data={[]}
      emptyState={<EmptyState title="No production orders" description="Create your first order to get started." />}
    />
  ),
};
