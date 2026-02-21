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

        // Get click coordinates for circular reveal
        const cx = event ? `${event.clientX}px` : '50%';
        const cy = event ? `${event.clientY}px` : '50%';

        // Create the overlay element for transition
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.setProperty('--cx', cx);
        overlay.style.setProperty('--cy', cy);
        overlay.style.backgroundColor =
            newTheme === 'dark' ? 'var(--color-surface-dark)' : 'var(--color-surface-light)';
        document.body.appendChild(overlay);

        // Trigger the expansion animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // Apply the theme after a short delay so the overlay covers the transition
        setTimeout(() => {
            if (newTheme === 'light') {
                document.body.classList.add('light');
            } else {
                document.body.classList.remove('light');
            }
            setTheme(newTheme);
            localStorage.setItem('markos-theme', newTheme);
        }, 400);

        // Remove the overlay after the animation completes
        setTimeout(() => {
            overlay.remove();
        }, 1000);
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
