'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, RefreshCw, Upload, Thermometer, Clock } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { WardHeatmap } from '@/components/WardHeatmap';
import { WardDetailModal } from '@/components/WardDetailModal';
import { AlertsPanel } from '@/components/AlertsPanel';
import { UploadModal } from '@/components/UploadModal';
import { RiskBadge } from '@/components/RiskBadge';
import { MOCK_METRICS, MOCK_WARDS } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';

export default function DashboardPage() {
    const { user } = useAuth();
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const [showUpload, setShowUpload] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await new Promise(r => setTimeout(r, 800));
        setLastRefresh(new Date());
        setRefreshing(false);
    };

    // Chart data
    const wardBarData = MOCK_WARDS.map(w => ({
        ward: w.name.split(' – ')[0],
        risk: w.riskScore,
        cases: w.activeCases,
        fill: w.riskLevel === 'high' ? '#ef4444' : w.riskLevel === 'medium' ? '#f59e0b' : '#22c55e',
    }));

    const trendData = MOCK_WARDS[0].history.map((h, i) => ({
        date: h.date.slice(5),
        'Ward A': MOCK_WARDS[0].history[i]?.riskScore,
        'Ward B': MOCK_WARDS[1].history[i]?.riskScore,
        'Ward C': MOCK_WARDS[2].history[i]?.riskScore,
    }));

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-nk-text">
                        Predictive Dashboard
                    </h1>
                    <p className="text-xs text-nk-muted mt-0.5">
                        Real-time ward surveillance · Last refreshed:{' '}
                        <span className="font-mono">
                            {lastRefresh.toLocaleTimeString()}
                        </span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowUpload(true)}
                        aria-label="Upload field data"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                       border border-nk-border text-nk-muted hover:text-nk-text
                       hover:border-nk-accent/40 hover:bg-nk-accent/5 transition-all"
                    >
                        <Upload size={13} />
                        Upload
                    </button>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        aria-label="Refresh dashboard"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                       bg-nk-accent/10 border border-nk-accent/30 text-nk-accent
                       hover:bg-nk-accent/20 transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                    label="Active Cases"
                    value={MOCK_METRICS.activeCases}
                    delta={MOCK_METRICS.activeCasesDelta}
                    icon={<Activity size={14} />}
                    className="stagger-1"
                />
                <MetricCard
                    label="Risk Index"
                    value={MOCK_METRICS.riskIndex}
                    unit="/100"
                    delta={MOCK_METRICS.riskIndexDelta}
                    icon={<AlertTriangle size={14} />}
                    pulse
                    className="stagger-2"
                />
                <MetricCard
                    label="Avg Temperature"
                    value={MOCK_METRICS.avgTemp}
                    unit="°C"
                    icon={<Thermometer size={14} />}
                    description="Across all wards"
                    className="stagger-3"
                />
                <MetricCard
                    label="Ingestion Lag"
                    value={MOCK_METRICS.ingestionLag}
                    unit="min"
                    icon={<Clock size={14} />}
                    description="Data pipeline delay"
                    className="stagger-4"
                />
            </div>

            {/* Main grid: Heatmap + Insights rail */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Center: Heatmap + Charts (2/3 width) */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Heatmap */}
                    <div className="glass-card p-4 stagger-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-nk-text">
                                Ward Risk Heatmap
                            </h2>
                            <span className="text-[10px] text-nk-muted font-mono">
                                {MOCK_METRICS.wardsMonitored} wards monitored
                            </span>
                        </div>
                        <WardHeatmap onWardClick={setSelectedWard} />
                    </div>

                    {/* Charts row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Risk scores bar chart */}
                        <div className="glass-card p-4">
                            <h3 className="text-xs font-semibold text-nk-text mb-3">
                                Risk Score by Ward
                            </h3>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={wardBarData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,115,153,0.12)" />
                                    <XAxis dataKey="ward" tick={{ fontSize: 10, fill: '#6B7399' }} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7399' }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#050D30',
                                            border: '1px solid #1a2456',
                                            borderRadius: 8,
                                            fontSize: 11,
                                        }}
                                    />
                                    <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                                        {wardBarData.map((entry, i) => (
                                            <rect key={i} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Risk trend line chart */}
                        <div className="glass-card p-4">
                            <h3 className="text-xs font-semibold text-nk-text mb-3">
                                6-Week Risk Trend
                            </h3>
                            <ResponsiveContainer width="100%" height={160}>
                                <LineChart data={trendData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,115,153,0.12)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#6B7399' }} />
                                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#6B7399' }} />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#050D30',
                                            border: '1px solid #1a2456',
                                            borderRadius: 8,
                                            fontSize: 11,
                                        }}
                                    />
                                    <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: '#6B7399' }} />
                                    <Line type="monotone" dataKey="Ward A" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Ward B" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="Ward C" stroke="#22c55e" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Right: Insights rail (1/3 width) */}
                <div className="space-y-4">
                    {/* Alerts panel */}
                    <div className="glass-card p-4" style={{ minHeight: 320 }}>
                        <AlertsPanel compact />
                    </div>

                    {/* Ward risk drivers summary */}
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-semibold text-nk-text mb-3">
                            Top Risk Drivers
                        </h3>
                        <div className="space-y-3">
                            {MOCK_WARDS.filter(w => w.riskLevel !== 'low')
                                .slice(0, 3)
                                .map(ward => (
                                    <button
                                        key={ward.id}
                                        onClick={() => setSelectedWard(ward.id)}
                                        className="w-full text-left p-2.5 rounded-lg bg-nk-border/20
                               hover:bg-nk-accent/5 border border-nk-border hover:border-nk-accent/30
                               transition-all group"
                                        aria-label={`View details for ${ward.name}`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-medium text-nk-text truncate pr-2">
                                                {ward.name.split(' – ')[1]}
                                            </span>
                                            <RiskBadge level={ward.riskLevel} score={ward.riskScore} size="sm" />
                                        </div>
                                        <p className="text-[10px] text-nk-muted">
                                            {ward.drivers[0]?.label}: {ward.drivers[0]?.value} {ward.drivers[0]?.unit}
                                        </p>
                                    </button>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <WardDetailModal
                wardId={selectedWard}
                onClose={() => setSelectedWard(null)}
            />
            {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
        </div>
    );
}
