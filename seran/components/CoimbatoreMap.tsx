'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Map, Layers, ZoomIn, ZoomOut, RefreshCw, Info } from 'lucide-react';
import { COIMBATORE_ZONES, COIMBATORE_GEOJSON, type CoimbatoreZone } from '@/lib/coimbatore-zones';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// ─── Risk colour helpers ────────────────────────────────────────────────────
function riskColor(score: number, colorBlind = false, alpha = 1): string {
    const level = score >= 65 ? 'high' : score >= 40 ? 'medium' : 'low';
    if (colorBlind) {
        return level === 'high'
            ? `rgba(255,176,0,${alpha})`
            : level === 'medium'
                ? `rgba(220,50,32,${alpha})`
                : `rgba(0,90,181,${alpha})`;
    }
    return level === 'high'
        ? `rgba(239,68,68,${alpha})`
        : level === 'medium'
            ? `rgba(245,158,11,${alpha})`
            : `rgba(34,197,94,${alpha})`;
}

function riskLabel(score: number) {
    return score >= 65 ? 'HIGH' : score >= 40 ? 'MED' : 'LOW';
}

// ─── Mini Tooltip ───────────────────────────────────────────────────────────
function ZoneTooltip({ zone }: { zone: CoimbatoreZone }) {
    const { colorBlindMode } = useTheme();
    const color = riskColor(zone.riskScore, colorBlindMode);
    return (
        <div
            className="absolute z-[9999] pointer-events-none rounded-xl p-3 text-xs shadow-2xl
                 border border-white/10 min-w-[180px]"
            style={{ background: 'rgba(5,13,48,0.97)', backdropFilter: 'blur(12px)' }}
        >
            <div className="flex items-center gap-2 mb-2">
                <span
                    className="w-3 h-3 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                />
                <span className="font-bold text-white">{zone.zoneName} Zone</span>
                <span
                    className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}
                >
                    {riskLabel(zone.riskScore)}
                </span>
            </div>
            <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                    <span className="text-white/50">Risk Score</span>
                    <span className="font-mono font-bold" style={{ color }}>{zone.riskScore}/100</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/50">Active Cases</span>
                    <span className="font-mono text-white">{zone.activeCases}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/50">Population</span>
                    <span className="font-mono text-white">{zone.population.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/50">Turbidity</span>
                    <span className="font-mono text-white">{zone.turbidity} NTU</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-white/50">pH</span>
                    <span className="font-mono text-white">{zone.ph}</span>
                </div>
            </div>
            <p className="mt-2 text-[9px] text-white/30 truncate">{zone.key_area}</p>
            <p className="text-[9px] text-white/40 mt-1">Click for full details</p>
        </div>
    );
}

