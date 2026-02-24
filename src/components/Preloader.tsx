'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

// Demo placeholder images for development
const PLACEHOLDER_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1518173946687-a243486a29b0?w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
];

export default function Preloader() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    const progressBarControls = useAnimation();

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

    const startExitAnimation = useCallback(async () => {
        if (isExiting) return;
        setIsExiting(true);

        // First: fade out the progress bar
        await progressBarControls.start({
            opacity: 0,
            transition: { duration: 0.3, ease: 'easeOut' },
        });

    }, [isExiting, progressBarControls]);

    // Trigger exit animation when progress reaches 100
    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(startExitAnimation, 400);
            return () => clearTimeout(timeout);
        }
    }, [progress, startExitAnimation]);

    const getImageIndex = (offset: number) =>
        (currentIndex + offset + PLACEHOLDER_IMAGES.length) % PLACEHOLDER_IMAGES.length;

    return (
        <motion.div
            className="relative z-40 flex h-[100vh] w-full items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#050505' }}
        >
            {/* Background overlay for fade */}
            <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: '#050505' }}
            />

            {/* Background Carousel - 3 images */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center gap-4 px-8 opacity-[0.07]"
            >
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
            </motion.div>

            {/* Progress bar and other absolute elements */}
            <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 z-10 flex-col items-center gap-8">
                <motion.div
                    className="mt-8 h-[1px] w-48 overflow-hidden rounded-full bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <motion.div
                        animate={progressBarControls}
                    >
                        <motion.div
                            className="h-[1px] rounded-full bg-white/50"
                            style={{ width: `${progress}%` }}
                            transition={{ ease: 'linear' }}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <div className="relative h-20 w-[1px] bg-white/20 overflow-hidden">
                    <motion.div
                        className="absolute left-0 top-0 w-full h-1/3 bg-white"
                        animate={{ y: ['-100%', '300%'] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
