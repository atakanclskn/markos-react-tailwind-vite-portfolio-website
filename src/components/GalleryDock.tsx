'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const CATEGORIES = [
    { slug: 'landscape', label: 'Landscape' },
    { slug: 'portrait', label: 'Portrait' },
    { slug: 'animal', label: 'Animal' },
    { slug: 'fashion', label: 'Fashion' },
    { slug: 'product', label: 'Product' },
    { slug: 'party-wedding', label: 'Party & Wedding' },
    { slug: 'b-w', label: 'B&W' },
];

interface GalleryDockProps {
    activeCategory: string;
}

export default function GalleryDock({ activeCategory }: GalleryDockProps) {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <motion.div
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div
                className="flex items-center gap-1.5 rounded-full px-3 py-2.5 shadow-2xl sm:gap-2 sm:px-4"
                style={{
                    backgroundColor: theme === 'dark'
                        ? 'rgba(20, 20, 20, 0.85)'
                        : 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: theme === 'dark'
                        ? '0 25px 50px -12px rgba(0,0,0,0.6)'
                        : '0 25px 50px -12px rgba(0,0,0,0.15)',
                }}
            >
                {CATEGORIES.map((cat) => {
                    const isActive = cat.slug === activeCategory;
                    return (
                        <button
                            key={cat.slug}
                            onClick={() => router.push(`/gallery/${cat.slug}`)}
                            className="relative rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: isActive
                                    ? '#000'
                                    : theme === 'dark'
                                        ? 'rgba(255,255,255,0.5)'
                                        : 'rgba(0,0,0,0.5)',
                            }}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="dock-active-pill"
                                    className="absolute inset-0 rounded-full"
                                    style={{ backgroundColor: 'var(--color-brand)' }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                />
                            )}
                            <span className="relative z-10">{cat.label}</span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
