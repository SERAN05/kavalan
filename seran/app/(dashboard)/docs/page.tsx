'use client';

import { FileText, ExternalLink, BookOpen, GitBranch, CheckSquare } from 'lucide-react';

const FR_ITEMS = [
    { id: 'FR-01', title: 'CSV Data Ingestion', status: 'complete', page: '/upload' },
    { id: 'FR-02', title: 'Ward Risk Heatmap', status: 'complete', page: '/dashboard' },
    { id: 'FR-03', title: 'Alert Management', status: 'complete', page: '/alerts' },
    { id: 'FR-04', title: 'RBAC Auth', status: 'complete', page: '/login' },
    { id: 'FR-05', title: 'Ward Detail Modal', status: 'complete', page: '/dashboard' },
    { id: 'FR-06', title: 'Color-Blind Mode', status: 'complete', page: '/settings' },
    { id: 'FR-07', title: 'Predictive Scores', status: 'mocked', page: '/dashboard' },
    { id: 'FR-08', title: 'Mapbox GL Heatmap', status: 'pending', page: '' },
    { id: 'FR-09', title: 'Real-Time Ingestion', status: 'pending', page: '' },
];

const API_DOCS = [
    {
        method: 'POST',
        path: '/api/upload',
        desc: 'Upload a CSV file for ingestion.',
        example: `// Request (multipart/form-data)
file: [CSV file]
type: "health" | "water" | "weather"

// Response
{
  "success": true,
  "jobId": "job_1700000000",
  "summary": {
    "rowsTotal": 120,
    "rowsAccepted": 118,
    "rowsInvalid": 2,
    "invalidReasons": [
      { "row": 34, "reason": "Missing ward_id" }
    ],
    "lagSeconds": 18
  }
}`,
    },
    {
        method: 'GET',
        path: '/api/dashboard',
        desc: 'Fetch current dashboard metrics and ward risk summary.',
        example: `// Response
{
  "metrics": {
    "activeCases": 112,
    "riskIndex": 48,
    "avgTemp": 30.2,
    "ingestionLag": 7
  },
  "wards": [
    { "id": "ward-a", "riskScore": 78, "riskLevel": "high", ... }
  ]
}`,
    },
    {
        method: 'GET',
        path: '/api/ward/:id',
        desc: 'Get full ward detail: history, drivers, telemetry, alerts.',
        example: `// Response
{
  "id": "ward-a",
  "name": "Ward A – Kovilambakkam",
  "riskScore": 78,
  "riskLevel": "high",
  "drivers": [...],
  "history": [...],
  "telemetry": { "phLevel": 6.1, "turbidity": 8.4, ... }
}`,
    },
    {
        method: 'POST',
        path: '/api/alerts/ack',
        desc: 'Acknowledge an alert.',
        example: `// Request
{ "alertId": "alert-001", "userId": "1", "notes": "Field team dispatched" }

// Response
{
  "success": true,
  "alertId": "alert-001",
  "status": "acknowledged",
  "acknowledgedAt": "2025-02-20T14:00:00.000Z"
}`,
    },
];

const METHOD_COLORS: Record<string, string> = {
    GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    POST: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

export default function DocsPage() {
    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-nk-text flex items-center gap-2">
                    <BookOpen size={18} className="text-nk-accent" />
                    Documentation
                </h1>
                <p className="text-xs text-nk-muted mt-0.5">
                    Neervazh Kavalan Pilot MVP · API reference, FR traceability, and integration notes.
                </p>
            </div>

            {/* About */}
            <section className="glass-card p-5">
                <h2 className="text-sm font-semibold text-nk-text mb-3">About the Platform</h2>
                <div className="prose prose-sm text-nk-muted space-y-2 text-xs leading-relaxed">
                    <p>
                        <strong className="text-nk-text">Neervazh Kavalan</strong> is an AI-driven predictive
                        surveillance system for waterborne disease risk. The platform ingests multi-source field
                        data — health case reports, water quality IoT sensor streams, and meteorological data —
                        to compute ward-level risk scores and issue automated, SLA-tracked alerts.
                    </p>
                    <p>
                        This pilot MVP covers 6 wards in South Chennai (Pallikaranai, Kovilambakkam, Medavakkam,
                        Sholinganallur, Perungudi, Thoraipakkam). All data and risk scores are <strong className="text-amber-400">mocked</strong> for
                        the pilot. Replace <code className="font-mono text-nk-accent">/api/*</code> routes with real backend
                        endpoints when going to production.
                    </p>
                </div>
            </section>

            {/* FR Traceability */}
            <section>
                <h2 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                    <CheckSquare size={14} className="text-nk-accent" />
                    FR Traceability
                </h2>
                <div className="glass-card overflow-hidden">
                    <table className="w-full text-xs" aria-label="Functional requirements traceability">
                        <thead>
                            <tr className="border-b border-nk-border bg-nk-border/20">
                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-nk-muted uppercase tracking-wider">FR #</th>
                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-nk-muted uppercase tracking-wider">Requirement</th>
                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-nk-muted uppercase tracking-wider">Status</th>
                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-nk-muted uppercase tracking-wider">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {FR_ITEMS.map((item, i) => (
                                <tr key={item.id} className={`border-b border-nk-border/50 ${i % 2 === 0 ? '' : 'bg-nk-border/10'}`}>
                                    <td className="px-4 py-2.5 font-mono text-nk-accent">{item.id}</td>
                                    <td className="px-4 py-2.5 text-nk-text">{item.title}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === 'complete' ? 'bg-emerald-500/15 text-emerald-400'
                                                : item.status === 'mocked' ? 'bg-amber-500/15 text-amber-400'
                                                    : 'bg-nk-border text-nk-muted'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        {item.page && (
                                            <a href={item.page} className="text-nk-accent/70 hover:text-nk-accent flex items-center gap-1">
                                                <ExternalLink size={10} />
                                                View
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* API Docs */}
            <section>
                <h2 className="text-sm font-semibold text-nk-text mb-3 flex items-center gap-2">
                    <GitBranch size={14} className="text-nk-accent" />
                    API Reference
                </h2>
                <div className="space-y-4">
                    {API_DOCS.map(api => (
                        <div key={api.path} className="glass-card overflow-hidden">
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-nk-border">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${METHOD_COLORS[api.method]}`}>
                                    {api.method}
                                </span>
                                <code className="text-sm font-mono text-nk-text">{api.path}</code>
                                <span className="text-xs text-nk-muted ml-2">{api.desc}</span>
                            </div>
                            <pre className="p-4 text-[10px] font-mono text-nk-muted leading-relaxed overflow-x-auto">
                                {api.example}
                            </pre>
                        </div>
                    ))}
                </div>
            </section>

            {/* Integration note */}
            <section className="glass-card p-5 border border-amber-500/20 bg-amber-500/5">
                <h2 className="text-sm font-semibold text-amber-400 mb-2">
                    🔄 Connecting to Real Backend
                </h2>
                <p className="text-xs text-nk-muted leading-relaxed">
                    All API routes live in <code className="font-mono text-nk-accent">app/api/*</code>.
                    Replace the mock data in <code className="font-mono text-nk-accent">lib/mock-data.ts</code> with
                    real fetch calls to your backend. The route handlers use the same response schema so your
                    frontend components need no changes.
                </p>
            </section>
        </div>
    );
}
