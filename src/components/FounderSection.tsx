'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function FounderSection() {
    const { theme } = useTheme();

    return (
        <section id="founder" className="px-6 py-24 md:px-12 lg:px-20">
            <div className="mx-auto max-w-6xl">
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
                        Founder
                    </p>
                    <h2
                        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                        }}
                    >
                        About Us
                    </h2>
                </motion.div>

                {/* Content */}
                <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
                    {/* Photo */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative overflow-hidden rounded-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                                alt="Onur Satici - Markos Studio Founder"
                                className="aspect-[3/4] w-full object-cover"
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)',
                                }}
                            />
                        </div>
                        {/* Decorative frame */}
                        <div
                            className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-2xl"
                            style={{
                                border: `1px solid ${theme === 'dark' ? 'rgba(200, 169, 110, 0.2)' : 'rgba(200, 169, 110, 0.3)'}`,
                            }}
                        />
                    </motion.div>

                    {/* Bio */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h3
                            className="mb-2 text-2xl font-bold sm:text-3xl"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                            }}
                        >
                            Onur Satici
                        </h3>
                        <p
                            className="mb-6 text-sm font-medium tracking-[0.2em] uppercase"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: 'var(--color-brand)',
                            }}
                        >
                            Founder & Photography Artist
                        </p>
                        <p
                            className="mb-6 text-base leading-relaxed"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.6)'
                                        : 'rgba(0,0,0,0.6)',
                            }}
                        >
                            The creative force behind Markos Studio with over 10 years of experience.
                            As a master of natural light and composition, he brings a unique perspective
                            to every project. Working in and around Istanbul, he creates unforgettable
                            visuals for brands and individuals alike.
                        </p>
                        <p
                            className="text-base leading-relaxed"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.6)'
                                        : 'rgba(0,0,0,0.6)',
                            }}
                        >
                            His passion for landscape photography has taken him around the world,
                            with his work featured in international exhibitions.
                            At Markos Studio, our focus is telling your story in the most
                            compelling way possible.
                        </p>

                        {/* Stats */}
                        <div className="mt-10 grid grid-cols-3 gap-6">
                            {[
                                { value: '10+', label: 'Years Experience' },
                                { value: '500+', label: 'Projects' },
                                { value: '50+', label: 'Brands' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p
                                        className="text-2xl font-bold sm:text-3xl"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: 'var(--color-brand)',
                                        }}
                                    >
                                        {stat.value}
                                    </p>
                                    <p
                                        className="mt-1 text-xs tracking-wider uppercase"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color:
                                                theme === 'dark'
                                                    ? 'rgba(255,255,255,0.4)'
                                                    : 'rgba(0,0,0,0.4)',
                                        }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
