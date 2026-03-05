'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useGalleryStore } from '@/store/galleryStore';
import GalleryDock from '@/components/GalleryDock';
import { getCategories } from '@/lib/firestore';

export default function GalleryPersistentUI({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme } = useTheme();
    const direction = useGalleryStore(state => state.direction);

    // Extract category slug from pathname e.g. /gallery/landscape -> landscape
    const categorySlug = pathname?.split('/').pop() || '';

    const [categoryLabel, setCategoryLabel] = useState<string>('');

    // Update label when categorySlug changes
    useEffect(() => {
        if (!categorySlug) return;
        setCategoryLabel(categorySlug.replace('-', ' ')); // fallback
        getCategories().then((cats) => {
            const currentCat = cats.find(c => c.slug === categorySlug);
            if (currentCat) {
                setCategoryLabel(currentCat.name);
            }
        });
    }, [categorySlug]);

    return (
        <div className="relative min-h-screen pb-24 overflow-x-hidden">
            {/* Persistent Back button + category title */}
            {categorySlug && (
                <motion.header
                    className="fixed top-0 left-0 z-40 flex w-full items-center justify-between px-6 py-5 md:px-12 pointer-events-none"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                        background: theme === 'dark'
                            ? 'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 100%)'
                            : 'linear-gradient(to bottom, rgba(250,250,250,0.9) 0%, transparent 100%)',
                    }}
                >
                    {/* Back button */}
                    <button
                        onClick={() => router.push('/')}
                        className="pointer-events-auto flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
                        style={{
                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                        }}
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span
                            className="text-sm font-medium tracking-wider uppercase"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                        >
                            Geri
                        </span>
                    </button>

                    {/* Category name (Crossfades when changing category) */}
                    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex justify-center">
                        <AnimatePresence mode="popLayout">
                            <motion.h1
                                key={categoryLabel}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="text-lg font-bold tracking-wider uppercase sm:text-xl text-center whitespace-nowrap"
                                style={{
                                    fontFamily: 'var(--font-outfit)',
                                    color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                }}
                            >
                                {categoryLabel}
                            </motion.h1>
                        </AnimatePresence>
                    </div>

                    {/* Spacer for centering */}
                    <div className="w-16 pointer-events-none" />
                </motion.header>
            )}

            {/* Page Content transitions */}
            <div className="w-full pt-20 min-h-[70vh]">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                        key={pathname}
                        custom={direction}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        variants={{
                            enter: (dir: number) => ({
                                x: dir > 0 ? '100vw' : '-100vw',
                                opacity: 1,
                            }),
                            center: {
                                x: 0,
                                opacity: 1,
                            },
                            exit: (dir: number) => ({
                                x: dir > 0 ? '-100vw' : '100vw',
                                opacity: 1,
                            }),
                        }}
                        transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1] // Premium smooth easing
                        }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Gallery Dock */}
            {categorySlug && (
                <div className="pointer-events-auto">
                    <GalleryDock activeCategory={categorySlug} />
                </div>
            )}
        </div>
    );
}
