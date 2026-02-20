'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    label: string;
    value: string | number;
    delta?: number;
    unit?: string;
    icon?: React.ReactNode;
    description?: string;
    pulse?: boolean;
    className?: string;
}

export function MetricCard({
    label,
    value,
    delta,
    unit,
    icon,
    description,
    pulse = false,
    className,
}: MetricCardProps) {
    const [animating, setAnimating] = useState(false);
    const prevValue = useRef(value);

    useEffect(() => {
        if (prevValue.current !== value) {
            setAnimating(true);
            const t = setTimeout(() => setAnimating(false), 400);
            prevValue.current = value;
            return () => clearTimeout(t);
        }
    }, [value]);

    const deltaColor =
        delta === undefined ? ''
            : delta > 0 ? 'text-red-400'
                : delta < 0 ? 'text-emerald-400'
                    : 'text-nk-muted';

    const DeltaIcon =
        delta === undefined ? null
            : delta > 0 ? TrendingUp
                : delta < 0 ? TrendingDown
                    : Minus;

    return (
        <article
            aria-label={`${label}: ${value}${unit ?? ''}`}
            className={cn(
                'glass-card p-4 flex flex-col gap-2 group cursor-default',
                'hover:border-nk-accent/30 transition-all duration-300',
                pulse && 'animate-glow-pulse',
                animating && 'animate-metric-pulse',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-nk-muted uppercase tracking-wider">
                    {label}
                </span>
                {icon && (
                    <span className="text-nk-accent/60 group-hover:text-nk-accent transition-colors">
                        {icon}
                    </span>
                )}
            </div>

            <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-nk-text tabular-nums">
                    {value}
                </span>
                {unit && (
                    <span className="text-sm text-nk-muted mb-0.5">{unit}</span>
                )}
            </div>

            {(delta !== undefined || description) && (
                <div className="flex items-center gap-1">
                    {DeltaIcon && delta !== undefined && (
                        <>
                            <DeltaIcon size={12} className={deltaColor} />
                            <span className={cn('text-xs font-medium', deltaColor)}>
                                {delta > 0 ? '+' : ''}{delta}
                            </span>
                            <span className="text-xs text-nk-muted">vs last week</span>
                        </>
                    )}
                    {description && !DeltaIcon && (
                        <span className="text-xs text-nk-muted">{description}</span>
                    )}
                </div>
            )}
        </article>
    );
}
