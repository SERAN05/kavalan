// ─── Mock Data Library ──────────────────────────────────────────────────────
// This file contains all mock data for the NEERVAZH KAVALAN MVP.
// Replace these with real API calls to your backend when ready.

export type RiskLevel = 'low' | 'medium' | 'high';

export interface Ward {
    id: string;
    name: string;
    riskScore: number;     // 0–100
    riskLevel: RiskLevel;
    activeCases: number;
    population: number;
    lastUpdated: string;
    coordinates: [number, number]; // [lng, lat]
    drivers: RiskDriver[];
    history: HistoryPoint[];
    alerts: WardAlert[];
    telemetry: Telemetry;
}

export interface RiskDriver {
    label: string;
    value: number;
    unit: string;
    impact: 'positive' | 'negative' | 'neutral';
}

export interface HistoryPoint {
    date: string;
    riskScore: number;
    cases: number;
    temp: number;
    turbidity: number;
}

export interface WardAlert {
    id: string;
    type: string;
    severity: RiskLevel;
    message: string;
    timestamp: string;
    acknowledged: boolean;
}

export interface Telemetry {
    phLevel: number;
    turbidity: number;    // NTU
    chlorine: number;     // mg/L
    temperature: number;  // °C
    deviceStatus: 'online' | 'offline' | 'warning';
}

export interface Alert {
    id: string;
    wardId: string;
    wardName: string;
    type: string;
    severity: RiskLevel;
    message: string;
    timestamp: string;
    slaHours: number;
    slaDeadline: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    deliveryStatus: 'sent' | 'delivered' | 'failed';
    escalated: boolean;
}

export interface DashboardMetrics {
    activeCases: number;
    activeCasesDelta: number;
    riskIndex: number;
    riskIndexDelta: number;
    avgTemp: number;
    ingestionLag: number; // minutes
    wardsMonitored: number;
    alertsOpen: number;
}

