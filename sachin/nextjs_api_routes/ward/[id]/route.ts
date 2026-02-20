import { NextResponse } from 'next/server';
import { MOCK_WARDS } from '@/lib/mock-data';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    await new Promise(r => setTimeout(r, 150));
    const ward = MOCK_WARDS.find(w => w.id === params.id);
    if (!ward) {
        return NextResponse.json({ error: 'Ward not found' }, { status: 404 });
    }
    return NextResponse.json(ward);
}
