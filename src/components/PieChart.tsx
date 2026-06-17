import React from 'react';
import { cn } from './cn';

/**
 * PieChart — lightweight SVG donut for dashboard cards.
 * For production charting the app may swap in a library; this matches the
 * design-system card styling and palette.
 */
export interface PieSlice { label: string; value: number; color: string; }
export interface PieChartProps {
  data: PieSlice[];
  size?: number;
  thickness?: number;
  className?: string;
}
export const PieChart: React.FC<PieChartProps> = ({ data, size = 160, thickness = 28, className }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className={cn('flex items-center gap-6', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const seg = (
              <circle
                key={i}
                cx={size / 2} cy={size / 2} r={r}
                fill="none" stroke={d.color} strokeWidth={thickness}
                strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
              />
            );
            offset += len;
            return seg;
          })}
        </g>
      </svg>
      <ul className="space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2 text-body-sm text-midnight">
            <span className="h-3 w-3 rounded-sm" style={{ background: d.color }} />
            {d.label}
            <span className="text-slate-500">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default PieChart;
