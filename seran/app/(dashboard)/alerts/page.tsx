'use client';

import { useState } from 'react';
import { Bell, Plus, CheckCircle, ArrowUp, AlertTriangle, X } from 'lucide-react';
import { Alert, MOCK_ALERTS, MOCK_WARDS, RiskLevel } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

function CreateAlertForm({ onSubmit }: { onSubmit: (a: Alert) => void }) {
    const [wardId, setWardId] = useState('');
    const [type, setType] = useState('');
    const [severity, setSeverity] = useState<RiskLevel>('medium');
    const [message, setMessage] = useState('');
    const { user } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!wardId || !type || !message) return;
        const ward = MOCK_WARDS.find(w => w.id === wardId)!;
        const now = Date.now();
        const slaHours = severity === 'high' ? 2 : severity === 'medium' ? 4 : 8;
        onSubmit({
            id: `alert-${Date.now()}`,
            wardId,
            wardName: ward.name,
            type,
            severity,
            message,
            timestamp: new Date().toISOString(),
            slaHours,
            slaDeadline: new Date(now + slaHours * 3600 * 1000).toISOString(),
            acknowledged: false,
            deliveryStatus: 'sent',
            escalated: false,
        });
        setType(''); setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4" aria-label="Create alert form">
            <h3 className="text-sm font-semibold text-nk-text flex items-center gap-2">
                <Plus size={14} className="text-nk-accent" />
                Create New Alert
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-nk-muted block mb-1" htmlFor="alert-ward">Ward</label>
                    <select
                        id="alert-ward"
                        value={wardId}
                        onChange={e => setWardId(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg bg-nk-border/40 border border-nk-border
                       text-nk-text text-sm focus:ring-2 focus:ring-nk-accent/50
                       focus:border-nk-accent focus:outline-none"
                    >
                        <option value="">Select ward…</option>
                        {MOCK_WARDS.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-nk-muted block mb-1" htmlFor="alert-severity">Severity</label>
                    <select
                        id="alert-severity"
                        value={severity}
                        onChange={e => setSeverity(e.target.value as RiskLevel)}
                        className="w-full px-3 py-2 rounded-lg bg-nk-border/40 border border-nk-border
                       text-nk-text text-sm focus:ring-2 focus:ring-nk-accent/50
                       focus:border-nk-accent focus:outline-none"
                    >
                        <option value="low">Low (8h SLA)</option>
                        <option value="medium">Medium (4h SLA)</option>
                        <option value="high">High (2h SLA)</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="text-xs text-nk-muted block mb-1" htmlFor="alert-type">Alert Type</label>
                <input
                    id="alert-type"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    placeholder="e.g. Turbidity Spike, Outbreak Risk"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-nk-border/40 border border-nk-border
                     text-nk-text text-sm placeholder:text-nk-muted/50 focus:ring-2
                     focus:ring-nk-accent/50 focus:border-nk-accent focus:outline-none"
                />
            </div>
            <div>
                <label className="text-xs text-nk-muted block mb-1" htmlFor="alert-msg">Message</label>
                <textarea
                    id="alert-msg"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={2}
                    required
                    placeholder="Describe the alert condition and recommended action…"
                    className="w-full px-3 py-2 rounded-lg bg-nk-border/40 border border-nk-border
                     text-nk-text text-sm placeholder:text-nk-muted/50 focus:ring-2
                     focus:ring-nk-accent/50 focus:border-nk-accent focus:outline-none resize-none"
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-nk-accent text-white text-xs font-semibold
                   hover:bg-nk-accent-glow transition-all"
            >
                Create Alert
            </button>
        </form>
    );
}

export default function AlertsPage() {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [acking, setAcking] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'open' | 'acknowledged'>('all');

    const handleAck = async (alertId: string) => {
        setAcking(alertId);
        await fetch('/api/alerts/ack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alertId, userId: user?.id }),
        });
        setAlerts(prev =>
            prev.map(a => a.id === alertId
                ? { ...a, acknowledged: true, acknowledgedBy: user?.name }
                : a
            )
        );
        setAcking(null);
    };

    const handleEscalate = (alertId: string) => {
        setAlerts(prev =>
            prev.map(a => a.id === alertId ? { ...a, escalated: true } : a)
        );
    };

    const handleCreate = (newAlert: Alert) => {
        setAlerts(prev => [newAlert, ...prev]);
    };

    const filtered = alerts.filter(a =>
        filter === 'all' ? true
            : filter === 'open' ? !a.acknowledged
                : a.acknowledged
    );

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-nk-text">Alerts Management</h1>
                    <p className="text-xs text-nk-muted mt-0.5">
                        {alerts.filter(a => !a.acknowledged).length} open ·{' '}
                        {alerts.filter(a => a.acknowledged).length} resolved
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4">
                    {/* Filter tabs */}
                    <div className="flex gap-2" role="tablist" aria-label="Alert filter">
                        {(['all', 'open', 'acknowledged'] as const).map(f => (
                            <button
                                key={f}
                                role="tab"
                                aria-selected={filter === f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize',
                                    filter === f
                                        ? 'bg-nk-accent/15 border border-nk-accent/50 text-nk-accent'
                                        : 'border border-nk-border text-nk-muted hover:border-nk-accent/30'
                                )}
                            >
                                {f} ({
                                    f === 'all' ? alerts.length
                                        : f === 'open' ? alerts.filter(a => !a.acknowledged).length
                                            : alerts.filter(a => a.acknowledged).length
                                })
                            </button>
                        ))}
                    </div>

                    {/* Alerts list */}
                    <div className="space-y-3" role="list" aria-label="Alert list">
                        {filtered.map((alert, i) => (
                            <div
                                key={alert.id}
                                role="listitem"
                                className={cn(
                                    'glass-card p-4 rounded-xl stagger-' + Math.min(i + 1, 6),
                                    alert.acknowledged && 'opacity-60'
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle
                                        size={16}
                                        className={cn(
                                            'mt-0.5 shrink-0',
                                            alert.severity === 'high' ? 'text-red-400'
                                                : alert.severity === 'medium' ? 'text-amber-400'
                                                    : 'text-emerald-400'
                                        )}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-nk-text">{alert.type}</span>
                                            <RiskBadge level={alert.severity as RiskLevel} size="sm" />
                                            <span className="text-[10px] text-nk-muted">{alert.wardName}</span>
                                            {alert.escalated && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20
                                         text-purple-400 border border-purple-500/30">ESCALATED</span>
                                            )}
                                            {alert.acknowledged && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10
                                         text-emerald-400 border border-emerald-500/20">ACK'd</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-nk-muted">{alert.message}</p>
                                        <div className="flex items-center gap-4 mt-2 text-[10px] text-nk-muted/70">
                                            <span>SLA: {alert.slaHours}h</span>
                                            <span>Delivery: {alert.deliveryStatus}</span>
                                            {alert.acknowledgedBy && <span>By: {alert.acknowledgedBy}</span>}
                                        </div>

                                        {!alert.acknowledged && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleAck(alert.id)}
                                                    disabled={acking === alert.id}
                                                    aria-label={`Acknowledge ${alert.type}`}
                                                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                                     bg-emerald-500/10 text-emerald-400 border border-emerald-500/30
                                     hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                                                >
                                                    <CheckCircle size={12} />
                                                    {acking === alert.id ? 'Processing…' : 'Acknowledge'}
                                                </button>
                                                {user?.role === 'admin' && !alert.escalated && (
                                                    <button
                                                        onClick={() => handleEscalate(alert.id)}
                                                        aria-label={`Escalate ${alert.type}`}
                                                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                                       bg-purple-500/10 text-purple-400 border border-purple-500/30
                                       hover:bg-purple-500/20 transition-colors"
                                                    >
                                                        <ArrowUp size={12} />
                                                        Escalate
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-nk-muted">
                                <CheckCircle size={32} className="mx-auto mb-3 text-emerald-400/40" />
                                <p className="text-sm">No alerts in this view</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: create form */}
                <div>
                    <CreateAlertForm onSubmit={handleCreate} />
                </div>
            </div>
        </div>
    );
}
