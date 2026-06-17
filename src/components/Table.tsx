import React from 'react';
import { cn } from './cn';

/** Table — data table with optional empty state. */
export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
}
export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: React.ReactNode;
  className?: string;
}
export function Table<T extends Record<string, any>>({
  columns, data, emptyState, className,
}: TableProps<T>) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-200 bg-white', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-frost">
            {columns.map((c) => (
              <th
                key={String(c.key)}
                className={cn(
                  'px-4 py-3 text-body-sm-emphasis text-slate-600 border-b border-slate-200',
                  c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                {emptyState ?? <span className="text-body text-slate-500">No data</span>}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className={cn(
                      'px-4 py-3 text-body text-midnight border-b border-slate-200',
                      c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'
                    )}
                  >
                    {c.render ? c.render(row) : String(row[c.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
