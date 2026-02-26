'use client';

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from '@/context/ThemeContext';
import { getCategories, getPhotosByCategory } from '@/lib/firestore';
import type { Category, Photo } from '@/types';

// Fallback categories when Firestore is empty
const FALLBACK_CATEGORIES = [
    { id: "landscape", title: "Landscape", images: ["https://picsum.photos/seed/land1/1200/800", "https://picsum.photos/seed/land2/1200/800", "https://picsum.photos/seed/land3/1200/800"] },
    { id: "portrait", title: "Portrait", images: ["https://picsum.photos/seed/port1/800/1200", "https://picsum.photos/seed/port2/800/1200", "https://picsum.photos/seed/port3/800/1200"] },
    { id: "animal", title: "Animal", images: ["https://picsum.photos/seed/anim1/1000/1000", "https://picsum.photos/seed/anim2/1000/1000", "https://picsum.photos/seed/anim3/1000/1000"] },
    { id: "fashion", title: "Fashion", images: ["https://picsum.photos/seed/fash1/800/1200", "https://picsum.photos/seed/fash2/800/1200", "https://picsum.photos/seed/fash3/800/1200"] },
    { id: "product", title: "Product", images: ["https://picsum.photos/seed/prod1/1000/800", "https://picsum.photos/seed/prod2/1000/800", "https://picsum.photos/seed/prod3/1000/800"] },
    { id: "wedding", title: "Party & Wedding", images: ["https://picsum.photos/seed/wed1/1200/800", "https://picsum.photos/seed/wed2/1200/800", "https://picsum.photos/seed/wed3/1200/800"] },
    { id: "bw", title: "B&W", images: ["https://picsum.photos/seed/bw1/1000/1000", "https://picsum.photos/seed/bw2/1000/1000", "https://picsum.photos/seed/bw3/1000/1000"] },
];

type CategoryWithImages = { id: string; title: string; images: string[] };

// Rastgele flex ağırlıkları üreten yardımcı fonksiyon
const getRandomWeights = (count: number) => {
    return Array.from({ length: count }, () => Math.random() * 2 + 1); // 1 ile 3 arası değerler
};

interface BentoGridProps {
    onCategoryClick: (category: string) => void;
}

function GridItem({ category, weight, onClick, isDark }: { category: CategoryWithImages, weight: number, onClick: (category: string) => void, isDark: boolean }) {
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        const intervalTime = Math.random() * 6000 + 6000;
        const timer = setInterval(() => {
            setImgIndex((prev) => (prev + 1) % category.images.length);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [category.images.length]);

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
function MobileGridItem({ category, onClick, isDark, index }: { category: CategoryWithImages, onClick: (category: string) => void, isDark: boolean, index: number }) {
    const [imgIndex, setImgIndex] = useState(0);

    useEffect(() => {
        const intervalTime = Math.random() * 6000 + 6000;
        const timer = setInterval(() => {
            setImgIndex((prev) => (prev + 1) % category.images.length);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [category.images.length]);

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

export default function BentoGrid({ onCategoryClick }: BentoGridProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [categories, setCategories] = useState<CategoryWithImages[]>(FALLBACK_CATEGORIES);
    const [row1Weights, setRow1Weights] = useState(() => getRandomWeights(3));
    const [row2Weights, setRow2Weights] = useState(() => getRandomWeights(4));

    // Fetch categories and their photos from Firestore
    useEffect(() => {
        (async () => {
            try {
                const cats = await getCategories();
                if (cats.length === 0) return;

                const withImages: CategoryWithImages[] = await Promise.all(
                    cats.map(async (cat) => {
                        const photos = await getPhotosByCategory(cat.id!);
                        const images = photos.slice(0, 3).map(p => p.storageUrl);
                        // If category has no photos, use placeholder
                        if (images.length === 0) {
                            images.push(`https://picsum.photos/seed/${cat.slug}1/1200/800`);
                            images.push(`https://picsum.photos/seed/${cat.slug}2/1200/800`);
                            images.push(`https://picsum.photos/seed/${cat.slug}3/1200/800`);
                        }
                        return { id: cat.slug, title: cat.name, images };
                    })
                );

                setCategories(withImages);
                // Reset weights for the new row sizes
                const mid = Math.ceil(withImages.length / 2);
                setRow1Weights(getRandomWeights(mid));
                setRow2Weights(getRandomWeights(withImages.length - mid));
            } catch (e) {
                console.error('Error fetching categories for BentoGrid:', e);
            }
        })();
    }, []);

    // Dynamically split into two rows
    const midpoint = Math.ceil(categories.length / 2);
    const ROW1 = categories.slice(0, midpoint);
    const ROW2 = categories.slice(midpoint);

    // Grid karelerinin boyutlarını asenkron ve tek tek değiştiren effect
    useEffect(() => {
        // Üst satır için bağımsız döngü
        const timer1 = setInterval(() => {
            setRow1Weights((prev) => {
                const next = [...prev];
                const randomIndex = Math.floor(Math.random() * next.length);
                next[randomIndex] = Math.random() * 2 + 1;
                return next;
            });
        }, 3500);

        // Alt satır için bağımsız döngü
        const timer2 = setInterval(() => {
            setRow2Weights((prev) => {
                const next = [...prev];
                const randomIndex = Math.floor(Math.random() * next.length);
                next[randomIndex] = Math.random() * 2 + 1;
                return next;
            });
        }, 4800);

        return () => {
            clearInterval(timer1);
            clearInterval(timer2);
        };
    }, [categories]);

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
                        <MobileGridItem key={cat.id} category={cat} onClick={onCategoryClick} isDark={isDark} index={i * 2} />
                    ))}
                </div>
                <div className="flex flex-col gap-3 pt-6">
                    {categories.filter((_, i) => i % 2 !== 0).map((cat, i) => (
                        <MobileGridItem key={cat.id} category={cat} onClick={onCategoryClick} isDark={isDark} index={i * 2 + 1} />
                    ))}
                </div>
            </div>

            {/* Desktop: Animated 16:9 Bento Grid */}
            <div className={`hidden md:flex w-full aspect-video rounded-3xl overflow-hidden flex-col gap-2 shadow-2xl transition-colors duration-500 ${isDark ? 'bg-black/50 border border-white/5' : 'bg-white border border-black/10'
                }`}>
                {/* Row 1 */}
                <div className="flex-1 flex gap-2 w-full">
                    {ROW1.map((cat, i) => (
                        <GridItem key={cat.id} category={cat} weight={row1Weights[i]} onClick={onCategoryClick} isDark={isDark} />
                    ))}
                </div>
                {/* Row 2 */}
                <div className="flex-1 flex gap-2 w-full">
                    {ROW2.map((cat, i) => (
                        <GridItem key={cat.id} category={cat} weight={row2Weights[i]} onClick={onCategoryClick} isDark={isDark} />
                    ))}
                </div>
            </div>
        </section>
    );
}
