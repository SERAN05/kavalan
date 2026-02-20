// Coimbatore Zone & Ward Data
// 6 major zones of Coimbatore Corporation matching the Zone Map PDF layout

import type { RiskLevel } from './mock-data';

export interface CoimbatoreZone {
    id: string;
    name: string;
    zoneName: string;
    riskScore: number;
    riskLevel: RiskLevel;
    activeCases: number;
    population: number;
    center: [number, number]; // [lat, lng]
    key_area: string;
    turbidity: number;
    ph: number;
    chlorine: number;
    temp: number;
    history: { date: string; riskScore: number; cases: number }[];
}

export const COIMBATORE_ZONES: CoimbatoreZone[] = [
    {
        id: 'zone-1',
        name: 'Zone 1 – Central',
        zoneName: 'Central',
        riskScore: 72,
        riskLevel: 'high',
        activeCases: 38,
        population: 145000,
        center: [11.0168, 76.9558],
        key_area: 'RS Puram, Gandhipuram, Town Hall',
        turbidity: 7.8,
        ph: 6.3,
        chlorine: 0.14,
        temp: 32.1,
        history: [
            { date: '2025-01-14', riskScore: 55, cases: 24 },
            { date: '2025-01-21', riskScore: 60, cases: 28 },
            { date: '2025-01-28', riskScore: 65, cases: 32 },
            { date: '2025-02-04', riskScore: 68, cases: 34 },
            { date: '2025-02-11', riskScore: 70, cases: 36 },
            { date: '2025-02-18', riskScore: 72, cases: 38 },
        ],
    },
    {
        id: 'zone-2',
        name: 'Zone 2 – North',
        zoneName: 'North',
        riskScore: 48,
        riskLevel: 'medium',
        activeCases: 21,
        population: 128000,
        center: [11.0450, 76.9630],
        key_area: 'Perur, Vadavalli, Saravanampatti',
        turbidity: 4.9,
        ph: 6.9,
        chlorine: 0.24,
        temp: 31.2,
        history: [
            { date: '2025-01-14', riskScore: 36, cases: 12 },
            { date: '2025-01-21', riskScore: 39, cases: 14 },
            { date: '2025-01-28', riskScore: 42, cases: 17 },
            { date: '2025-02-04', riskScore: 44, cases: 18 },
            { date: '2025-02-11', riskScore: 46, cases: 20 },
            { date: '2025-02-18', riskScore: 48, cases: 21 },
        ],
    },
    {
        id: 'zone-3',
        name: 'Zone 3 – South',
        zoneName: 'South',
        riskScore: 31,
        riskLevel: 'low',
        activeCases: 9,
        population: 118000,
        center: [10.9900, 76.9500],
        key_area: 'Peelamedu, Avinashi Road, Codissia',
        turbidity: 2.1,
        ph: 7.2,
        chlorine: 0.42,
        temp: 30.4,
        history: [
            { date: '2025-01-14', riskScore: 28, cases: 7 },
            { date: '2025-01-21', riskScore: 29, cases: 7 },
            { date: '2025-01-28', riskScore: 30, cases: 8 },
            { date: '2025-02-04', riskScore: 30, cases: 8 },
            { date: '2025-02-11', riskScore: 31, cases: 9 },
            { date: '2025-02-18', riskScore: 31, cases: 9 },
        ],
    },
    {
        id: 'zone-4',
        name: 'Zone 4 – East',
        zoneName: 'East',
        riskScore: 63,
        riskLevel: 'medium',
        activeCases: 28,
        population: 132000,
        center: [11.0100, 77.0100],
        key_area: 'Singanallur, Ondipudur, Kovaipudur',
        turbidity: 5.8,
        ph: 6.6,
        chlorine: 0.19,
        temp: 31.8,
        history: [
            { date: '2025-01-14', riskScore: 48, cases: 18 },
            { date: '2025-01-21', riskScore: 52, cases: 21 },
            { date: '2025-01-28', riskScore: 55, cases: 24 },
            { date: '2025-02-04', riskScore: 58, cases: 25 },
            { date: '2025-02-11', riskScore: 61, cases: 27 },
            { date: '2025-02-18', riskScore: 63, cases: 28 },
        ],
    },
    {
        id: 'zone-5',
        name: 'Zone 5 – West',
        zoneName: 'West',
        riskScore: 22,
        riskLevel: 'low',
        activeCases: 5,
        population: 98000,
        center: [11.0200, 76.9100],
        key_area: 'Kuniyamuthur, Kalapatti, Neelambur',
        turbidity: 1.5,
        ph: 7.4,
        chlorine: 0.51,
        temp: 29.8,
        history: [
            { date: '2025-01-14', riskScore: 24, cases: 6 },
            { date: '2025-01-21', riskScore: 23, cases: 5 },
            { date: '2025-01-28', riskScore: 22, cases: 5 },
            { date: '2025-02-04', riskScore: 22, cases: 5 },
            { date: '2025-02-11', riskScore: 22, cases: 5 },
            { date: '2025-02-18', riskScore: 22, cases: 5 },
        ],
    },
    {
        id: 'zone-6',
        name: 'Zone 6 – Northeast',
        zoneName: 'Northeast',
        riskScore: 55,
        riskLevel: 'medium',
        activeCases: 24,
        population: 112000,
        center: [11.0350, 77.0050],
        key_area: 'Ganapathy, Kavundampalayam, Thudiyalur',
        turbidity: 5.1,
        ph: 6.8,
        chlorine: 0.22,
        temp: 31.0,
        history: [
            { date: '2025-01-14', riskScore: 42, cases: 15 },
            { date: '2025-01-21', riskScore: 46, cases: 18 },
            { date: '2025-01-28', riskScore: 49, cases: 20 },
            { date: '2025-02-04', riskScore: 51, cases: 22 },
            { date: '2025-02-11', riskScore: 53, cases: 23 },
            { date: '2025-02-18', riskScore: 55, cases: 24 },
        ],
    },
];