// ─── Mode Toggle ─────────────────────────────────────────────────────────────
function MapModeToggle({
    mode,
    onChange,
}: {
    mode: 'heatmap' | 'normal';
    onChange: (m: 'heatmap' | 'normal') => void;
}) {
    return (
        <div
            className="absolute top-3 right-3 z-[1000] flex items-center gap-0.5 p-1 rounded-xl
                 border border-white/10"
            style={{ background: 'rgba(5,13,48,0.95)', backdropFilter: 'blur(10px)' }}
        >
            {(['heatmap', 'normal'] as const).map(m => (
                <button
                    key={m}
                    onClick={() => onChange(m)}
                    aria-pressed={mode === m}
                    className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
                        'transition-all duration-300 capitalize',
                        mode === m
                            ? 'bg-[#295EC9] text-white shadow-lg'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                >
                    {m === 'heatmap' ? <Layers size={11} /> : <Map size={11} />}
                    {m === 'heatmap' ? 'Heatmap' : 'Normal Map'}
                </button>
            ))}
        </div>
    );
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface CoimbatoreMapProps {
    onZoneClick?: (zoneId: string) => void;
}

// ─── Main Map Component ──────────────────────────────────────────────────────
export function CoimbatoreMap({ onZoneClick }: CoimbatoreMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<any>(null);
    const geoLayerRef = useRef<any>(null);
    const tileLayerRef = useRef<any>(null);
    const [mapMode, setMapMode] = useState<'heatmap' | 'normal'>('heatmap');
    const [hoveredZone, setHoveredZone] = useState<CoimbatoreZone | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [mapReady, setMapReady] = useState(false);
    const [pulse, setPulse] = useState(false);
    const { colorBlindMode } = useTheme();

    // ── Initialize Leaflet map ────────────────────────────────────────────────
    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return;

        // Dynamically import leaflet (SSR-safe)
        import('leaflet').then(L => {
            // Fix default icon paths
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            // Coimbatore center
            const map = L.map(mapRef.current!, {
                center: [11.0168, 76.9558],
                zoom: 12,
                zoomControl: false,
                attributionControl: false,
            });

            leafletMapRef.current = map;

            // Dark tile for heatmap mode (CartoDB Dark Matter)
            const darkTile = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                { maxZoom: 19, opacity: 0.85 }
            );

            // Normal OSM tiles
            const normalTile = L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { maxZoom: 19, opacity: 1 }
            );

            tileLayerRef.current = { dark: darkTile, normal: normalTile };
            darkTile.addTo(map);

            // Labels layer (goes on top of heatmap)
            const labelsLayer = L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
                { maxZoom: 19, opacity: 0.7, pane: 'shadowPane' }
            );
            labelsLayer.addTo(map);

            // Attribution
            L.control
                .attribution({ prefix: '© OpenStreetMap · CartoDB' })
                .addTo(map);

            setMapReady(true);
        });

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, []);

    // ── Draw GeoJSON zones ────────────────────────────────────────────────────
    const drawZones = useCallback(
        (L: any, mode: 'heatmap' | 'normal', cbMode: boolean) => {
            if (!leafletMapRef.current) return;

            if (geoLayerRef.current) {
                geoLayerRef.current.remove();
                geoLayerRef.current = null;
            }

            if (mode === 'normal') return; // no zone overlay in normal mode

            const layer = L.geoJSON(COIMBATORE_GEOJSON, {
                style: (feature: any) => {
                    const score = feature.properties.riskScore as number;
                    const fill = riskColor(score, cbMode, 0.45);
                    const stroke = riskColor(score, cbMode, 0.9);
                    return {
                        fillColor: fill,
                        color: stroke,
                        weight: 2.5,
                        opacity: 1,
                        fillOpacity: 0.45,
                        dashArray: '0',
                    };
                },
                onEachFeature: (feature: any, lyr: any) => {
                    const zone = COIMBATORE_ZONES.find(z => z.id === feature.properties.id);
                    if (!zone) return;

                    // Futuristic pulsing highlight on hover
                    lyr.on('mouseover', (e: any) => {
                        e.target.setStyle({
                            fillOpacity: 0.72,
                            weight: 3.5,
                            color: riskColor(zone.riskScore, cbMode, 1),
                            dashArray: '6 4',
                        });
                        e.target.bringToFront();
                        setHoveredZone(zone);
                        setTooltipPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
                    });

                    lyr.on('mousemove', (e: any) => {
                        setTooltipPos({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
                    });

                    lyr.on('mouseout', (e: any) => {
                        layer.resetStyle(e.target);
                        setHoveredZone(null);
                    });

                    lyr.on('click', () => {
                        onZoneClick?.(zone.id);
                        setPulse(true);
                        setTimeout(() => setPulse(false), 600);
                    });

                    // Permanent zone label
                    const bounds = lyr.getBounds();
                    const center = bounds.getCenter();
                    const score = zone.riskScore;
                    const labelColor = riskColor(score, cbMode, 1);

                    L.marker(center, {
                        icon: L.divIcon({
                            className: '',
                            html: `
                <div style="
                  font-family: 'Inter', 'JetBrains Mono', monospace;
                  font-size: 12px;
                  font-weight: 700;
                  color: #fff;
                  text-align: center;
                  text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 16px rgba(0,0,0,0.8);
                  white-space: nowrap;
                  pointer-events: none;
                  user-select: none;
                  line-height: 1.4;
                ">
                  <div style="letter-spacing: 0.05em;">${zone.zoneName}</div>
                  <div style="
                    font-size: 18px;
                    color: ${labelColor};
                    font-weight: 800;
                    text-shadow: 0 0 12px ${labelColor}99;
                    margin-top: 2px;
                  ">${score}</div>
                  <div style="
                    font-size: 9px;
                    letter-spacing: 0.15em;
                    color: ${labelColor};
                    opacity: 0.85;
                    background: ${labelColor}22;
                    border: 1px solid ${labelColor}44;
                    border-radius: 999px;
                    padding: 1px 6px;
                    margin-top: 2px;
                    display: inline-block;
                  ">${riskLabel(score)}</div>
                </div>
              `,
                            iconSize: [100, 60],
                            iconAnchor: [50, 30],
                        }),
                        interactive: false,
                    }).addTo(leafletMapRef.current);
                },
            });

            layer.addTo(leafletMapRef.current);
            geoLayerRef.current = layer;
        },
        [onZoneClick]
    );

    // ── Switch tile layer on mode change ─────────────────────────────────────
    useEffect(() => {
        if (!mapReady || !leafletMapRef.current || !tileLayerRef.current) return;
        import('leaflet').then(L => {
            const map = leafletMapRef.current;
            const { dark, normal } = tileLayerRef.current;
            map.eachLayer((layer: any) => {
                if (
                    layer._url &&
                    (layer._url.includes('basemaps.cartocdn') ||
                        layer._url.includes('openstreetmap'))
                ) {
                    map.removeLayer(layer);
                }
            });

            if (mapMode === 'heatmap') {
                dark.addTo(map);
                const labels = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
                    { maxZoom: 19, opacity: 0.7 }
                );
                labels.addTo(map);
            } else {
                normal.addTo(map);
            }

            // Redraw zones
            drawZones(L, mapMode, colorBlindMode);
        });
    }, [mapMode, mapReady, colorBlindMode, drawZones]);

    // ── Zoom controls ─────────────────────────────────────────────────────────
    const zoomIn = () => leafletMapRef.current?.zoomIn();
    const zoomOut = () => leafletMapRef.current?.zoomOut();
    const resetView = () =>
        leafletMapRef.current?.flyTo([11.0168, 76.9558], 12, { duration: 1.2 });

    return (
        <div className="relative w-full rounded-xl overflow-hidden border border-nk-border"
            style={{ height: 480 }}>

            {/* Leaflet CSS */}
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            />

            {/* Map Container */}
            <div ref={mapRef} className="absolute inset-0 z-0" />

            {/* Mode Toggle */}
            <MapModeToggle mode={mapMode} onChange={setMapMode} />

            {/* Zoom Controls */}
            <div
                className="absolute top-3 left-3 z-[1000] flex flex-col gap-1"
                style={{ background: 'rgba(5,13,48,0.95)', backdropFilter: 'blur(10px)', borderRadius: 12, padding: 4 }}
            >
                <button
                    onClick={zoomIn}
                    aria-label="Zoom in"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60
                     hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ZoomIn size={14} />
                </button>
                <button
                    onClick={zoomOut}
                    aria-label="Zoom out"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60
                     hover:text-white hover:bg-white/10 transition-colors"
                >
                    <ZoomOut size={14} />
                </button>
                <div className="h-px bg-white/10 mx-1" />
                <button
                    onClick={resetView}
                    aria-label="Reset view"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60
                     hover:text-white hover:bg-white/10 transition-colors"
                >
                    <RefreshCw size={12} />
                </button>
            </div>

            {/* Heatmap Legend */}
            {mapMode === 'heatmap' && (
                <div
                    className="absolute bottom-6 left-3 z-[1000] p-3 rounded-xl text-xs"
                    style={{ background: 'rgba(5,13,48,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    <p className="text-[10px] text-white/50 mb-2 font-semibold uppercase tracking-widest">
                        Risk Level
                    </p>
                    {[
                        { label: 'High (≥65)', color: '#ef4444' },
                        { label: 'Medium (40–64)', color: '#f59e0b' },
                        { label: 'Low (<40)', color: '#22c55e' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-2 mb-1">
                            <span
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                            />
                            <span className="text-white/70">{item.label}</span>
                        </div>
                    ))}
                    <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-white/30">
                        Coimbatore Corporation · 6 Zones
                    </div>
                </div>
            )}

            {/* Score gradient bar (heatmap mode) */}
            {mapMode === 'heatmap' && (
                <div
                    className="absolute bottom-6 right-3 z-[1000] p-2 rounded-xl"
                    style={{ background: 'rgba(5,13,48,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    <p className="text-[9px] text-white/50 mb-1 text-center tracking-widest">RISK</p>
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[9px] text-[#ef4444] font-mono">100</span>
                        <div
                            className="w-3 rounded"
                            style={{
                                height: 60,
                                background: 'linear-gradient(to bottom, #ef4444, #f59e0b, #22c55e)',
                                boxShadow: '0 0 12px rgba(239,68,68,0.2), 0 0 12px rgba(34,197,94,0.2)',
                            }}
                        />
                        <span className="text-[9px] text-[#22c55e] font-mono">0</span>
                    </div>
                </div>
            )}

            {/* Loading indicator */}
            {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center z-10"
                    style={{ background: '#010A39' }}>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#295EC9] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-nk-muted">Loading Coimbatore map…</p>
                    </div>
                </div>
            )}

            {/* Mode info banner */}
            {mapReady && mapMode === 'normal' && (
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] px-3 py-1.5
                     rounded-full text-[11px] text-white/60 flex items-center gap-1.5"
                    style={{ background: 'rgba(5,13,48,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <Info size={11} />
                    Normal map view — switch to Heatmap to see risk zones
                </div>
            )}

            {/* Hover tooltip */}
            {hoveredZone && (
                <div
                    className="fixed z-[99999] pointer-events-none"
                    style={{
                        left: tooltipPos.x + 14,
                        top: tooltipPos.y - 10,
                        transform: tooltipPos.x > window.innerWidth - 220
                            ? 'translateX(-110%)'
                            : 'none',
                    }}
                >
                    <ZoneTooltip zone={hoveredZone} />
                </div>
            )}
        </div>
    );
}
