'use client';

import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/lib/mock-data';

interface RiskBadgeProps {
    level: RiskLevel;
    score?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LABELS: Record<RiskLevel, string> = {
    low: 'LOW',
    medium: 'MED',
    high: 'HIGH',
};

const CLASSES: Record<RiskLevel, string> = {
    low: 'risk-low',
    medium: 'risk-medium',
    high: 'risk-high',
};

const SIZE_CLASSES = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
};

export function RiskBadge({ level, score, size = 'md', className }: RiskBadgeProps) {
    return (
        <span
            role="status"
            aria-label={`Risk level: ${level}${score !== undefined ? ` (${score}/100)` : ''}`}
            className={cn(
                'inline-flex items-center gap-1 rounded-full font-mono font-semibold',
                CLASSES[level],
                SIZE_CLASSES[size],
                className
            )}
        >
            <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{
                    background: level === 'high' ? '#ef4444'
                        : level === 'medium' ? '#f59e0b'
                            : '#22c55e',
                }}
            />
            {LABELS[level]}
            {score !== undefined && (
                <span className="ml-0.5 opacity-70">{score}</span>
            )}
        </span>
    );
}
