'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Theme } from '@/types';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('markos-theme') as Theme) || 'dark';
        }
        return 'dark';
    });

    // Sync body class when theme changes
    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
        }
    }, [theme]);

    const toggleTheme = useCallback((event?: React.MouseEvent) => {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        // Apply theme change immediately with a smooth CSS transition
        // instead of circular reveal which causes white flash
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

        if (newTheme === 'light') {
            document.body.classList.add('light');
        } else {
            document.body.classList.remove('light');
        }

        setTheme(newTheme);
        localStorage.setItem('markos-theme', newTheme);

        // Clean up transition style after animation completes
        setTimeout(() => {
            document.body.style.transition = '';
        }, 600);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