// GeoJSON polygons for Coimbatore zones — approximate but realistic ward boundaries
export const COIMBATORE_GEOJSON = {
    type: 'FeatureCollection' as const,
    features: [
        // Zone 1 – Central (RS Puram, Gandhipuram area)
        {
            type: 'Feature' as const,
            properties: { id: 'zone-1', name: 'Central Zone', riskScore: 72, riskLevel: 'high', activeCases: 38 },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                    [76.9350, 11.0050], [76.9720, 11.0050], [76.9720, 11.0300],
                    [76.9350, 11.0300], [76.9350, 11.0050]
                ]]
            }
        },
        // Zone 2 – North (Perur, Vadavalli area)
        {
            type: 'Feature' as const,
            properties: { id: 'zone-2', name: 'North Zone', riskScore: 48, riskLevel: 'medium', activeCases: 21 },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                    [76.9350, 11.0300], [76.9850, 11.0300], [76.9850, 11.0620],
                    [76.9350, 11.0620], [76.9350, 11.0300]
                ]]
            }
        },
        // Zone 3 – South (Peelamedu area)
        {
            type: 'Feature' as const,
            properties: { id: 'zone-3', name: 'South Zone', riskScore: 31, riskLevel: 'low', activeCases: 9 },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                    [76.9350, 10.9700], [76.9850, 10.9700], [76.9850, 11.0050],
                    [76.9350, 11.0050], [76.9350, 10.9700]
                ]]
            }
        },
        // Zone 4 – East (Singanallur area)
        {
            type: 'Feature' as const,
            properties: { id: 'zone-4', name: 'East Zone', riskScore: 63, riskLevel: 'medium', activeCases: 28 },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                    [76.9720, 10.9700], [77.0350, 10.9700], [77.0350, 11.0300],
                    [76.9720, 11.0300], [76.9720, 10.9700]
                ]]
            }
        },
        // Zone 5 – West (Kuniyamuthur area)
        {
            type: 'Feature' as const,
            properties: { id: 'zone-5', name: 'West Zone', riskScore: 22, riskLevel: 'low', activeCases: 5 },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                    [76.8750, 10.9900], [76.9350, 10.9900], [76.9350, 11.0450],
                    [76.8750, 11.0450], [76.8750, 10.9900]
                ]]
            }
        },
        // Zone 6 – Northeast (Ganapathy area)
        {
            type: 'Feature' as const,
            properties: { id: 'zone-6', name: 'Northeast Zone', riskScore: 55, riskLevel: 'medium', activeCases: 24 },
            geometry: {
                type: 'Polygon' as const,
                coordinates: [[
                    [76.9850, 11.0050], [77.0350, 11.0050], [77.0350, 11.0620],
                    [76.9850, 11.0620], [76.9850, 11.0050]
                ]]
            }
        },
    ]
};
