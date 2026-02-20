'use client';

import { useEffect, useRef, useState } from 'react';
import { MOCK_WARDS, WARD_GEOJSON, getRiskColor, getRiskFromScore } from '@/lib/mock-data';
import { useTheme } from '@/contexts/ThemeContext';
import { RiskBadge } from './RiskBadge';

interface WardHeatmapProps {
    onWardClick: (wardId: string) => void;
}

export function WardHeatmap({ onWardClick }: WardHeatmapProps) {
    const { colorBlindMode } = useTheme();
    const [hoveredWard, setHoveredWard] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{
        x: number; y: number;
        ward: (typeof MOCK_WARDS)[0] | null;
    } | null>(null);

    // We'll render an SVG-based map since Mapbox requires an API token.
    // In production, replace this with a real Mapbox/MapLibre integration.
    const containerRef = useRef<HTMLDivElement>(null);

    // Map geographic bounds to SVG viewport
    const lngs = MOCK_WARDS.map(w => w.coordinates[0]);
    const lats = MOCK_WARDS.map(w => w.coordinates[1]);
    const minLng = Math.min(...lngs) - 0.012;
    const maxLng = Math.max(...lngs) + 0.012;
    const minLat = Math.min(...lats) - 0.012;
    const maxLat = Math.max(...lats) + 0.012;

    const W = 600, H = 400;

    function project(lng: number, lat: number) {
        const x = ((lng - minLng) / (maxLng - minLng)) * W;
        const y = H - ((lat - minLat) / (maxLat - minLat)) * H;
        return { x, y };
    }

    function wardPolygonPoints(ward: (typeof MOCK_WARDS)[0]) {
        const [lng, lat] = ward.coordinates;
        const SIZE_LNG = 0.009;
        const SIZE_LAT = 0.006;
        return [
            project(lng - SIZE_LNG, lat - SIZE_LAT),
            project(lng + SIZE_LNG, lat - SIZE_LAT),
            project(lng + SIZE_LNG, lat + SIZE_LAT),
            project(lng - SIZE_LNG, lat + SIZE_LAT),
        ].map(p => `${p.x},${p.y}`).join(' ');
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full rounded-xl overflow-hidden border border-nk-border"
            style={{ background: 'linear-gradient(135deg, #010A39 0%, #050D30 100%)', minHeight: 340 }}
        >
            {/* Map legend */}
            <div className="absolute top-3 left-3 z-10 glass-card rounded-lg p-2">
                <p className="text-[10px] text-nk-muted mb-1.5 font-semibold uppercase tracking-wider">
                    Risk Level
                </p>
                {(['low', 'medium', 'high'] as const).map(level => (
                    <div key={level} className="flex items-center gap-1.5 mb-0.5">
                        <span
                            className="w-3 h-3 rounded-sm inline-block"
                            style={{ background: getRiskColor(level, colorBlindMode) }}
                        />
                        <span className="text-[10px] text-nk-muted capitalize">{level}</span>
                    </div>
                ))}
            </div>

            {/* Compass */}
            <div className="absolute top-3 right-3 z-10 text-nk-muted/30 text-[10px] font-mono">
                N↑
            </div>

            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full h-full"
                style={{ minHeight: 300 }}
                role="img"
                aria-label="Ward risk heatmap"
            >
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(t => (
                    <g key={`grid-${t}`}>
                        <line
                            x1={t * W} y1={0} x2={t * W} y2={H}
                            stroke="rgba(107,115,153,0.08)" strokeWidth="1"
                        />
                        <line
                            x1={0} y1={t * H} x2={W} y2={t * H}
                            stroke="rgba(107,115,153,0.08)" strokeWidth="1"
                        />
                    </g>
                ))}

                {/* Ward polygons */}
                {MOCK_WARDS.map(ward => {
                    const color = getRiskColor(ward.riskLevel, colorBlindMode);
                    const isHovered = hoveredWard === ward.id;
                    const center = project(...ward.coordinates);

                    return (
                        <g key={ward.id}>
                            <polygon
                                points={wardPolygonPoints(ward)}
                                fill={color}
                                fillOpacity={isHovered ? 0.65 : 0.45}
                                stroke={color}
                                strokeWidth={isHovered ? 2.5 : 1.5}
                                strokeOpacity={0.8}
                                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                role="button"
                                aria-label={`${ward.name} - Risk: ${ward.riskLevel}, Score: ${ward.riskScore}`}
                                tabIndex={0}
                                onClick={() => onWardClick(ward.id)}
                                onKeyDown={e => e.key === 'Enter' && onWardClick(ward.id)}
                                onMouseEnter={e => {
                                    setHoveredWard(ward.id);
                                    const rect = containerRef.current?.getBoundingClientRect();
                                    if (rect) {
                                        setTooltip({
                                            x: center.x,
                                            y: center.y - 10,
                                            ward,
                                        });
                                    }
                                }}
                                onMouseLeave={() => {
                                    setHoveredWard(null);
                                    setTooltip(null);
                                }}
                            />

                            {/* Ward label */}
                            <text
                                x={center.x}
                                y={center.y + 4}
                                textAnchor="middle"
                                fontSize="9"
                                fill="rgba(255,255,255,0.85)"
                                style={{ pointerEvents: 'none', fontWeight: isHovered ? 700 : 400 }}
                            >
                                {ward.name.split(' – ')[0]}
                            </text>

                            {/* Risk score bubble */}
                            <text
                                x={center.x}
                                y={center.y + 16}
                                textAnchor="middle"
                                fontSize="8"
                                fill={color}
                                fillOpacity={0.9}
                                style={{ pointerEvents: 'none' }}
                            >
                                {ward.riskScore}
                            </text>
                        </g>
                    );
                })}

                {/* Hover tooltip */}
                {tooltip?.ward && (
                    <g>
                        <rect
                            x={tooltip.x - 60}
                            y={tooltip.y - 40}
                            width={120}
                            height={36}
                            rx={6}
                            fill="rgba(5,13,48,0.95)"
                            stroke="rgba(41,94,201,0.4)"
                            strokeWidth={1}
                        />
                        <text
                            x={tooltip.x}
                            y={tooltip.y - 24}
                            textAnchor="middle"
                            fontSize="9"
                            fill="#E8EAF6"
                            fontWeight="bold"
                        >
                            {tooltip.ward.name.split(' – ')[1]}
                        </text>
                        <text
                            x={tooltip.x}
                            y={tooltip.y - 12}
                            textAnchor="middle"
                            fontSize="8"
                            fill="#6B7399"
                        >
                            {tooltip.ward.activeCases} cases · Score: {tooltip.ward.riskScore}
                        </text>
                    </g>
                )}
            </svg>

            {/* Attribution */}
            <div className="absolute bottom-2 right-2 text-[9px] text-nk-muted/30 font-mono">
                SVG HEATMAP · Replace with Mapbox GL JS in prod
            </div>
        </div>
    );
}
