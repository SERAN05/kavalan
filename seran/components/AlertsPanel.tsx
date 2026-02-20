'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, ArrowUp, X } from 'lucide-react';
import { Alert, MOCK_ALERTS, RiskLevel } from '@/lib/mock-data';
import { RiskBadge } from './RiskBadge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

function SlaTimer({ deadline, slaHours }: { deadline: string; slaHours: number }) {
    const [remaining, setRemaining] = useState('');
    const [pct, setPct] = useState(100);
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        const update = () => {
            const now = Date.now();
            const end = new Date(deadline).getTime();
            const total = slaHours * 3600 * 1000;
            const diff = end - now;
            const ratio = Math.max(0, diff / total);
            setPct(Math.round(ratio * 100));
            setWarning(diff < 3600 * 1000 && diff > 0);

            if (diff <= 0) {
                setRemaining('OVERDUE');
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setRemaining(h > 0 ? `${h}h ${m}m` : `${m}m`);
        };
        update();
        const id = setInterval(update, 30000);
        return () => clearInterval(id);
    }, [deadline, slaHours]);

    const barColor = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444';

    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1 text-[10px] text-nk-muted">
                    <Clock size={10} />
                    SLA ({slaHours}h)
                </span>
                <span className={cn(
                    'text-[10px] font-mono font-semibold',
                    warning ? 'text-red-400 sla-warning' : 'text-nk-muted'
                )}>
                    {remaining}
                </span>
            </div>
            <div className="h-1 rounded-full bg-nk-border overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: barColor }}
                />
            </div>
        </div>
    );
}

interface AlertsPanelProps {
    compact?: boolean;
}

export function AlertsPanel({ compact = false }: AlertsPanelProps) {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [acking, setAcking] = useState<string | null>(null);

    const handleAck = async (alertId: string) => {
        setAcking(alertId);
        try {
            const res = await fetch('/api/alerts/ack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alertId, userId: user?.id }),
            });
            if (res.ok) {
                setAlerts(prev =>
                    prev.map(a =>
                        a.id === alertId
                            ? { ...a, acknowledged: true, acknowledgedBy: user?.name }
                            : a
                    )
                );
            }
        } finally {
            setAcking(null);
        }
    };

    const handleEscalate = (alertId: string) => {
        setAlerts(prev =>
            prev.map(a => (a.id === alertId ? { ...a, escalated: true } : a))
        );
    };

    const sortedAlerts = [...alerts].sort((a, b) => {
        if (!a.acknowledged && b.acknowledged) return -1;
        if (a.acknowledged && !b.acknowledged) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const displayAlerts = compact ? sortedAlerts.slice(0, 4) : sortedAlerts;

    return (
        <section aria-label="Alerts panel" className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-nk-text flex items-center gap-2">
                    <Bell size={14} className="text-nk-accent" />
                    Active Alerts
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400
                           border border-red-500/30 font-mono">
                        {alerts.filter(a => !a.acknowledged).length}
                    </span>
                </h2>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1">
                {displayAlerts.map((alert, i) => (
                    <div
                        key={alert.id}
                        className={cn(
                            'glass-card p-3 rounded-xl transition-all duration-300',
                            `stagger-${Math.min(i + 1, 6)}`,
                            alert.acknowledged && 'opacity-50'
                        )}
                    >
                        <div className="flex items-start gap-2">
                            <AlertTriangle
                                size={14}
                                className={cn(
                                    'mt-0.5 shrink-0',
                                    alert.severity === 'high' ? 'text-red-400'
                                        : alert.severity === 'medium' ? 'text-amber-400'
                                            : 'text-emerald-400'
                                )}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-xs font-semibold text-nk-text">
                                        {alert.type}
                                    </span>
                                    <RiskBadge level={alert.severity as RiskLevel} size="sm" />
                                    {alert.escalated && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full
                                     bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                            ESCALATED
                                        </span>
                                    )}
                                    {alert.acknowledged && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full
                                     bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            ACKNOWLEDGED
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-nk-muted line-clamp-2">{alert.message}</p>
                                <p className="text-[10px] text-nk-muted/60 mt-1">{alert.wardName}</p>

                                {!alert.acknowledged && (
                                    <SlaTimer deadline={alert.slaDeadline} slaHours={alert.slaHours} />
                                )}

                                {alert.acknowledgedBy && (
                                    <p className="text-[10px] text-nk-muted/60 mt-1">
                                        Ack by: {alert.acknowledgedBy}
                                    </p>
                                )}

                                {!alert.acknowledged && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleAck(alert.id)}
                                            disabled={acking === alert.id}
                                            aria-label={`Acknowledge alert: ${alert.type}`}
                                            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md
                                 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30
                                 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                        >
                                            <CheckCircle size={10} />
                                            {acking === alert.id ? 'Acking...' : 'Acknowledge'}
                                        </button>
                                        {!alert.escalated && user?.role === 'admin' && (
                                            <button
                                                onClick={() => handleEscalate(alert.id)}
                                                aria-label={`Escalate alert: ${alert.type}`}
                                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md
                                   bg-purple-500/10 text-purple-400 border border-purple-500/30
                                   hover:bg-purple-500/20 transition-colors"
                                            >
                                                <ArrowUp size={10} />
                                                Escalate
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {displayAlerts.length === 0 && (
                    <div className="text-center py-8 text-nk-muted text-sm">
                        <CheckCircle size={28} className="mx-auto mb-2 text-emerald-400/50" />
                        No active alerts
                    </div>
                )}
            </div>
        </section>
    );
}
