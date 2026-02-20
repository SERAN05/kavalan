import { NextResponse } from 'next/server';
import { MOCK_WARDS, MOCK_METRICS } from '@/lib/mock-data';

export async function GET() {
    await new Promise(r => setTimeout(r, 200));
    return NextResponse.json({
        metrics: MOCK_METRICS,
        wards: MOCK_WARDS.map(w => ({
            id: w.id,
            name: w.name,
            riskScore: w.riskScore,
            riskLevel: w.riskLevel,
            activeCases: w.activeCases,
            lastUpdated: w.lastUpdated,
            coordinates: w.coordinates,
        })),
        lastRefreshed: new Date().toISOString(),
    });
}
