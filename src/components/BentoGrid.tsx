'use client';

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';
import { getCategories, getPhotosByCategory, getBentoGridSettings } from '@/lib/firestore';
import type { Category, Photo, BentoGridSettings } from '@/types';

// Remove FALLBACK_CATEGORIES to prevent layout snapping on load

// Default animation settings (used as fallback or initial fast render)
const DEFAULT_SETTINGS: BentoGridSettings = {
    animationIntervalSeconds: 12,
};

type CategoryWithImages = { id: string; title: string; images: string[] };

// Rastgele flex ağırlıkları üreten yardımcı fonksiyon
const getRandomWeights = (count: number) => {
    return Array.from({ length: count }, () => Math.random() * 2 + 1); // 1 ile 3 arası değerler
};

interface BentoGridProps {
    onCategoryClick: (category: string) => void;
}

function GridItem({
    category,
    weight,
    onClick,
    isDark,
    baseIntervalS
}: {
    category: CategoryWithImages,
    weight: number,
    onClick: (category: string) => void,
    isDark: boolean,
    baseIntervalS: number,
}) {
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        const minMs = Math.max(3, baseIntervalS - 2) * 1000;
        const maxMs = (baseIntervalS + 4) * 1000;
        const intervalTime = Math.random() * (maxMs - minMs) + minMs;
        const timer = setInterval(() => {
            setImgIndex((prev) => (prev + 1) % category.images.length);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [category.images.length, baseIntervalS]);

    return (
        <motion.div
            layout
            animate={{ flex: weight }}
            transition={{ duration: 4, ease: "easeInOut" }}
            onClick={() => onClick(category.id)}
            className={`relative h-full overflow-hidden group cursor-pointer ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}
        >
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={imgIndex}
                    src={category.images[imgIndex]}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    referrerPolicy="no-referrer"
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            <motion.div
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />

            <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10">
                <div className="w-8 h-[1px] bg-white/50 group-hover:w-16 group-hover:bg-white transition-all duration-700 ease-out" />
                <span className="text-white font-medium tracking-[0.2em] uppercase text-xs md:text-sm drop-shadow-lg">
                    {category.title}
                </span>
            </div>
        </motion.div>
    );
}

/* Mobile-only card with taller aspect ratio and better touch target */
function MobileGridItem({
    category,
    onClick,
    isDark,
    index,
    baseIntervalS
}: {
    category: CategoryWithImages;
    onClick: (category: string) => void;
    isDark: boolean;
    index: number;
    baseIntervalS: number;
}) {
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        const minMs = Math.max(3, baseIntervalS - 2) * 1000;
        const maxMs = (baseIntervalS + 4) * 1000;
        const intervalTime = Math.random() * (maxMs - minMs) + minMs;
        const timer = setInterval(() => {
            setImgIndex((prev) => (prev + 1) % category.images.length);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [category.images.length, baseIntervalS]);

    return (
        <motion.div
            onClick={() => onClick(category.id)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer active:scale-[0.97] transition-transform duration-200 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}
            style={{ aspectRatio: index === 0 ? '16/12' : '3/4' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={imgIndex}
                    src={category.images[imgIndex]}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    referrerPolicy="no-referrer"
                />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-[1px] bg-white/60" />
                    <span className="text-white font-medium tracking-[0.15em] uppercase text-sm drop-shadow-lg">
                        {category.title}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// Helper to calculate dynamic rows of max length
function calculateRows<T>(items: T[], maxPerRow: number): T[][] {
    const rows: T[][] = [];
    const numRows = Math.ceil(items.length / maxPerRow);
    if (numRows === 0) return rows;

    const baseCount = Math.floor(items.length / numRows);
    let remainder = items.length % numRows;
    let startIndex = 0;

    for (let i = 0; i < numRows; i++) {
        const rowSize = baseCount + (remainder > 0 ? 1 : 0);
        remainder--;
        rows.push(items.slice(startIndex, startIndex + rowSize));
        startIndex += rowSize;
    }
    return rows;
}

export default function BentoGrid({ onCategoryClick }: BentoGridProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [categories, setCategories] = useState<CategoryWithImages[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<BentoGridSettings>(DEFAULT_SETTINGS);
    const [rowWeights, setRowWeights] = useState<number[][]>([]);

    const gridRows = useMemo(() => calculateRows(categories, 4), [categories]);

    // Fetch categories and their photos from Firestore
    useEffect(() => {
        (async () => {
            try {
                // Also fetch animation settings
                const customSettings = await getBentoGridSettings();
                if (customSettings) {
                    setSettings(customSettings);
                }

                const cats = await getCategories();
                if (cats.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const withImages: CategoryWithImages[] = await Promise.all(
                    cats.map(async (cat) => {
                        let images: string[] = [];
                        try {
                            const photos = await getPhotosByCategory(cat.id!);
                            images = photos.slice(0, 3).map(p => p.storageUrl);
                        } catch (err) {
                            console.error(`Error fetching photos for category ${cat.name}:`, err);
                        }

                        // If category has no photos or fetch failed, use placeholder
                        if (images.length === 0) {
                            images.push(`https://picsum.photos/seed/${cat.slug}1/1200/800`);
                            images.push(`https://picsum.photos/seed/${cat.slug}2/1200/800`);
                            images.push(`https://picsum.photos/seed/${cat.slug}3/1200/800`);
                        }
                        return { id: cat.slug, title: cat.name, images };
                    })
                );

                console.log('--- BentoGrid withImages array ---', withImages.length, withImages.map(c => c.title));

                setCategories(withImages);
                // Initialize weights matching the calculated rows array
                const computedRows = calculateRows(withImages, 4);
                setRowWeights(computedRows.map(r => getRandomWeights(r.length)));
            } catch (e) {
                console.error('Error fetching categories for BentoGrid:', e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    // Grid karelerinin boyutlarını asenkron ve tek tek değiştiren effect
    useEffect(() => {
        if (gridRows.length === 0) return;

        const timers = gridRows.map((_, rowIndex) => {
            const intervalTime = (settings.animationIntervalSeconds + (rowIndex * 3)) * 1000;
            return setInterval(() => {
                setRowWeights((prev) => {
                    const next = [...prev];
                    if (!next[rowIndex]) return next;
                    const newRowWeights = [...next[rowIndex]];
                    if (newRowWeights.length === 0) return next;
                    const randomIndex = Math.floor(Math.random() * newRowWeights.length);
                    newRowWeights[randomIndex] = Math.random() * 2 + 1;
                    next[rowIndex] = newRowWeights;
                    return next;
                });
            }, intervalTime);
        });

        return () => timers.forEach(clearInterval);
    }, [gridRows.length, settings.animationIntervalSeconds]);

    if (isLoading) {
        return (
            <section id="categories" className="py-20 md:py-32 px-4 md:px-12 max-w-[1600px] mx-auto min-h-screen">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 w-64 bg-white/5 rounded-md" />
                    <div className="w-full aspect-video bg-white/5 rounded-3xl" />
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section id="categories" className="py-20 md:py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
            <div className="mb-10 md:mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6">
                <div>
                    <h2 className="text-3xl md:text-6xl font-bold tracking-tighter">
                        PORTFOLIO
                    </h2>
                    <div className="w-16 md:w-24 h-[1px] bg-[var(--color-foreground)] mt-4 md:mt-6 opacity-20" />
                </div>
                <p className="text-[var(--color-muted)] text-sm md:text-base max-w-sm md:text-right font-light tracking-wide leading-relaxed">
                    Discover our work across different disciplines. Each frame holds its own story.
                </p>
            </div>

            {/* Mobile: 2-column masonry-style grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
                {/* Split into two columns for masonry effect */}
                <div className="flex flex-col gap-3">
                    {categories.filter((_, i) => i % 2 === 0).map((cat, i) => (
                        <MobileGridItem
                            key={cat.id}
                            category={cat}
                            onClick={onCategoryClick}
                            isDark={isDark}
                            index={i * 2}
                            baseIntervalS={settings.animationIntervalSeconds}
                        />
                    ))}
                </div>
                <div className="flex flex-col gap-3 pt-6">
                    {categories.filter((_, i) => i % 2 !== 0).map((cat, i) => (
                        <MobileGridItem
                            key={cat.id}
                            category={cat}
                            onClick={onCategoryClick}
                            isDark={isDark}
                            index={i * 2 + 1}
                            baseIntervalS={settings.animationIntervalSeconds}
                        />
                    ))}
                </div>
            </div>

            {/* Desktop: Animated Bento Grid */}
            <div
                className={`hidden md:flex w-full rounded-3xl overflow-hidden flex-col gap-2 shadow-2xl transition-colors duration-500 ${isDark ? 'bg-black/50 border border-white/5' : 'bg-white border border-black/10'}`}
                style={{
                    aspectRatio: gridRows.length <= 2 ? '16/9' : undefined,
                    height: gridRows.length > 2 ? `${gridRows.length * 300}px` : undefined
                }}
            >
                {gridRows.map((rowCats, rowIndex) => (
                    <div key={rowIndex} className="flex-1 flex gap-2 w-full">
                        {rowCats.map((cat, i) => (
                            <GridItem
                                key={cat.id}
                                category={cat}
                                weight={rowWeights[rowIndex]?.[i] || 1}
                                onClick={onCategoryClick}
                                isDark={isDark}
                                baseIntervalS={settings.animationIntervalSeconds}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
}
