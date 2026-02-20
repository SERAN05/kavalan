'use client';

import { Shield, Bell, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MOCK_ALERTS } from '@/lib/mock-data';

interface TopNavProps {
    onMenuToggle?: () => void;
    sidebarOpen?: boolean;
}

export function TopNav({ onMenuToggle, sidebarOpen }: TopNavProps) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const unackedCount = MOCK_ALERTS.filter(a => !a.acknowledged).length;

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav
            role="navigation"
            aria-label="Top navigation"
            className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3
                 border-b border-nk-border"
            style={{ background: 'rgba(1,10,57,0.95)', backdropFilter: 'blur(10px)' }}
        >
            {/* Hamburger (mobile) */}
            <button
                onClick={onMenuToggle}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                className="lg:hidden p-2 rounded-lg text-nk-muted hover:text-nk-text
                   hover:bg-white/5 transition-colors"
            >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 flex-1">
                <div className="w-7 h-7 rounded-lg bg-nk-accent flex items-center justify-center
                        animate-glow-pulse">
                    <Shield size={14} className="text-white" />
                </div>
                <div>
                    <span className="font-semibold text-sm text-nk-text tracking-wide">
                        NEERVAZH
                    </span>
                    <span className="ml-1 font-light text-sm text-nk-muted">KAVALAN</span>
                </div>
                <span className="hidden sm:inline ml-2 text-xs px-2 py-0.5 rounded-full
                         bg-nk-accent/20 text-nk-accent border border-nk-accent/30 font-mono">
                    PILOT MVP
                </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
                {/* Alerts bell */}
                <button
                    onClick={() => router.push('/alerts')}
                    aria-label={`${unackedCount} unacknowledged alerts`}
                    className="relative p-2 rounded-lg text-nk-muted hover:text-nk-text
                     hover:bg-white/5 transition-colors"
                >
                    <Bell size={18} />
                    {unackedCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500
                             text-white text-[10px] flex items-center justify-center font-bold">
                            {unackedCount}
                        </span>
                    )}
                </button>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(v => !v)}
                        aria-label="User menu"
                        aria-expanded={showUserMenu}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                       hover:bg-white/5 transition-colors"
                    >
                        <div className="w-7 h-7 rounded-full bg-nk-accent/30 border border-nk-accent/50
                            flex items-center justify-center">
                            <User size={14} className="text-nk-accent" />
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-medium text-nk-text leading-none">{user?.name ?? 'Guest'}</p>
                            <p className="text-[10px] text-nk-muted capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-44 glass-card py-1
                            shadow-xl animate-fade-in z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm
                           text-nk-muted hover:text-red-400 hover:bg-red-500/10
                           transition-colors"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