// ─── 6 Ward Mock Dataset ─────────────────────────────────────────────────────
export const MOCK_WARDS: Ward[] = [
    {
        id: 'ward-a',
        name: 'Ward A – Kovilambakkam',
        riskScore: 78,
        riskLevel: 'high',
        activeCases: 42,
        population: 18400,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
        coordinates: [80.198, 12.908],
        telemetry: {
            phLevel: 6.1,
            turbidity: 8.4,
            chlorine: 0.12,
            temperature: 31.2,
            deviceStatus: 'online',
        },
        drivers: [
            { label: 'Turbidity', value: 8.4, unit: 'NTU', impact: 'negative' },
            { label: 'pH Level', value: 6.1, unit: '', impact: 'negative' },
            { label: 'Rainfall', value: 42, unit: 'mm', impact: 'negative' },
            { label: 'Case Rate', value: 228, unit: '/100k', impact: 'negative' },
            { label: 'Chlorine', value: 0.12, unit: 'mg/L', impact: 'negative' },
        ],
        history: [
            { date: '2025-01-14', riskScore: 55, cases: 18, temp: 29.4, turbidity: 4.1 },
            { date: '2025-01-21', riskScore: 60, cases: 22, temp: 30.1, turbidity: 5.0 },
            { date: '2025-01-28', riskScore: 67, cases: 30, temp: 30.8, turbidity: 6.3 },
            { date: '2025-02-04', riskScore: 71, cases: 35, temp: 31.0, turbidity: 7.1 },
            { date: '2025-02-11', riskScore: 74, cases: 38, temp: 31.1, turbidity: 7.8 },
            { date: '2025-02-18', riskScore: 78, cases: 42, temp: 31.2, turbidity: 8.4 },
        ],
        alerts: [
            {
                id: 'a1',
                type: 'Turbidity Spike',
                severity: 'high',
                message: 'Turbidity exceeded 8 NTU threshold at sensor NK-WA-03',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                acknowledged: false,
            },
        ],
    },
    {
        id: 'ward-b',
        name: 'Ward B – Pallikaranai',
        riskScore: 62,
        riskLevel: 'medium',
        activeCases: 27,
        population: 22100,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        coordinates: [80.216, 12.916],
        telemetry: {
            phLevel: 6.8,
            turbidity: 5.2,
            chlorine: 0.22,
            temperature: 30.5,
            deviceStatus: 'online',
        },
        drivers: [
            { label: 'Turbidity', value: 5.2, unit: 'NTU', impact: 'negative' },
            { label: 'pH Level', value: 6.8, unit: '', impact: 'neutral' },
            { label: 'Rainfall', value: 28, unit: 'mm', impact: 'negative' },
            { label: 'Case Rate', value: 122, unit: '/100k', impact: 'negative' },
            { label: 'Chlorine', value: 0.22, unit: 'mg/L', impact: 'neutral' },
        ],
        history: [
            { date: '2025-01-14', riskScore: 40, cases: 10, temp: 28.8, turbidity: 3.0 },
            { date: '2025-01-21', riskScore: 45, cases: 13, temp: 29.5, turbidity: 3.5 },
            { date: '2025-01-28', riskScore: 52, cases: 18, temp: 30.0, turbidity: 4.2 },
            { date: '2025-02-04', riskScore: 56, cases: 22, temp: 30.2, turbidity: 4.7 },
            { date: '2025-02-11', riskScore: 59, cases: 25, temp: 30.4, turbidity: 5.0 },
            { date: '2025-02-18', riskScore: 62, cases: 27, temp: 30.5, turbidity: 5.2 },
        ],
        alerts: [],
    },
    {
        id: 'ward-c',
        name: 'Ward C – Medavakkam',
        riskScore: 45,
        riskLevel: 'medium',
        activeCases: 15,
        population: 31200,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        coordinates: [80.189, 12.924],
        telemetry: {
            phLevel: 7.1,
            turbidity: 3.1,
            chlorine: 0.35,
            temperature: 30.0,
            deviceStatus: 'online',
        },
        drivers: [
            { label: 'Turbidity', value: 3.1, unit: 'NTU', impact: 'neutral' },
            { label: 'pH Level', value: 7.1, unit: '', impact: 'positive' },
            { label: 'Rainfall', value: 15, unit: 'mm', impact: 'neutral' },
            { label: 'Case Rate', value: 48, unit: '/100k', impact: 'neutral' },
            { label: 'Chlorine', value: 0.35, unit: 'mg/L', impact: 'positive' },
        ],
        history: [
            { date: '2025-01-14', riskScore: 38, cases: 8, temp: 29.0, turbidity: 2.4 },
            { date: '2025-01-21', riskScore: 40, cases: 9, temp: 29.3, turbidity: 2.6 },
            { date: '2025-01-28', riskScore: 42, cases: 11, temp: 29.7, turbidity: 2.8 },
            { date: '2025-02-04', riskScore: 44, cases: 13, temp: 29.9, turbidity: 3.0 },
            { date: '2025-02-11', riskScore: 44, cases: 14, temp: 30.0, turbidity: 3.0 },
            { date: '2025-02-18', riskScore: 45, cases: 15, temp: 30.0, turbidity: 3.1 },
        ],
        alerts: [],
    },
    {
        id: 'ward-d',
        name: 'Ward D – Sholinganallur',
        riskScore: 29,
        riskLevel: 'low',
        activeCases: 6,
        population: 19800,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        coordinates: [80.229, 12.900],
        telemetry: {
            phLevel: 7.3,
            turbidity: 1.8,
            chlorine: 0.48,
            temperature: 29.5,
            deviceStatus: 'online',
        },
        drivers: [
            { label: 'Turbidity', value: 1.8, unit: 'NTU', impact: 'positive' },
            { label: 'pH Level', value: 7.3, unit: '', impact: 'positive' },
            { label: 'Rainfall', value: 8, unit: 'mm', impact: 'positive' },
            { label: 'Case Rate', value: 30, unit: '/100k', impact: 'positive' },
            { label: 'Chlorine', value: 0.48, unit: 'mg/L', impact: 'positive' },
        ],
        history: [
            { date: '2025-01-14', riskScore: 32, cases: 8, temp: 28.5, turbidity: 2.1 },
            { date: '2025-01-21', riskScore: 30, cases: 7, temp: 28.8, turbidity: 2.0 },
            { date: '2025-01-28', riskScore: 29, cases: 6, temp: 29.1, turbidity: 1.9 },
            { date: '2025-02-04', riskScore: 28, cases: 6, temp: 29.3, turbidity: 1.8 },
            { date: '2025-02-11', riskScore: 28, cases: 6, temp: 29.4, turbidity: 1.8 },
            { date: '2025-02-18', riskScore: 29, cases: 6, temp: 29.5, turbidity: 1.8 },
        ],
        alerts: [],
    },
    {
        id: 'ward-e',
        name: 'Ward E – Perungudi',
        riskScore: 54,
        riskLevel: 'medium',
        activeCases: 19,
        population: 16500,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        coordinates: [80.240, 12.930],
        telemetry: {
            phLevel: 6.5,
            turbidity: 4.8,
            chlorine: 0.18,
            temperature: 30.8,
            deviceStatus: 'warning',
        },
        drivers: [
            { label: 'Turbidity', value: 4.8, unit: 'NTU', impact: 'negative' },
            { label: 'pH Level', value: 6.5, unit: '', impact: 'negative' },
            { label: 'Rainfall', value: 22, unit: 'mm', impact: 'negative' },
            { label: 'Case Rate', value: 115, unit: '/100k', impact: 'negative' },
            { label: 'Chlorine', value: 0.18, unit: 'mg/L', impact: 'negative' },
        ],
        history: [
            { date: '2025-01-14', riskScore: 42, cases: 10, temp: 29.5, turbidity: 3.5 },
            { date: '2025-01-21', riskScore: 46, cases: 12, temp: 30.0, turbidity: 3.8 },
            { date: '2025-01-28', riskScore: 50, cases: 15, temp: 30.3, turbidity: 4.2 },
            { date: '2025-02-04', riskScore: 52, cases: 17, temp: 30.5, turbidity: 4.5 },
            { date: '2025-02-11', riskScore: 53, cases: 18, temp: 30.7, turbidity: 4.7 },
            { date: '2025-02-18', riskScore: 54, cases: 19, temp: 30.8, turbidity: 4.8 },
        ],
        alerts: [
            {
                id: 'a2',
                type: 'Sensor Warning',
                severity: 'medium',
                message: 'NK-WE-02 sensor battery below 15%. Report may be degraded.',
                timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
                acknowledged: false,
            },
        ],
    },
    {
        id: 'ward-f',
        name: 'Ward F – Thoraipakkam',
        riskScore: 18,
        riskLevel: 'low',
        activeCases: 3,
        population: 14200,
        lastUpdated: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        coordinates: [80.240, 12.941],
        telemetry: {
            phLevel: 7.4,
            turbidity: 1.2,
            chlorine: 0.52,
            temperature: 29.2,
            deviceStatus: 'online',
        },
        drivers: [
            { label: 'Turbidity', value: 1.2, unit: 'NTU', impact: 'positive' },
            { label: 'pH Level', value: 7.4, unit: '', impact: 'positive' },
            { label: 'Rainfall', value: 5, unit: 'mm', impact: 'positive' },
            { label: 'Case Rate', value: 21, unit: '/100k', impact: 'positive' },
            { label: 'Chlorine', value: 0.52, unit: 'mg/L', impact: 'positive' },
        ],
        history: [
            { date: '2025-01-14', riskScore: 20, cases: 4, temp: 28.2, turbidity: 1.4 },
            { date: '2025-01-21', riskScore: 19, cases: 4, temp: 28.5, turbidity: 1.3 },
            { date: '2025-01-28', riskScore: 18, cases: 3, temp: 28.9, turbidity: 1.3 },
            { date: '2025-02-04', riskScore: 17, cases: 3, temp: 29.0, turbidity: 1.2 },
            { date: '2025-02-11', riskScore: 18, cases: 3, temp: 29.1, turbidity: 1.2 },
            { date: '2025-02-18', riskScore: 18, cases: 3, temp: 29.2, turbidity: 1.2 },
        ],
        alerts: [],
    },
];

