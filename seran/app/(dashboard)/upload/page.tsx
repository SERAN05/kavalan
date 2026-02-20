'use client';

import { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { UploadModal } from '@/components/UploadModal';

export default function UploadPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-nk-text">Upload Field Data</h1>
                <p className="text-xs text-nk-muted mt-0.5">
                    Submit health reports, water quality readings, or weather data for analysis.
                </p>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Upload trigger card */}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full glass-card p-12 flex flex-col items-center gap-4
                     hover:border-nk-accent/40 transition-all group cursor-pointer"
                    aria-label="Open upload dialog"
                >
                    <div className="w-16 h-16 rounded-2xl bg-nk-accent/15 border border-nk-accent/30
                          flex items-center justify-center group-hover:bg-nk-accent/25 transition-colors
                          animate-glow-pulse">
                        <UploadIcon size={24} className="text-nk-accent" />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-semibold text-nk-text">Upload CSV Data</p>
                        <p className="text-sm text-nk-muted mt-1">
                            Health reports · Water quality · Weather data
                        </p>
                    </div>
                    <span className="text-xs text-nk-accent">Click to open upload dialog →</span>
                </button>

                {/* Info cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        {
                            type: 'Health Report',
                            columns: 'ward_id, date, cases, hospitalizations, deaths',
                            note: 'Daily health surveillance data from CHCs',
                        },
                        {
                            type: 'Water Quality',
                            columns: 'ward_id, timestamp, ph, turbidity, chlorine, temp',
                            note: 'IoT sensor readings from water monitoring devices',
                        },
                        {
                            type: 'Weather Data',
                            columns: 'ward_id, date, rainfall_mm, humidity, max_temp',
                            note: 'Meteorological data from weather stations',
                        },
                    ].map(info => (
                        <div key={info.type} className="glass-card p-4">
                            <p className="text-xs font-semibold text-nk-text mb-2">{info.type}</p>
                            <p className="text-[10px] font-mono text-nk-accent/80 mb-2 leading-relaxed break-all">
                                {info.columns}
                            </p>
                            <p className="text-[10px] text-nk-muted">{info.note}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && <UploadModal onClose={() => setShowModal(false)} />}
        </div>
    );
}
