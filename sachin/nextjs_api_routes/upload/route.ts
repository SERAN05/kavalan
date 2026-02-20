import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    await new Promise(r => setTimeout(r, 800));

    const contentType = req.headers.get('content-type') || '';
    let filename = 'upload.csv';
    let rowsTotal = 120;

    if (contentType.includes('multipart/form-data')) {
        try {
            const form = await req.formData();
            const file = form.get('file') as File | null;
            if (file) {
                filename = file.name;
                const text = await file.text();
                rowsTotal = text.split('\n').length - 1; // minus header
            }
        } catch { }
    }

    const rowsAccepted = Math.floor(rowsTotal * (Math.random() * 0.05 + 0.93));
    const rowsInvalid = rowsTotal - rowsAccepted;

    return NextResponse.json({
        success: true,
        jobId: `job_${Date.now()}`,
        filename,
        summary: {
            rowsTotal,
            rowsAccepted,
            rowsInvalid,
            invalidReasons: rowsInvalid > 0 ? [
                { row: 34, reason: 'Missing ward_id' },
                { row: 67, reason: 'Temperature out of range (> 50°C)' },
            ] : [],
            ingestionTimestamp: new Date().toISOString(),
            lagSeconds: Math.floor(Math.random() * 30 + 10),
        },
    });
}
