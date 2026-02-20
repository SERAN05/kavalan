'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard, Upload, Bell, Map, FileText,
    Settings, ChevronRight, Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    roles?: string[];
    badge?: number;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload', href: '/upload', icon: Upload, roles: ['admin', 'health_worker'] },
    { label: 'Alerts', href: '/alerts', icon: Bell, badge: 2 },
    { label: 'Ward Map', href: '/dashboard', icon: Map },
    { label: 'Analytics', href: '/dashboard', icon: Activity },
    { label: 'Docs', href: '/docs', icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    const navigate = (href: string) => {
        router.push(href);
        onClose();
    };

    const visibleItems = NAV_ITEMS.filter(
        item => !item.roles || (user?.role && item.roles.includes(user.role))
    );

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar panel */}
            <aside
                aria-label="Primary navigation"
                className={cn(
                    'fixed top-14 left-0 bottom-0 z-40 w-56 flex flex-col',
                    'border-r border-nk-border transition-transform duration-300',
                    'lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
                style={{ background: 'rgba(5,13,48,0.97)', backdropFilter: 'blur(10px)' }}
            >
                {/* Ward badge (health worker) */}
                {user?.ward && (
                    <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-nk-accent/10
                          border border-nk-accent/20 text-xs text-nk-accent">
                        Assigned: {user.ward}
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
                    {visibleItems.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href + i}
                                onClick={() => navigate(item.href)}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                                    'transition-all duration-200 group text-left',
                                    isActive
                                        ? 'nav-item-active text-nk-text font-medium'
                                        : 'text-nk-muted hover:text-nk-text hover:bg-white/5'
                                )}
                            >
                                <Icon size={16} className={cn(
                                    'shrink-0',
                                    isActive ? 'text-nk-accent' : 'group-hover:text-nk-accent transition-colors'
                                )} />
                                <span className="flex-1">{item.label}</span>
                                {item.badge && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20
                                   text-red-400 border border-red-500/30 font-mono">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <ChevronRight size={12} className="text-nk-accent shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-nk-border">
                    <p className="text-[10px] text-nk-muted/60 font-mono">PILOT v0.1.0</p>
                    <p className="text-[10px] text-nk-muted/40">© 2025 Neervazh Kavalan</p>
                </div>
            </aside>
        </>
    );
}