// ─── Dashboard Metrics ─────────────────────────────────────────────────────
export const MOCK_METRICS: DashboardMetrics = {
    activeCases: MOCK_WARDS.reduce((s, w) => s + w.activeCases, 0),
    activeCasesDelta: +8,
    riskIndex: Math.round(MOCK_WARDS.reduce((s, w) => s + w.riskScore, 0) / MOCK_WARDS.length),
    riskIndexDelta: +4,
    avgTemp: +(MOCK_WARDS.reduce((s, w) => s + w.telemetry.temperature, 0) / MOCK_WARDS.length).toFixed(1),
    ingestionLag: 7,
    wardsMonitored: MOCK_WARDS.length,
    alertsOpen: 2,
};

// ─── Active Alerts ─────────────────────────────────────────────────────────
const now = Date.now();
export const MOCK_ALERTS: Alert[] = [
    {
        id: 'alert-001',
        wardId: 'ward-a',
        wardName: 'Ward A – Kovilambakkam',
        type: 'Turbidity Spike',
        severity: 'high',
        message: 'Water turbidity exceeded 8 NTU. Immediate field inspection required.',
        timestamp: new Date(now - 1000 * 60 * 30).toISOString(),
        slaHours: 2,
        slaDeadline: new Date(now + 1000 * 60 * 90).toISOString(),
        acknowledged: false,
        deliveryStatus: 'delivered',
        escalated: false,
    },
    {
        id: 'alert-002',
        wardId: 'ward-e',
        wardName: 'Ward E – Perungudi',
        type: 'Sensor Degradation',
        severity: 'medium',
        message: 'Sensor NK-WE-02 battery critical. Data quality may be compromised.',
        timestamp: new Date(now - 1000 * 60 * 90).toISOString(),
        slaHours: 4,
        slaDeadline: new Date(now + 1000 * 60 * 150).toISOString(),
        acknowledged: false,
        deliveryStatus: 'sent',
        escalated: false,
    },
    {
        id: 'alert-003',
        wardId: 'ward-b',
        wardName: 'Ward B – Pallikaranai',
        type: 'Risk Score Increase',
        severity: 'medium',
        message: 'Risk score crossed 60 threshold. Increased surveillance recommended.',
        timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
        slaHours: 6,
        slaDeadline: new Date(now + 1000 * 60 * 180).toISOString(),
        acknowledged: true,
        acknowledgedBy: 'Dr. Anbu Selvam',
        deliveryStatus: 'delivered',
        escalated: false,
    },
];

