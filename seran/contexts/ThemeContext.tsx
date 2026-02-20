'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
    colorBlindMode: boolean;
    toggleColorBlindMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    colorBlindMode: false,
    toggleColorBlindMode: () => { },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [colorBlindMode, setColorBlindMode] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('nk_colorblind');
        if (stored === 'true') setColorBlindMode(true);
    }, []);

    const toggleColorBlindMode = () => {
        setColorBlindMode(prev => {
            const next = !prev;
            localStorage.setItem('nk_colorblind', String(next));
            if (next) {
                document.documentElement.classList.add('colorblind-mode');
            } else {
                document.documentElement.classList.remove('colorblind-mode');
            }
            return next;
        });
    };

    useEffect(() => {
        if (colorBlindMode) {
            document.documentElement.classList.add('colorblind-mode');
        }
        return () => {
            document.documentElement.classList.remove('colorblind-mode');
        };
    }, [colorBlindMode]);

    return (
        <ThemeContext.Provider value={{ colorBlindMode, toggleColorBlindMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
