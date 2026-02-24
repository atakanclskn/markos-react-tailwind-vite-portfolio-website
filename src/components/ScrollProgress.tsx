'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ScrollProgress() {
    const { theme } = useTheme();
    const { scrollYProgress } = useScroll();

    // Spring configuration for buttery smooth scroll progress
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-transparent">
            <motion.div
                className="h-full origin-left"
                style={{
                    scaleX,
                    backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
                }}
            />
        </div>
    );
}
