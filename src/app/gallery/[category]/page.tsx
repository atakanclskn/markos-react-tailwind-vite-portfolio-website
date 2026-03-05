'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getCategories, getPhotosByCategory } from '@/lib/firestore';
import type { Photo } from '@/types';

export default function GalleryPage() {
    const params = useParams();
    const { theme } = useTheme();
    const categorySlug = params.category as string;

    const [categoryLabel, setCategoryLabel] = useState(categorySlug);
    const [images, setImages] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
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

    // Removed full-screen loading spinner.
    // We will handle loading state gracefully by fading the grid instead.

    if (!loading && images.length === 0) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p
                    className="text-lg text-center"
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
        <div
            className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
        >
            {images.map((photo, index) => (
                <motion.div
                    key={photo.id || index}
                    className="group relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 aspect-square"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.03 }}
                >
                    <img
                        src={photo.storageUrl}
                        alt={`${categoryLabel} - ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                            filter: categorySlug === 'b-w' ? 'grayscale(100%)' : 'none',
                        }}
                        loading="lazy"
                    />

                    {/* Premium Hover Text Overlay */}
                    <div
                        className={`absolute inset-0 flex flex-col justify-end p-6 md:p-10 transition-opacity duration-500 ${photo.description ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}
                        style={{
                            background: photo.description ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' : 'none'
                        }}
                    >
                        <div className="transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0 text-white">
                            <>
                                <h3
                                    className="text-lg md:text-xl lg:text-2xl font-medium mb-1 md:mb-2 tracking-tight"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {photo.description}
                                </h3>
                            </>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
