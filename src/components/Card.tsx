import React from 'react';
import { cn } from './cn';

/** Card — generic surface container. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const Card: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={cn('rounded-lg bg-white border border-slate-200 shadow-mantsu-sm', className)} {...props}>
    {children}
  </div>
);

/** MetricCard / Stat Card — KPI display used on dashboards. */
export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}
export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, delta, deltaDirection = 'neutral', icon, className,
}) => {
  const deltaColor =
    deltaDirection === 'up' ? 'text-success'
    : deltaDirection === 'down' ? 'text-error'
    : 'text-slate-500';
  return (
    <Card className={cn('p-5 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-slate-500">{label}</span>
        {icon && <span className="text-primary-blue">{icon}</span>}
      </div>
      <span className="text-h2 text-midnight">{value}</span>
      {delta && <span className={cn('text-body-sm-emphasis', deltaColor)}>{delta}</span>}
    </Card>
  );
};
export default Card;
