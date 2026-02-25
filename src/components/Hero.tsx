'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function Hero() {
    const { theme } = useTheme();

    return (
        <section id="hero" className="relative flex min-h-[100dvh] items-center justify-center px-6 pb-12 pt-24">
            {/* Top gradient fade from preloader */}
            <div
                className="pointer-events-none absolute top-0 left-0 w-full h-32 z-20"
                style={{
                    background: `linear-gradient(to bottom, ${theme === 'dark' ? '#0a0a0a' : '#f5f5f5'} 0%, transparent 100%)`,
                }}
            />
            {/* Subtle background gradient */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        theme === 'dark'
                            ? 'radial-gradient(ellipse at 50% 30%, rgba(200, 169, 110, 0.04) 0%, transparent 70%)'
                            : 'radial-gradient(ellipse at 50% 30%, rgba(200, 169, 110, 0.06) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
                {/* Eyebrow text */}
                <motion.p
                    className="mb-6 text-xs font-medium tracking-[0.4em] uppercase"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: 'var(--color-brand)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Premium Photography
                </motion.p>

                {/* Main slogan */}
                <motion.h2
                    className="mb-8 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    Every Frame a{' '}
                    <span className="text-gradient-brand">Story</span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    className="mx-auto max-w-2xl text-base font-light leading-relaxed sm:text-lg"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color:
                            theme === 'dark'
                                ? 'rgba(255,255,255,0.5)'
                                : 'rgba(0,0,0,0.5)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    At Markos Studio, we transform your moments into timeless art.
                    From nature to fashion, portraits to products, we provide professional
                    photography services across every field.
                </motion.p>

                {/* CTA button */}
                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <a
                        href="#categories"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-8 py-4 text-sm font-medium tracking-wider uppercase transition-all duration-500"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            borderColor:
                                theme === 'dark'
                                    ? 'rgba(255,255,255,0.15)'
                                    : 'rgba(0,0,0,0.15)',
                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                        }}
                    >
                        <span className="relative z-10">Explore Our Portfolio</span>
                        <svg
                            className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>

                        {/* Hover fill effect */}
                        <span
                            className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                            style={{
                                backgroundColor:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.08)'
                                        : 'rgba(0,0,0,0.05)',
                            }}
                        />
                    </a>
                </motion.div>
            </div>

        </section>
    );
}
