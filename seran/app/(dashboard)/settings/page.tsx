'use client';

import { useState } from 'react';
import { Settings, Eye, Key, Bell, Shield, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { colorBlindMode, toggleColorBlindMode } = useTheme();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [apiKeys] = useState({
        mapbox: '••••••••••••••••pk.eyJ1IjoibmVlcnZhemg',
        openweather: '••••••••••••••••••••••••••••••xx',
        backend: 'http://localhost:8000/api/v1',
    });

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold text-nk-text flex items-center gap-2">
                    <Settings size={18} className="text-nk-accent" />
                    Settings
                </h1>
                <p className="text-xs text-nk-muted mt-0.5">
                    Manage appearance, accessibility, and API configuration.
                </p>
            </div>

            {/* Appearance */}
            <section className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-nk-text flex items-center gap-2">
                    <Monitor size={14} className="text-nk-accent" />
                    Appearance
                </h2>

                {/* Theme indicator */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-nk-text">Theme</p>
                        <p className="text-xs text-nk-muted">Midnight Tech (dark)</p>
                    </div>
                    <div className="flex gap-1.5">
                        {['#010A39', '#080908', '#295EC9'].map(c => (
                            <div
                                key={c}
                                className="w-5 h-5 rounded-full border border-nk-border"
                                style={{ background: c }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>

                <div className="border-t border-nk-border" />

                {/* Color-blind toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-nk-text flex items-center gap-2">
                            <Eye size={13} className="text-nk-muted" />
                            Color-Blind Safe Mode
                        </p>
                        <p className="text-xs text-nk-muted mt-0.5">
                            Replaces hue-only cues with pattern + shape overlays (deuteranopia-safe)
                        </p>
                    </div>
                    <button
                        role="switch"
                        aria-checked={colorBlindMode}
                        aria-label="Toggle color-blind safe mode"
                        onClick={toggleColorBlindMode}
                        className={cn(
                            'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0',
                            colorBlindMode ? 'bg-nk-accent' : 'bg-nk-border'
                        )}
                    >
                        <span
                            className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                                colorBlindMode ? 'translate-x-5' : 'translate-x-0.5'
                            )}
                        />
                    </button>
                </div>

                {colorBlindMode && (
                    <div className="rounded-lg bg-nk-accent/5 border border-nk-accent/20 p-3
                          text-xs text-nk-muted animate-fade-in">
                        ✓ Color-blind mode active — risk levels now use blue/red/yellow with patterns.
                    </div>
                )}
            </section>

            {/* Notifications */}
            <section className="glass-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-nk-text flex items-center gap-2">
                    <Bell size={14} className="text-nk-accent" />
                    Notifications
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-nk-text">Alert Notifications</p>
                        <p className="text-xs text-nk-muted">Receive in-app alerts for new high-risk events</p>
                    </div>
                    <button
                        role="switch"
                        aria-checked={notifications}
                        aria-label="Toggle alert notifications"
                        onClick={() => setNotifications(v => !v)}
                        className={cn(
                            'relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0',
                            notifications ? 'bg-nk-accent' : 'bg-nk-border'
                        )}
                    >
                        <span
                            className={cn(
                                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                                notifications ? 'translate-x-5' : 'translate-x-0.5'
                            )}
                        />
                    </button>
                </div>
            </section>

            {/* Account */}
            <section className="glass-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-nk-text flex items-center gap-2">
                    <Shield size={14} className="text-nk-accent" />
                    Account
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                        <p className="text-nk-muted mb-0.5">Name</p>
                        <p className="text-nk-text font-medium">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-nk-muted mb-0.5">Role</p>
                        <p className="text-nk-text font-medium capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-nk-muted mb-0.5">Email</p>
                        <p className="text-nk-text font-mono">{user?.email}</p>
                    </div>
                </div>
            </section>

            {/* API Keys (mock, admin only) */}
            {user?.role === 'admin' && (
                <section className="glass-card p-5 space-y-4">
                    <h2 className="text-sm font-semibold text-nk-text flex items-center gap-2">
                        <Key size={14} className="text-nk-accent" />
                        API Configuration
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15
                             text-amber-400 border border-amber-500/30 ml-auto">MOCK</span>
                    </h2>
                    {Object.entries(apiKeys).map(([key, val]) => (
                        <div key={key}>
                            <label className="text-xs text-nk-muted block mb-1 capitalize">
                                {key.replace('_', ' ')} {key === 'backend' ? 'URL' : 'API Key'}
                            </label>
                            <input
                                type="text"
                                defaultValue={val}
                                readOnly
                                className="w-full px-3 py-2 rounded-lg bg-nk-border/40 border border-nk-border
                           text-nk-muted text-xs font-mono focus:outline-none cursor-default"
                                aria-label={`${key} API key`}
                            />
                        </div>
                    ))}
                    <p className="text-[10px] text-nk-muted/60">
                        Replace these values in <code className="font-mono text-nk-accent">.env.local</code> for production.
                    </p>
                </section>
            )}
        </div>
    );
}
