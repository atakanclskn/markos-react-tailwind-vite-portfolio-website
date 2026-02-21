'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

// Placeholder images by category
const CATEGORY_IMAGES: Record<string, string[]> = {
    Landscape: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    ],
    Portre: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    ],
    Animal: [
        'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
        'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
        'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=80',
    ],
    Fashion: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    ],
    Product: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
    ],
    'Party & Wedding': [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    ],
    'B&W': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    ],
};

const CATEGORIES = Object.keys(CATEGORY_IMAGES);

const GRID_CONFIGS = [
    // Config A: Asymmetric mosaic
    [
        { top: '0%', left: '0%', width: '33%', height: '55%' },
        { top: '0%', left: '33%', width: '34%', height: '40%' },
        { top: '0%', left: '67%', width: '33%', height: '55%' },
        { top: '55%', left: '0%', width: '25%', height: '45%' },
        { top: '40%', left: '25%', width: '25%', height: '60%' },
        { top: '40%', left: '50%', width: '17%', height: '60%' },
        { top: '55%', left: '67%', width: '33%', height: '45%' },
    ],
    // Config B
    [
        { top: '0%', left: '0%', width: '25%', height: '50%' },
        { top: '0%', left: '25%', width: '35%', height: '45%' },
        { top: '0%', left: '60%', width: '40%', height: '40%' },
        { top: '50%', left: '0%', width: '30%', height: '50%' },
        { top: '45%', left: '30%', width: '30%', height: '55%' },
        { top: '40%', left: '60%', width: '20%', height: '60%' },
        { top: '40%', left: '80%', width: '20%', height: '60%' },
    ],
    // Config C
    [
        { top: '0%', left: '0%', width: '45%', height: '50%' },
        { top: '0%', left: '45%', width: '25%', height: '45%' },
        { top: '0%', left: '70%', width: '30%', height: '50%' },
        { top: '50%', left: '0%', width: '20%', height: '50%' },
        { top: '45%', left: '20%', width: '30%', height: '55%' },
        { top: '50%', left: '50%', width: '25%', height: '50%' },
        { top: '50%', left: '75%', width: '25%', height: '50%' },
    ],
];

const GAP = 3;

// Each card manages its OWN config index with a staggered delay
// so cards transition one-by-one instead of all at once
interface BentoCardProps {
    category: string;
    images: string[];
    configIndex: number;
    cardIndex: number;
    staggerDelay: number;
    onClick: (category: string) => void;
}

function BentoCard({ category, images, configIndex, cardIndex, staggerDelay, onClick }: BentoCardProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [showNext, setShowNext] = useState(false);
    const nextImageRef = useRef(0);
    // Each card holds its own "applied" config, delayed from the parent
    const [appliedConfig, setAppliedConfig] = useState(configIndex);
    const { theme } = useTheme();

    // Stagger: apply the new config after this card's individual delay
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAppliedConfig(configIndex);
        }, staggerDelay);
        return () => clearTimeout(timeout);
    }, [configIndex, staggerDelay]);

    const style = GRID_CONFIGS[appliedConfig][cardIndex];

    // Premium crossfade image transitions at random intervals
    useEffect(() => {
        const baseDelay = 5000 + Math.random() * 4000;
        const interval = setInterval(() => {
            nextImageRef.current = (activeImage + 1) % images.length;
            setShowNext(true);
            const timer = setTimeout(() => {
                setActiveImage(nextImageRef.current);
                setShowNext(false);
            }, 2500);
            return () => clearTimeout(timer);
        }, baseDelay);
        return () => clearInterval(interval);
    }, [activeImage, images.length]);

    return (
        <motion.div
            className="group absolute cursor-pointer overflow-hidden rounded-lg"
            style={{
                top: style.top,
                left: style.left,
                width: `calc(${style.width} - ${GAP}px)`,
                height: `calc(${style.height} - ${GAP}px)`,
            }}
            animate={{
                top: style.top,
                left: style.left,
                width: `calc(${style.width} - ${GAP}px)`,
                height: `calc(${style.height} - ${GAP}px)`,
            }}
            transition={{
                duration: 2.5,
                ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => onClick(category)}
            whileHover={{ scale: 0.98 }}
        >
            {/* Base image */}
            <img
                src={images[activeImage]}
                alt={category}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
            />

            {/* Crossfade overlay */}
            <AnimatePresence>
                {showNext && (
                    <motion.img
                        key={`crossfade-${nextImageRef.current}`}
                        src={images[nextImageRef.current]}
                        alt={category}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.5, ease: 'easeInOut' }}
                        loading="lazy"
                    />
                )}
            </AnimatePresence>

            {/* Gradient overlay */}
            <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
                }}
            />

            {/* Hover brightening */}
            <div className="absolute inset-0 bg-white/0 transition-all duration-500 group-hover:bg-white/5" />

            {/* Category label */}
            <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-4">
                <p
                    className="text-xs font-semibold tracking-[0.15em] text-white/90 uppercase sm:text-sm"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                >
                    {category}
                </p>
            </div>

            {/* Hover arrow */}
            <div className="absolute right-4 bottom-4 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <svg
                    className="h-4 w-4 text-white/80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </motion.div>
    );
}

interface BentoGridProps {
    onCategoryClick: (category: string) => void;
}

export default function BentoGrid({ onCategoryClick }: BentoGridProps) {
    const [configIndex, setConfigIndex] = useState(0);
    const { theme } = useTheme();

    // Generate stable random stagger delays for each card (0ms to 3000ms)
    // Shuffled order so cards don't always animate left-to-right
    const staggerDelays = useMemo(() => {
        const order = CATEGORIES.map((_, i) => i);
        // Deterministic shuffle based on index
        for (let i = order.length - 1; i > 0; i--) {
            const j = (i * 7 + 3) % (i + 1);
            [order[i], order[j]] = [order[j], order[i]];
        }
        // Map shuffle rank to delay: rank 0 = 0ms, rank 6 = 3000ms
        const delays = new Array(CATEGORIES.length);
        order.forEach((originalIndex, rank) => {
            delays[originalIndex] = rank * 450;
        });
        return delays;
    }, []);

    // Rotate through layout configs every 12 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setConfigIndex((prev) => (prev + 1) % GRID_CONFIGS.length);
        }, 12000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="categories" className="px-6 py-24 md:px-12 lg:px-20">
            {/* Section header */}
            <motion.div
                className="mb-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <p
                    className="mb-4 text-xs font-medium tracking-[0.4em] uppercase"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: 'var(--color-brand)',
                    }}
                >
                    Portfolyo
                </p>
                <h2
                    className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                    }}
                >
                    Kategoriler
                </h2>
            </motion.div>

            {/* 16:9 Bento Grid Container */}
            <motion.div
                className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-xl"
                style={{ aspectRatio: '16 / 9' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {CATEGORIES.map((category, i) => (
                    <BentoCard
                        key={category}
                        category={category}
                        images={CATEGORY_IMAGES[category]}
                        configIndex={configIndex}
                        cardIndex={i}
                        staggerDelay={staggerDelays[i]}
                        onClick={onCategoryClick}
                    />
                ))}
            </motion.div>
        </section>
    );
}
