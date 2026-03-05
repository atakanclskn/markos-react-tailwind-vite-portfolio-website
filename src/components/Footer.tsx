'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getFooterContent } from '@/lib/firestore';
import type { FooterContent } from '@/types';

export default function Footer() {
    const { theme, toggleTheme } = useTheme();
    const [footer, setFooter] = useState<FooterContent | null>(null);

    useEffect(() => {
        getFooterContent().then((data) => {
            if (data) setFooter(data);
        });
    }, []);

    const footerLinks = footer?.socialLinks && footer.socialLinks.length > 0
        ? footer.socialLinks.map(l => ({ label: l.iconName, href: l.url }))
        : [
            { label: 'Instagram', href: '#' },
            { label: 'Twitter', href: '#' },
            { label: 'Behance', href: '#' },
            { label: 'LinkedIn', href: '#' },
        ];

    const copyright = footer?.copyright || `© ${new Date().getFullYear()} Markos Studio. All rights reserved.`;

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
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                            className="group relative flex items-center justify-center rounded-full transition-all duration-500"
                            style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.06)'
                                        : 'rgba(0,0,0,0.06)',
                                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {/* Sun icon (shown in dark mode → click to go light) */}
                            <motion.svg
                                className="absolute h-5 w-5"
                                style={{ color: 'var(--color-brand)' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                initial={false}
                                animate={{
                                    opacity: theme === 'dark' ? 1 : 0,
                                    scale: theme === 'dark' ? 1 : 0.5,
                                    rotate: theme === 'dark' ? 0 : 90,
                                }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </motion.svg>

                            {/* Moon icon (shown in light mode → click to go dark) */}
                            <motion.svg
                                className="absolute h-5 w-5"
                                style={{ color: 'var(--color-brand)' }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                                initial={false}
                                animate={{
                                    opacity: theme === 'light' ? 1 : 0,
                                    scale: theme === 'light' ? 1 : 0.5,
                                    rotate: theme === 'light' ? 0 : -90,
                                }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </motion.svg>
                        </motion.button>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="mt-12 flex flex-col items-center justify-between gap-6 pt-8 md:flex-row md:gap-4"
                    style={{
                        borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                    }}
                >
                    <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
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
                            {copyright}
                        </p>

                        {/* Legal Links */}
                        <div className="flex items-center gap-4 text-xs font-light">
                            <a href="/privacy" className="transition-colors hover:text-[var(--color-brand)]" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>Privacy Policy</a>
                            <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>|</span>
                            <a href="/terms" className="transition-colors hover:text-[var(--color-brand)]" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>Terms & Conditions</a>
                            <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>|</span>
                            <a href="/cookies" className="transition-colors hover:text-[var(--color-brand)]" style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>Cookie Policy</a>
                        </div>
                    </div>

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
                        Manchester, United Kingdom
                    </p>
                </div>
            </div>
        </footer>
    );
}
