'use client';

import { useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen" style={{ background: '#010A39' }}>
            <TopNav
                onMenuToggle={() => setSidebarOpen(v => !v)}
                sidebarOpen={sidebarOpen}
            />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content shifted right by sidebar width on large screens */}
            <main
                className="pt-14 lg:pl-56 min-h-screen transition-all duration-300"
                id="main-content"
                tabIndex={-1}
            >
                {children}
            </main>
        </div>
    );
}
