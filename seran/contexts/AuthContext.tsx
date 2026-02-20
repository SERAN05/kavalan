'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'health_worker' | null;

interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    ward?: string;
}

interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
    'admin@neervazh.gov.in': {
        id: '1',
        name: 'Dr. Anbu Selvam',
        email: 'admin@neervazh.gov.in',
        role: 'admin',
        password: 'admin123',
    },
    'worker@neervazh.gov.in': {
        id: '2',
        name: 'Priya Murugan',
        email: 'worker@neervazh.gov.in',
        role: 'health_worker',
        ward: 'Ward A',
        password: 'worker123',
    },
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => false,
    logout: () => { },
    isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('nk_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch { }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 600)); // simulate network
        const found = MOCK_USERS[email.toLowerCase()];
        if (found && found.password === password) {
            const { password: _pw, ...authUser } = found;
            setUser(authUser);
            sessionStorage.setItem('nk_user', JSON.stringify(authUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('nk_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
