'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        function handleScroll() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollPercent);
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="absolute bottom-0 left-0 h-[2px] w-full">
            <div
                className="h-full transition-all duration-150 ease-out"
                style={{
                    width: `${progress}%`,
                    backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
                }}
            />
        </div>
    );
}
