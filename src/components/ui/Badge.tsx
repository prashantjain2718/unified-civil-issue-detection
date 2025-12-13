import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-slate-900 text-white hover:bg-slate-800',
      success: 'bg-emerald-500 text-white hover:bg-emerald-600',
      warning: 'bg-amber-500 text-white hover:bg-amber-600',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'text-slate-950 border border-slate-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
