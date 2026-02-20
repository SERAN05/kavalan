'use client';

import { useRouter } from 'next/navigation';
import {
    Shield, Droplets, Activity, Map, ArrowRight, CheckCircle, Zap
} from 'lucide-react';

const KPIs = [
    { label: 'Wards Monitored', value: '6', unit: '' },
    { label: 'Avg Detection Lag', value: '<8', unit: 'hrs' },
    { label: 'Alert Accuracy', value: '94', unit: '%' },
    { label: 'Reports Processed', value: '1,200', unit: '/wk' },
];

const FEATURES = [
    {
        icon: Map,
        title: 'Ward-Level Heatmaps',
        desc: 'Color-coded risk visualization across 6 wards with real-time score updates and confidence overlays.',
    },
    {
        icon: Activity,
        title: 'Predictive Risk Scoring',
        desc: 'AI-driven risk index computed from water quality, weather, and health case ingestion lag.',
    },
    {
        icon: Shield,
        title: 'Automated Alerts',
        desc: 'SLA-tracked alerts with acknowledgement workflows and escalation paths for health workers.',
    },
    {
        icon: Droplets,
        title: 'Multi-Source Ingestion',
        desc: 'Upload health reports, water quality readings, and weather data via CSV with schema validation.',
    },
    {
        icon: Zap,
        title: 'Real-Time Dashboard',
        desc: 'Metric cards pulse on update; historical trend charts surface early warning signals.',
    },
    {
        icon: CheckCircle,
        title: 'Accessible by Design',
        desc: 'WCAG-compliant keyboard navigation, ARIA labels, and a color-blind safe mode toggle.',
    },
];

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #010A39 0%, #050D30 100%)' }}>
            {/* Hero */}
            <header className="relative overflow-hidden px-6 py-24 text-center">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(41,94,201,1) 1px, transparent 1px), linear-gradient(90deg,rgba(41,94,201,1) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 rounded-full"
                    style={{ background: 'radial-gradient(ellipse, #295EC9 0%, transparent 70%)' }}
                />

                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          bg-nk-accent/10 border border-nk-accent/30 text-xs text-nk-accent
                          font-semibold mb-6 stagger-1">
                        <span className="w-1.5 h-1.5 bg-nk-accent rounded-full animate-pulse" />
                        PILOT MVP · South Chennai
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-nk-text leading-tight mb-4 stagger-2">
                        Neervazh{' '}
                        <span style={{ color: '#295EC9' }}>Kavalan</span>
                    </h1>
                    <p className="text-base text-nk-muted max-w-2xl mx-auto mb-8 leading-relaxed stagger-3">
                        AI-powered waterborne disease surveillance platform. Monitor ward-level health risk,
                        ingest multi-source field data, and act on real-time alerts — before outbreaks spread.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center stagger-4">
                        <button
                            onClick={() => router.push('/login')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-nk-accent
                         text-white font-semibold text-sm hover:bg-nk-accent-glow
                         transition-all animate-glow-pulse"
                        >
                            Open Dashboard
                            <ArrowRight size={14} />
                        </button>
                        <button
                            onClick={() => router.push('/docs')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         border border-nk-border text-nk-muted hover:text-nk-text
                         hover:border-nk-accent/40 transition-all text-sm font-semibold"
                        >
                            Read the Docs
                        </button>
                    </div>
                </div>
            </header>

            {/* KPIs */}
            <section className="px-6 pb-16">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {KPIs.map((kpi, i) => (
                        <div
                            key={kpi.label}
                            className={`glass-card p-5 text-center stagger-${i + 1}`}
                        >
                            <p className="text-2xl font-bold text-nk-text font-mono">
                                {kpi.value}
                                <span className="text-sm text-nk-muted ml-1">{kpi.unit}</span>
                            </p>
                            <p className="text-xs text-nk-muted mt-1">{kpi.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-nk-text text-center mb-2">
                        Built for Public Health Teams
                    </h2>
                    <p className="text-sm text-nk-muted text-center mb-10">
                        Designed for district health officers and field workers, accessible on any device.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((feat, i) => {
                            const Icon = feat.icon;
                            return (
                                <div
                                    key={feat.title}
                                    className={`glass-card p-5 hover:border-nk-accent/30 transition-all
                              group stagger-${Math.min(i + 1, 6)}`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-nk-accent/15 flex items-center
                                  justify-center mb-3 group-hover:bg-nk-accent/25 transition-colors">
                                        <Icon size={15} className="text-nk-accent" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-nk-text mb-1">{feat.title}</h3>
                                    <p className="text-xs text-nk-muted leading-relaxed">{feat.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24 text-center">
                <div className="max-w-2xl mx-auto glass-card p-10">
                    <h2 className="text-xl font-bold text-nk-text mb-3">
                        Ready to protect your community?
                    </h2>
                    <p className="text-sm text-nk-muted mb-6">
                        Sign in with your district health credentials to access the live surveillance dashboard.
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-8 py-3 rounded-xl bg-nk-accent text-white font-semibold
                       text-sm hover:bg-nk-accent-glow transition-all inline-flex items-center gap-2"
                    >
                        Get Started <ArrowRight size={14} />
                    </button>
                </div>
            </section>

            <footer className="text-center py-6 text-[10px] text-nk-muted/40 border-t border-nk-border">
                © 2025 Neervazh Kavalan · Pilot MVP · Not for clinical use
            </footer>
        </div>
    );
}
