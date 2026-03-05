'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useGalleryStore } from '@/store/galleryStore';
import { getCategories, prefetchPhotosForCategory } from '@/lib/firestore';

const FALLBACK_CATEGORIES = [
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
    const setDirection = useGalleryStore(state => state.setDirection);
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
    const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

    useEffect(() => {
        getCategories().then((cats) => {
            if (cats.length > 0) {
                setCategories(cats.map(c => ({ slug: c.slug, label: c.name })));
            }
        });
    }, []);

    const handleCategoryClick = async (slug: string) => {
        if (slug === activeCategory || navigatingTo) return;

        // Calculate direction: 1 for right, -1 for left
        const currentIndex = categories.findIndex(c => c.slug === activeCategory);
        const targetIndex = categories.findIndex(c => c.slug === slug);
        setDirection(targetIndex > currentIndex ? 1 : -1);

        setNavigatingTo(slug);
        try {
            // Prefetch the photos BEFORE triggering the route transition
            // This ensures the new page has data immediately upon mounting,
            // preventing a black screen flash.
            await prefetchPhotosForCategory(slug);
            router.push(`/gallery/${slug}`);
        } catch (error) {
            console.error("Error prefetching category:", error);
            // Fallback to normal navigation if prefetch fails
            router.push(`/gallery/${slug}`);
        } finally {
            setNavigatingTo(null);
        }
    };

    return (
        <motion.div
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div
                className="no-scrollbar flex max-w-[90vw] overflow-x-auto items-center gap-1.5 rounded-full px-3 py-2.5 shadow-2xl sm:max-w-none sm:gap-2 sm:px-4 sm:overflow-visible"
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
                {categories.map((cat) => {
                    const isActive = cat.slug === activeCategory;
                    const isNavigatingToThis = cat.slug === navigatingTo;

                    return (
                        <button
                            key={cat.slug}
                            onClick={() => handleCategoryClick(cat.slug)}
                            disabled={!!navigatingTo}
                            className={`relative flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${isNavigatingToThis ? 'animate-pulse opacity-70' : ''
                                }`}
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: isActive
                                    ? '#000'
                                    : theme === 'dark'
                                        ? 'rgba(255,255,255,0.5)'
                                        : 'rgba(0,0,0,0.5)',
                            }}
                        >
                            {isActive && !isNavigatingToThis && (
                                <motion.span
                                    layoutId="dock-active-pill"
                                    className="absolute inset-0 rounded-full"
                                    style={{ backgroundColor: 'var(--color-brand)' }}
                                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                                />
                            )}
                            <span className="relative z-10">
                                {isNavigatingToThis ? 'Loading...' : cat.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
