'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
    const { theme, toggleTheme } = useTheme();

    const footerLinks = [
        { label: 'Instagram', href: '#' },
        { label: 'Twitter', href: '#' },
        { label: 'Behance', href: '#' },
        { label: 'LinkedIn', href: '#' },
    ];

    return (
        <footer
            className="px-6 py-16 md:px-12 lg:px-20"
            style={{
                borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
        >
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="mb-4 flex flex-col leading-none">
                            <h3
                                className="text-2xl tracking-[0.15em]"
                                style={{
                                    fontFamily: 'var(--font-monoton)',
                                    color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                }}
                            >
                                MARKOS
                            </h3>
                            <span
                                className="text-[0.65rem] tracking-[0.4em] uppercase"
                                style={{
                                    fontFamily: 'var(--font-outfit)',
                                    color: theme === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
                                    marginTop: '3px',
                                }}
                            >
                                STUDIO
                            </span>
                        </div>
                        <p
                            className="max-w-xs text-sm leading-relaxed"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.4)'
                                        : 'rgba(0,0,0,0.4)',
                            }}
                        >
                            Every frame a story. Premium photography services
                            that transform your moments into art.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4
                            className="mb-4 text-xs font-semibold tracking-[0.3em] uppercase"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                            }}
                        >
                            Social Media
                        </h4>
                        <div className="flex flex-col gap-3">
                            {footerLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm transition-colors duration-300 hover:text-[var(--color-brand)]"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color:
                                            theme === 'dark'
                                                ? 'rgba(255,255,255,0.4)'
                                                : 'rgba(0,0,0,0.4)',
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div className="flex flex-col items-start md:items-end">
                        <h4
                            className="mb-4 text-xs font-semibold tracking-[0.3em] uppercase"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                            }}
                        >
                            Theme
                        </h4>
                        <motion.button
                            onClick={(e) => toggleTheme(e)}
                            className="group relative flex items-center gap-3 rounded-full border px-5 py-2.5 transition-all duration-300"
                            style={{
                                borderColor:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.1)'
                                        : 'rgba(0,0,0,0.1)',
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Sun icon */}
                            <svg
                                className="h-4 w-4 transition-colors duration-300"
                                style={{
                                    color: theme === 'light' ? 'var(--color-brand)' : theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>

                            {/* Toggle indicator */}
                            <div
                                className="relative h-5 w-9 rounded-full transition-colors duration-300"
                                style={{
                                    backgroundColor:
                                        theme === 'dark'
                                            ? 'rgba(255,255,255,0.1)'
                                            : 'rgba(0,0,0,0.1)',
                                }}
                            >
                                <motion.div
                                    className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full"
                                    style={{ backgroundColor: 'var(--color-brand)' }}
                                    animate={{ x: theme === 'dark' ? 0 : 16 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>

                            {/* Moon icon */}
                            <svg
                                className="h-4 w-4 transition-colors duration-300"
                                style={{
                                    color: theme === 'dark' ? 'var(--color-brand)' : 'rgba(0,0,0,0.4)',
                                }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        </motion.button>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row"
                    style={{
                        borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                    }}
                >
                    <p
                        className="text-xs"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            color:
                                theme === 'dark'
                                    ? 'rgba(255,255,255,0.3)'
                                    : 'rgba(0,0,0,0.3)',
                        }}
                    >
                        &copy; {new Date().getFullYear()} Markos Studio. All rights reserved.
                    </p>
                    <p
                        className="text-xs"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            color:
                                theme === 'dark'
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(0,0,0,0.2)',
                        }}
                    >
                        Istanbul, Turkey
                    </p>
                </div>
            </div>
        </footer>
    );
}
