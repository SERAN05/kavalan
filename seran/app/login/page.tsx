'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DEMO_ACCOUNTS = [
    { email: 'admin@neervazh.gov.in', password: 'admin123', role: 'Admin' },
    { email: 'worker@neervazh.gov.in', password: 'worker123', role: 'Health Worker' },
];

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const ok = await login(email, password);
        setLoading(false);
        if (ok) {
            router.push('/dashboard');
        } else {
            setError('Invalid credentials. Use the demo accounts below.');
        }
    };

    const fillDemo = (acct: (typeof DEMO_ACCOUNTS)[0]) => {
        setEmail(acct.email);
        setPassword(acct.password);
        setError('');
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{
                background: 'radial-gradient(ellipse at 60% 20%, rgba(41,94,201,0.18) 0%, #010A39 60%)',
            }}
        >
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(41,94,201,1) 1px, transparent 1px), linear-gradient(90deg, rgba(41,94,201,1) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 stagger-1">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                          bg-nk-accent/20 border border-nk-accent/30 mb-4 animate-glow-pulse">
                        <Shield size={24} className="text-nk-accent" />
                    </div>
                    <h1 className="text-2xl font-bold text-nk-text">Neervazh Kavalan</h1>
                    <p className="text-sm text-nk-muted mt-1">
                        Waterborne Disease Surveillance Platform
                    </p>
                </div>

                {/* Login card */}
                <div className="glass-card p-8 stagger-2">
                    <h2 className="text-base font-semibold text-nk-text mb-6">Sign in to continue</h2>

                    {error && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg
                            bg-red-500/10 border border-red-500/30 text-xs text-red-400
                            animate-fade-in">
                            <AlertCircle size={13} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-nk-muted mb-1.5">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@neervazh.gov.in"
                                autoComplete="email"
                                className="w-full px-3 py-2.5 text-sm rounded-lg bg-nk-border/40
                           border border-nk-border text-nk-text placeholder:text-nk-muted/50
                           focus:outline-none focus:ring-2 focus:ring-nk-accent/50
                           focus:border-nk-accent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-nk-muted mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full px-3 py-2.5 text-sm rounded-lg bg-nk-border/40
                             border border-nk-border text-nk-text placeholder:text-nk-muted/50
                             focus:outline-none focus:ring-2 focus:ring-nk-accent/50
                             focus:border-nk-accent transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    aria-label={showPw ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nk-muted
                             hover:text-nk-text transition-colors"
                                >
                                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-nk-accent text-white font-semibold
                         text-sm flex items-center justify-center gap-2 hover:bg-nk-accent-glow
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-nk-accent focus:ring-offset-2
                         focus:ring-offset-nk-bg"
                        >
                            {loading
                                ? <><Loader2 size={14} className="animate-spin" /> Authenticating…</>
                                : 'Sign In'
                            }
                        </button>
                    </form>
                </div>

                {/* Demo accounts */}
                <div className="mt-4 glass-card p-4 stagger-3">
                    <p className="text-[10px] font-semibold text-nk-muted uppercase tracking-wider mb-2">
                        Demo Accounts (Pilot)
                    </p>
                    <div className="space-y-2">
                        {DEMO_ACCOUNTS.map(acct => (
                            <button
                                key={acct.email}
                                onClick={() => fillDemo(acct)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg
                           bg-nk-border/30 hover:bg-nk-accent/10 border border-nk-border
                           hover:border-nk-accent/40 transition-all text-left group"
                            >
                                <div>
                                    <p className="text-xs text-nk-text font-medium">{acct.role}</p>
                                    <p className="text-[10px] text-nk-muted font-mono">{acct.email}</p>
                                </div>
                                <span className="text-[10px] text-nk-accent opacity-0 group-hover:opacity-100
                                 transition-opacity">
                                    Use →
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-center text-[10px] text-nk-muted/40 mt-6">
                    PILOT MVP · Not for production use · v0.1.0
                </p>
            </div>
        </div>
    );
}
