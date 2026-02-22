'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import ScrollProgress from './ScrollProgress';

interface NavbarProps {
    visible: boolean;
}

const LEFT_LINKS = [
    { label: 'About Us', href: '#founder' },
    { label: 'Categories', href: '#categories' },
];

const RIGHT_LINKS = [
    { label: 'Founder', href: '#founder' },
    { label: 'Contact', href: '#contact' },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

export default function Navbar({ visible }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 50);
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.header
                    className="fixed top-0 left-0 z-50 w-full"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <nav
                        className="relative flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12 lg:px-20"
                        style={{
                            backgroundColor: scrolled
                                ? theme === 'dark'
                                    ? 'rgba(10, 10, 10, 0.7)'
                                    : 'rgba(250, 250, 250, 0.7)'
                                : 'transparent',
                            backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                            WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
                            borderBottom: scrolled
                                ? theme === 'dark'
                                    ? '1px solid rgba(255,255,255,0.06)'
                                    : '1px solid rgba(0,0,0,0.06)'
                                : '1px solid transparent',
                        }}
                    >
                        {/* Left Nav Links */}
                        <div className="hidden flex-1 items-center gap-10 md:flex">
                            {LEFT_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="group relative text-sm font-medium tracking-wider uppercase transition-colors duration-300"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color:
                                            theme === 'dark'
                                                ? 'rgba(255,255,255,0.7)'
                                                : 'rgba(0,0,0,0.7)',
                                    }}
                                >
                                    {link.label}
                                    <span
                                        className="absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                                        style={{
                                            backgroundColor: 'var(--color-brand)',
                                        }}
                                    />
                                </a>
                            ))}
                        </div>

                        {/* Center Logo */}
                        <div
                            className="flex flex-col items-center leading-none"
                        >
                            <h1
                                className="text-xl tracking-[0.2em] sm:text-2xl"
                                style={{
                                    fontFamily: 'var(--font-monoton)',
                                    color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                }}
                            >
                                MARKOS
                            </h1>
                            <span
                                className="text-[0.6rem] tracking-[0.4em] uppercase sm:text-[0.75rem]"
                                style={{
                                    fontFamily: 'var(--font-outfit)',
                                    color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                    marginTop: '2px',
                                }}
                            >
                                STUDIO
                            </span>
                        </div>

                        {/* Right Nav Links */}
                        <div className="hidden flex-1 items-center justify-end gap-10 md:flex">
                            {RIGHT_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="group relative text-sm font-medium tracking-wider uppercase transition-colors duration-300"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color:
                                            theme === 'dark'
                                                ? 'rgba(255,255,255,0.7)'
                                                : 'rgba(0,0,0,0.7)',
                                    }}
                                >
                                    {link.label}
                                    <span
                                        className="absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                                        style={{
                                            backgroundColor: 'var(--color-brand)',
                                        }}
                                    />
                                </a>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="flex flex-col gap-[5px] md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                className="block h-[1.5px] w-6 rounded-full"
                                style={{ backgroundColor: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                animate={mobileMenuOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="block h-[1.5px] w-6 rounded-full"
                                style={{ backgroundColor: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="block h-[1.5px] w-6 rounded-full"
                                style={{ backgroundColor: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                animate={mobileMenuOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </button>
                    </nav>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                className="absolute top-full left-0 w-full md:hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundColor:
                                        theme === 'dark'
                                            ? 'rgba(10, 10, 10, 0.95)'
                                            : 'rgba(250, 250, 250, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                }}
                            >
                                <div className="flex flex-col gap-6 px-6 py-8">
                                    {ALL_LINKS.map((link, i) => (
                                        <motion.a
                                            key={link.label}
                                            href={link.href}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className="text-lg font-medium tracking-wider uppercase"
                                            style={{
                                                fontFamily: 'var(--font-outfit)',
                                                color:
                                                    theme === 'dark'
                                                        ? 'rgba(255,255,255,0.8)'
                                                        : 'rgba(0,0,0,0.8)',
                                            }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            {link.label}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scroll Progress */}
                    <ScrollProgress />
                </motion.header>
            )}
        </AnimatePresence>
    );
}
