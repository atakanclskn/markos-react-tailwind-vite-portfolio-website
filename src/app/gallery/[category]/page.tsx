'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import GalleryDock from '@/components/GalleryDock';
import { getCategories, getPhotosByCategory } from '@/lib/firestore';
import type { Photo, Category } from '@/types';

export default function GalleryPage() {
    const params = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const categorySlug = params.category as string;

    const [categoryLabel, setCategoryLabel] = useState(categorySlug);
    const [images, setImages] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                // Get all categories to find current one and its label
                const cats = await getCategories();
                const currentCat = cats.find(c => c.slug === categorySlug);
                if (currentCat) {
                    setCategoryLabel(currentCat.name);
                    const photos = await getPhotosByCategory(currentCat.id!);
                    setImages(photos);
                }
            } catch (e) {
                console.error('Error fetching gallery photos:', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [categorySlug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
            </div>
        );
    }

    if (!images.length) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p
                    className="text-lg"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    }}
                >
                    No photos in this category yet
                </p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-24">
            {/* Back button + category title */}
            <motion.header
                className="fixed top-0 left-0 z-40 flex w-full items-center justify-between px-6 py-5 md:px-12"
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
                    className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
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

                {/* Category name */}
                <h1
                    className="text-lg font-bold tracking-wider uppercase sm:text-xl"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                    }}
                >
                    {categoryLabel}
                </h1>

                {/* Spacer for centering */}
                <div className="w-16" />
            </motion.header>

            {/* Immersive photo feed */}
            <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6">
                {images.map((photo, index) => (
                    <motion.div
                        key={photo.id || index}
                        className="mb-6 overflow-hidden rounded-xl sm:mb-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                    >
                        <motion.img
                            src={photo.storageUrl}
                            alt={`${categoryLabel} - ${index + 1}`}
                            className="w-full object-cover"
                            style={{
                                filter: categorySlug === 'b-w' ? 'grayscale(100%)' : 'none',
                            }}
                            loading="lazy"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Gallery Dock */}
            <GalleryDock activeCategory={categorySlug} />
        </div>
    );
}
