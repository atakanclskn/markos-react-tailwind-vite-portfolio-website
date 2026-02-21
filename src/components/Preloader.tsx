'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Demo placeholder images for development
const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1518173946687-a243486a29b0?w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
];

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Carousel: cycle through images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % PLACEHOLDER_IMAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Simulate loading progress
    useEffect(() => {
        const duration = 3000;
        const steps = 60;
        const increment = 100 / steps;
        const interval = duration / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(prev + increment, 100);
            });
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Trigger onComplete when progress reaches 100
    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(onComplete, 800);
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    const getImageIndex = (offset: number) =>
        (currentIndex + offset + PLACEHOLDER_IMAGES.length) % PLACEHOLDER_IMAGES.length;

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#050505' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
            {/* Background Carousel - 3 images */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 px-8 opacity-[0.07]">
                {/* Left image (small) */}
                <motion.div
                    className="relative h-[40vh] w-[20vw] flex-shrink-0 overflow-hidden rounded-lg"
                    animate={{ x: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <motion.img
                        key={`left-${getImageIndex(-1)}`}
                        src={PLACEHOLDER_IMAGES[getImageIndex(-1)]}
                        alt=""
                        className="h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    />
                </motion.div>

                {/* Center image (large) */}
                <motion.div
                    className="relative h-[55vh] w-[35vw] flex-shrink-0 overflow-hidden rounded-lg"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <motion.img
                        key={`center-${currentIndex}`}
                        src={PLACEHOLDER_IMAGES[currentIndex]}
                        alt=""
                        className="h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    />
                </motion.div>

                {/* Right image (small) */}
                <motion.div
                    className="relative h-[40vh] w-[20vw] flex-shrink-0 overflow-hidden rounded-lg"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <motion.img
                        key={`right-${getImageIndex(1)}`}
                        src={PLACEHOLDER_IMAGES[getImageIndex(1)]}
                        alt=""
                        className="h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                    />
                </motion.div>
            </div>

            {/* Logo */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                <motion.h1
                    layoutId="studio-logo"
                    className="text-4xl tracking-[0.3em] text-white sm:text-5xl md:text-6xl lg:text-7xl"
                    style={{ fontFamily: 'var(--font-monoton)' }}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    MARKOS
                </motion.h1>

                <motion.p
                    className="text-sm font-light tracking-[0.5em] text-white/60 uppercase"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    STUDIO
                </motion.p>

                {/* Progress bar */}
                <motion.div
                    className="mt-8 h-[1px] w-48 overflow-hidden rounded-full bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.div
                        className="h-full rounded-full bg-white/50"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: 'linear' }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
