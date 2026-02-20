import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    await new Promise(r => setTimeout(r, 300));
    const body = await req.json().catch(() => ({}));
    const { alertId, userId, notes } = body as {
        alertId?: string;
        userId?: string;
        notes?: string;
    };

    if (!alertId) {
        return NextResponse.json({ error: 'alertId is required' }, { status: 400 });
    }

    return NextResponse.json({
        success: true,
        alertId,
        status: 'acknowledged',
        acknowledgedBy: userId || 'unknown',
        acknowledgedAt: new Date().toISOString(),
        notes: notes || null,
    });
}
