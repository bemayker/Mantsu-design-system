import React from 'react';
import { cn } from './cn';

/** GaugeChart — semicircular gauge card for a single KPI (0..100). */
export interface GaugeChartProps {
  value: number;
  label?: string;
  size?: number;
  color?: string;
  className?: string;
}
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value, label, size = 180, color = '#155799', className,
}) => {
  const pct = Math.max(0, Math.min(100, value));
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const semi = Math.PI * r;
  const dash = (pct / 100) * semi;
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`} role="img">
        <path d={`M 14 ${cy} A ${r} ${r} 0 0 1 ${size - 14} ${cy}`} fill="none" stroke="#e2e8f0" strokeWidth={14} strokeLinecap="round" />
        <path d={`M 14 ${cy} A ${r} ${r} 0 0 1 ${size - 14} ${cy}`} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${dash} ${semi}`} />
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-midnight" style={{ fontSize: 28, fontWeight: 700 }}>{pct}%</text>
      </svg>
      {label && <span className="text-body-sm text-slate-500 -mt-1">{label}</span>}
    </div>
  );
};
export default GaugeChart;