// ─── Risk color helpers ────────────────────────────────────────────────────
export function getRiskColor(level: RiskLevel, colorBlind = false): string {
    if (colorBlind) {
        return level === 'high' ? '#FFB000' : level === 'medium' ? '#DC3220' : '#005AB5';
    }
    return level === 'high' ? '#ef4444' : level === 'medium' ? '#f59e0b' : '#22c55e';
}

export function getRiskFromScore(score: number): RiskLevel {
    if (score >= 65) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

// ─── Ward GeoJSON ──────────────────────────────────────────────────────────
// Simplified polygons centred on real Pallikaranai / South Chennai coords.
export const WARD_GEOJSON = {
    type: 'FeatureCollection' as const,
    features: MOCK_WARDS.map(ward => ({
        type: 'Feature' as const,
        properties: {
            id: ward.id,
            name: ward.name,
            riskScore: ward.riskScore,
            riskLevel: ward.riskLevel,
            activeCases: ward.activeCases,
        },
        geometry: {
            type: 'Polygon' as const,
            coordinates: [[
                [ward.coordinates[0] - 0.01, ward.coordinates[1] - 0.008],
                [ward.coordinates[0] + 0.01, ward.coordinates[1] - 0.008],
                [ward.coordinates[0] + 0.01, ward.coordinates[1] + 0.008],
                [ward.coordinates[0] - 0.01, ward.coordinates[1] + 0.008],
                [ward.coordinates[0] - 0.01, ward.coordinates[1] - 0.008],
            ]],
        },
    })),
};
