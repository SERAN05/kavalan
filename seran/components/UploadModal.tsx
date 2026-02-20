'use client';

import { useState, useRef, useCallback } from 'react';
import {
    Upload, FileText, CheckCircle, XCircle, Loader2, X, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngestionResult {
    jobId: string;
    filename: string;
    summary: {
        rowsTotal: number;
        rowsAccepted: number;
        rowsInvalid: number;
        invalidReasons: { row: number; reason: string }[];
        ingestionTimestamp: string;
        lagSeconds: number;
    };
}

interface UploadModalProps {
    onClose: () => void;
}

type UploadType = 'health' | 'water' | 'weather';

const UPLOAD_TYPES: { value: UploadType; label: string; accepts: string }[] = [
    { value: 'health', label: 'Health Report', accepts: 'ward_id,date,cases,hospitalizations,deaths' },
    { value: 'water', label: 'Water Quality', accepts: 'ward_id,timestamp,ph,turbidity,chlorine,temp' },
    { value: 'weather', label: 'Weather Data', accepts: 'ward_id,date,rainfall_mm,humidity,max_temp' },
];

export function UploadModal({ onClose }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadType, setUploadType] = useState<UploadType>('health');
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<IngestionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped?.name.endsWith('.csv')) {
            setFile(dropped);
            setResult(null);
            setError(null);
        } else {
            setError('Only .csv files are accepted.');
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('type', uploadType);
            const res = await fetch('/api/upload', { method: 'POST', body: form });
            const data = await res.json();
            setResult(data);
        } catch {
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const selectedType = UPLOAD_TYPES.find(t => t.value === uploadType)!;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Upload data file"
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-lg glass-card rounded-2xl shadow-2xl
                      animate-slide-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-nk-border">
                    <h2 className="text-base font-semibold text-nk-text flex items-center gap-2">
                        <Upload size={16} className="text-nk-accent" />
                        Upload Field Data
                    </h2>
                    <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-white/5
                                         text-nk-muted hover:text-nk-text transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Type selector */}
                    <div className="flex gap-2">
                        {UPLOAD_TYPES.map(type => (
                            <button
                                key={type.value}
                                onClick={() => setUploadType(type.value)}
                                aria-pressed={uploadType === type.value}
                                className={cn(
                                    'flex-1 text-xs py-2 px-3 rounded-lg border transition-all',
                                    uploadType === type.value
                                        ? 'bg-nk-accent/15 border-nk-accent/50 text-nk-accent font-medium'
                                        : 'border-nk-border text-nk-muted hover:border-nk-accent/30'
                                )}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {/* Schema hint */}
                    <div className="px-3 py-2 rounded-lg bg-nk-accent/5 border border-nk-accent/20">
                        <p className="text-[10px] text-nk-muted font-mono leading-relaxed">
                            Expected columns: {selectedType.accepts}
                        </p>
                    </div>

                    {/* Drop zone */}
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label="Drop zone — click or drag a CSV file here"
                        className={cn(
                            'drop-zone rounded-xl p-8 text-center cursor-pointer transition-all',
                            dragOver && 'drag-over',
                            file && 'border-emerald-500/40 bg-emerald-500/5'
                        )}
                        onClick={() => inputRef.current?.click()}
                        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                            aria-label="CSV file input"
                        />
                        {file ? (
                            <div className="flex items-center justify-center gap-2">
                                <FileText size={16} className="text-emerald-400" />
                                <span className="text-sm text-nk-text font-medium">{file.name}</span>
                                <span className="text-xs text-nk-muted">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                        ) : (
                            <>
                                <Upload size={24} className="mx-auto mb-2 text-nk-muted/50" />
                                <p className="text-sm text-nk-muted">
                                    Drag & drop your <span className="text-nk-text">.csv</span> file here
                                </p>
                                <p className="text-xs text-nk-muted/60 mt-1">or click to browse</p>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10
                            border border-red-500/30 text-xs text-red-400">
                            <AlertTriangle size={12} />
                            {error}
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4
                            animate-fade-in space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={14} className="text-emerald-400" />
                                <span className="text-sm font-semibold text-nk-text">Ingestion Complete</span>
                                <span className="text-[10px] text-nk-muted font-mono ml-auto">
                                    Job: {result.jobId}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Total', value: result.summary.rowsTotal, color: 'text-nk-text' },
                                    { label: 'Accepted', value: result.summary.rowsAccepted, color: 'text-emerald-400' },
                                    { label: 'Invalid', value: result.summary.rowsInvalid, color: 'text-red-400' },
                                ].map(stat => (
                                    <div key={stat.label} className="text-center">
                                        <p className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</p>
                                        <p className="text-[10px] text-nk-muted">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            {result.summary.invalidReasons.length > 0 && (
                                <div className="space-y-1">
                                    {result.summary.invalidReasons.map(r => (
                                        <div key={r.row} className="flex items-center gap-1.5 text-[10px] text-nk-muted">
                                            <XCircle size={10} className="text-red-400" />
                                            Row {r.row}: {r.reason}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-[10px] text-nk-muted">
                                Ingestion lag: {result.summary.lagSeconds}s
                            </p>
                        </div>
                    )}

                    {/* Action button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        aria-label="Upload file"
                        className="w-full py-2.5 px-4 rounded-xl bg-nk-accent text-white text-sm
                       font-semibold flex items-center justify-center gap-2 transition-all
                       hover:bg-nk-accent-glow disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {uploading
                            ? <><Loader2 size={14} className="animate-spin" /> Processing…</>
                            : <><Upload size={14} /> Upload & Analyze</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
