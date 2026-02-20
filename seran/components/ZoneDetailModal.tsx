'use client';

import { useState, useEffect } from 'react';
import { X, Activity, Radio, TrendingUp, TrendingDown } from 'lucide-react';
import { COIMBATORE_ZONES, type CoimbatoreZone } from '@/lib/coimbatore-zones';
import { RiskBadge } from './RiskBadge';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ZoneDetailModalProps {
    zoneId: string | null;
    onClose: () => void;
}

function riskColor(score: number): string {
    return score >= 65 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#22c55e';
}

export function ZoneDetailModal({ zoneId, onClose }: ZoneDetailModalProps) {
    const [zone, setZone] = useState<CoimbatoreZone | null>(null);

    useEffect(() => {
        if (!zoneId) { setZone(null); return; }
        const z = COIMBATORE_ZONES.find(z => z.id === zoneId) ?? null;
        setZone(z);
    }, [zoneId]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    if (!zoneId) return null;

    const accent = zone ? riskColor(zone.riskScore) : '#295EC9';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog" aria-modal="true" aria-label="Zone detail">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto
                      glass-card rounded-2xl shadow-2xl animate-slide-in-up border border-white/5">

                {/* Glow border effect matching risk */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `0 0 40px ${accent}22, inset 0 0 40px ${accent}08` }} />

                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-nk-border">
                    <div>
                        <h2 className="text-lg font-semibold text-nk-text">{zone?.name}</h2>
                        {zone && (
                            <div className="flex items-center gap-2 mt-1">
                                <RiskBadge level={zone.riskLevel} score={zone.riskScore} />
                                <span className="text-xs text-nk-muted">{zone.key_area}</span>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} aria-label="Close modal"
                        className="p-2 rounded-lg hover:bg-white/5 text-nk-muted hover:text-nk-text transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {zone && (
                    <div className="p-5 space-y-5">
                        {/* KPI row */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Active Cases', value: zone.activeCases, color: accent },
                                { label: 'Population', value: zone.population.toLocaleString(), color: '#6B7399' },
                                { label: 'Risk Score', value: `${zone.riskScore}/100`, color: accent },
                            ].map(kpi => (
                                <div key={kpi.label} className="glass-card p-3 text-center rounded-xl">
                                    <p className="text-xs text-nk-muted mb-1">{kpi.label}</p>
                                    <p className="text-xl font-bold font-mono" style={{ color: kpi.color }}>
                                        {kpi.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* History chart */}
                        <section>
                            <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                <TrendingUp size={14} className="text-nk-accent" />
                                6-Week Risk History
                            </h3>
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={zone.history} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                                        <defs>
                                            <linearGradient id={`zoneGrad-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={accent} stopOpacity={0.35} />
                                                <stop offset="95%" stopColor={accent} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,115,153,0.12)" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7399' }} tickFormatter={d => d.slice(5)} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7399' }} />
                                        <Tooltip contentStyle={{ background: '#050D30', border: '1px solid #1a2456', borderRadius: 8, fontSize: 11 }} />
                                        <Area type="monotone" dataKey="riskScore"
                                            stroke={accent} fill={`url(#zoneGrad-${zone.id})`}
                                            strokeWidth={2.5} dot={{ r: 3, fill: accent }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* Water quality telemetry */}
                        <section>
                            <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                <Radio size={14} className="text-nk-accent" />
                                Water Quality Readings
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'pH Level', value: zone.ph, unit: '', warn: zone.ph < 6.5 || zone.ph > 8.5 },
                                    { label: 'Turbidity', value: zone.turbidity, unit: 'NTU', warn: zone.turbidity > 5 },
                                    { label: 'Chlorine', value: zone.chlorine, unit: 'mg/L', warn: zone.chlorine < 0.2 },
                                    { label: 'Temperature', value: zone.temp, unit: '°C', warn: zone.temp > 32 },
                                ].map(item => (
                                    <div key={item.label}
                                        className="glass-card p-3 rounded-xl text-center"
                                        style={{ borderColor: item.warn ? `${accent}40` : undefined }}>
                                        <p className="text-[10px] text-nk-muted mb-1">{item.label}</p>
                                        <p className="text-base font-bold font-mono"
                                            style={{ color: item.warn ? accent : '#E8EAF6' }}>
                                            {item.value}{item.unit}
                                        </p>
                                        {item.warn && (
                                            <p className="text-[9px] mt-0.5" style={{ color: accent }}>⚠ Alert</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Risk drivers */}
                        <section>
                            <h3 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                                <Activity size={14} className="text-nk-accent" />
                                Risk Contribution Factors
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Turbidity', pct: Math.min(100, (zone.turbidity / 10) * 100) },
                                    { label: 'pH Deviation', pct: Math.min(100, Math.abs(zone.ph - 7) * 80) },
                                    { label: 'Low Chlorine', pct: Math.min(100, Math.max(0, (0.5 - zone.chlorine) / 0.5 * 100)) },
                                    { label: 'Temperature', pct: Math.min(100, ((zone.temp - 28) / 6) * 100) },
                                    { label: 'Case Rate', pct: Math.min(100, (zone.activeCases / 40) * 100) },
                                ].map(driver => (
                                    <div key={driver.label} className="flex items-center gap-3">
                                        <span className="text-xs text-nk-muted w-28 shrink-0">{driver.label}</span>
                                        <div className="flex-1 h-1.5 bg-nk-border rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${driver.pct}%`, background: accent, boxShadow: `0 0 6px ${accent}88` }} />
                                        </div>
                                        <span className="text-xs font-mono text-nk-muted w-12 text-right">
                                            {Math.round(driver.pct)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
