'use client';

import { useState, useEffect } from 'react';
import { X, Activity, AlertTriangle, Radio, TrendingUp, TrendingDown } from 'lucide-react';
import { Ward, getRiskColor } from '@/lib/mock-data';
import { RiskBadge } from './RiskBadge';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface WardDetailModalProps {
    wardId: string | null;
    onClose: () => void;
}

export function WardDetailModal({ wardId, onClose }: WardDetailModalProps) {
    const [ward, setWard] = useState<Ward | null>(null);
    const [loading, setLoading] = useState(false);
    const { colorBlindMode } = useTheme();

    useEffect(() => {
        if (!wardId) { setWard(null); return; }
        setLoading(true);
        fetch(`/api/ward/${wardId}`)
            .then(r => r.json())
            .then(data => setWard(data))
            .finally(() => setLoading(false));
    }, [wardId]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!wardId) return null;

    const deviceStatusColor = {
        online: 'text-emerald-400',
        offline: 'text-red-400',
        warning: 'text-amber-400',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Ward detail"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto
                      glass-card rounded-2xl shadow-2xl animate-slide-in-up">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl
                          bg-nk-bg/80 z-20">
                        <div className="w-8 h-8 border-2 border-nk-accent border-t-transparent
                            rounded-full animate-spin" />
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-nk-border">
                    <div>
                        <h2 className="text-lg font-semibold text-nk-text">
                            {ward?.name ?? 'Loading...'}
                        </h2>
                        {ward && (
                            <div className="flex items-center gap-2 mt-1">
                                <RiskBadge level={ward.riskLevel} score={ward.riskScore} />
                                <span className="text-xs text-nk-muted">
                                    Pop: {ward.population.toLocaleString()}
                                </span>
                                <span className="text-xs text-nk-muted">
                                    Cases: {ward.activeCases}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 rounded-lg hover:bg-white/5 text-nk-muted hover:text-nk-text
                       transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {ward && (
                    <div className="p-5 space-y-5">
                        {/* Historical Chart */}
                        <section>
                            <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                <TrendingUp size={14} className="text-nk-accent" />
                                6-Week Risk History
                            </h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ward.history} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                                        <defs>
                                            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={getRiskColor(ward.riskLevel, colorBlindMode)} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={getRiskColor(ward.riskLevel, colorBlindMode)} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,115,153,0.15)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7399' }} tickFormatter={d => d.slice(5)} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7399' }} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#050D30',
                                                border: '1px solid #1a2456',
                                                borderRadius: 8,
                                                fontSize: 11,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="riskScore"
                                            stroke={getRiskColor(ward.riskLevel, colorBlindMode)}
                                            fill="url(#riskGrad)"
                                            strokeWidth={2}
                                            dot={{ r: 3, fill: getRiskColor(ward.riskLevel, colorBlindMode) }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Risk Drivers */}
                        <section>
                            <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                <Activity size={14} className="text-nk-accent" />
                                Risk Drivers
                            </h3>
                            <div className="space-y-2">
                                {ward.drivers.map(driver => (
                                    <div key={driver.label} className="flex items-center gap-3">
                                        <span className="text-xs text-nk-muted w-24 shrink-0">{driver.label}</span>
                                        <div className="flex-1 h-1.5 bg-nk-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(100, (driver.value / 10) * 100)}%`,
                                                    background: driver.impact === 'positive' ? '#22c55e'
                                                        : driver.impact === 'negative' ? '#ef4444'
                                                            : '#f59e0b',
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-mono text-nk-text w-20 text-right">
                                            {driver.value} {driver.unit}
                                        </span>
                                        {driver.impact === 'positive'
                                            ? <TrendingDown size={12} className="text-emerald-400 shrink-0" />
                                            : driver.impact === 'negative'
                                                ? <TrendingUp size={12} className="text-red-400 shrink-0" />
                                                : <span className="w-3" />
                                        }
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Device Telemetry */}
                        <section>
                            <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                <Radio size={14} className="text-nk-accent" />
                                Device Telemetry
                                <span className={`text-[10px] ml-auto ${deviceStatusColor[ward.telemetry.deviceStatus]}`}>
                                    ● {ward.telemetry.deviceStatus.toUpperCase()}
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'pH Level', value: ward.telemetry.phLevel, unit: '' },
                                    { label: 'Turbidity', value: ward.telemetry.turbidity, unit: 'NTU' },
                                    { label: 'Chlorine', value: ward.telemetry.chlorine, unit: 'mg/L' },
                                    { label: 'Temperature', value: ward.telemetry.temperature, unit: '°C' },
                                ].map(item => (
                                    <div key={item.label}
                                        className="glass-card p-3 rounded-xl text-center">
                                        <p className="text-[10px] text-nk-muted mb-1">{item.label}</p>
                                        <p className="text-base font-bold font-mono text-nk-text">
                                            {item.value}{item.unit}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recent Ward Alerts */}
                        {ward.alerts.length > 0 && (
                            <section>
                                <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-amber-400" />
                                    Recent Alerts
                                </h3>
                                <div className="space-y-2">
                                    {ward.alerts.map(alert => (
                                        <div key={alert.id}
                                            className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/5
                                    border border-amber-500/20">
                                            <RiskBadge level={alert.severity} size="sm" />
                                            <div>
                                                <p className="text-xs font-medium text-nk-text">{alert.type}</p>
                                                <p className="text-[10px] text-nk-muted">{alert.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
