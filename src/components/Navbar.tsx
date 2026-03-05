'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import ScrollProgress from './ScrollProgress';
import Link from 'next/link';

interface NavbarProps {
    visible: boolean;
    staticMode?: boolean;
}

const LEFT_LINKS = [
    { label: 'About Us', href: '#hero' },
    { label: 'Categories', href: '#categories' },
];

const RIGHT_LINKS = [
    { label: 'Founder', href: '#founder' },
    { label: 'Contact', href: '#contact' },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

export default function Navbar({ visible, staticMode = false }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme } = useTheme();

    const { scrollY } = useScroll();
    const [vh, setVh] = useState(0);

    useEffect(() => {
        setVh(window.innerHeight);
        const handleResize = () => setVh(window.innerHeight);
        window.addEventListener('resize', handleResize);

        function handleScroll() {
            setScrolled(window.scrollY > 50);
        }
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
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

    // Scroll metrics
    // The logo will complete its animation after 50% of the viewport height has been scrolled.
    const scrollEnd = vh ? vh * 0.5 : 400;

    // Scale from 3 to 1
    const logoScale = useTransform(scrollY, [0, scrollEnd], [3, 1]);

    // Translate Y from center of screen to 0. Logo sits naturally in nav (~40px top).
    // Center of screen is vh/2. Offset is vh/2 - 40px down.
    const logoY = useTransform(scrollY, [0, scrollEnd], [vh ? (vh / 2) - 40 : 350, 0]);

    // Color transition from preloader color to theme color
    const darkThemeTextColor = '#f5f5f5';
    const lightThemeTextColor = '#0a0a0a';
    const finalTextColor = theme === 'dark' ? darkThemeTextColor : lightThemeTextColor;
    const logoStartColor = theme === 'dark' ? '#ffffff' : '#0a0a0a';
    const logoColor = useTransform(scrollY, [0, scrollEnd], [logoStartColor, finalTextColor]);

    const darkThemeSubColor = 'rgba(255,255,255,0.5)';
    const lightThemeSubColor = 'rgba(0,0,0,0.5)';
    const finalSubColor = theme === 'dark' ? darkThemeSubColor : lightThemeSubColor;
    const logoSubStartColor = theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const logoSubColor = useTransform(scrollY, [0, scrollEnd], [logoSubStartColor, finalSubColor]);

    // Opacity for nav links and background
    // They start fading in after 25% of viewport scroll and finish at 50%.
    const navItemsOpacity = useTransform(scrollY, [scrollEnd * 0.5, scrollEnd], [0, 1]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.header
                    className="fixed top-0 left-0 z-50 w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <motion.nav
                        className="relative flex items-center justify-center px-6 py-4 md:px-12 lg:px-20"
                        style={{
                            backgroundColor: staticMode
                                ? (theme === 'dark' ? 'rgba(10, 10, 10, 0.7)' : 'rgba(250, 250, 250, 0.8)')
                                : (theme === 'dark'
                                    ? useTransform(navItemsOpacity, [0, 1], ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.7)'])
                                    : useTransform(navItemsOpacity, [0, 1], ['rgba(250, 250, 250, 0)', 'rgba(250, 250, 250, 0.8)'])),
                            backdropFilter: scrolled || staticMode ? 'blur(20px) saturate(180%)' : 'none',
                            WebkitBackdropFilter: scrolled || staticMode ? 'blur(20px) saturate(180%)' : 'none',
                            borderBottom: staticMode
                                ? (theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
                                : (theme === 'dark'
                                    ? useTransform(navItemsOpacity, [0, 1], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.06)'])
                                    : useTransform(navItemsOpacity, [0, 1], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.06)'])),
                        }}
                    >
                        {/* Left Nav Links */}
                        <motion.div
                            className="hidden flex-1 items-center justify-end gap-8 md:flex"
                            style={{ opacity: staticMode ? 1 : navItemsOpacity }}
                        >
                            {LEFT_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="group relative text-sm font-medium tracking-wider uppercase transition-colors duration-300"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                    }}
                                >
                                    {link.label}
                                    <span
                                        className="absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'var(--color-brand)' }}
                                    />
                                </a>
                            ))}
                        </motion.div>

                        {/* Center Logo */}
                        <Link href="/">
                            <motion.div
                                className="mx-8 flex flex-col items-center leading-none md:mx-12 cursor-pointer"
                                style={{
                                    scale: staticMode ? 1 : logoScale,
                                    y: staticMode ? 0 : logoY,
                                    originY: 0.5,
                                    originX: 0.5
                                }}
                            >
                                <motion.h1
                                    className="text-xl tracking-[0.2em] sm:text-2xl"
                                    style={{
                                        fontFamily: 'var(--font-monoton)',
                                        color: staticMode ? finalTextColor : logoColor,
                                    }}
                                >
                                    MARKOS
                                </motion.h1>
                                <motion.span
                                    className="text-[0.6rem] tracking-[0.4em] uppercase sm:text-[0.75rem]"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color: staticMode ? finalSubColor : logoSubColor,
                                        marginTop: '2px',
                                    }}
                                >
                                    STUDIO
                                </motion.span>
                            </motion.div>
                        </Link>

                        {/* Right Nav Links */}
                        <motion.div
                            className="hidden flex-1 items-center justify-start gap-8 md:flex"
                            style={{ opacity: staticMode ? 1 : navItemsOpacity }}
                        >
                            {RIGHT_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="group relative text-sm font-medium tracking-wider uppercase transition-colors duration-300"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                    }}
                                >
                                    {link.label}
                                    <span
                                        className="absolute -bottom-1 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                                        style={{ backgroundColor: 'var(--color-brand)' }}
                                    />
                                </a>
                            ))}
                        </motion.div>

                        {/* Mobile Menu Button - Always visible on mobile after preloader */}
                        <motion.button
                            className="absolute right-6 z-50 flex flex-col gap-[5px] md:hidden"
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
                        </motion.button>
                    </motion.nav>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                className="fixed inset-0 top-0 left-0 z-40 flex flex-col md:hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundColor:
                                        theme === 'dark'
                                            ? 'rgba(10, 10, 10, 0.97)'
                                            : 'rgba(250, 250, 250, 0.97)',
                                    backdropFilter: 'blur(24px) saturate(180%)',
                                    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                                }}
                            >
                                {/* Close button area (same height as navbar) */}
                                <div className="flex items-center justify-end px-6 py-4">
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        aria-label="Close menu"
                                        className="flex flex-col gap-[5px]"
                                    >
                                        <motion.span
                                            className="block h-[1.5px] w-6 rounded-full"
                                            style={{ backgroundColor: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                            initial={{ rotate: 0, y: 0 }}
                                            animate={{ rotate: 45, y: 6.5 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <motion.span
                                            className="block h-[1.5px] w-6 rounded-full"
                                            style={{ backgroundColor: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <motion.span
                                            className="block h-[1.5px] w-6 rounded-full"
                                            style={{ backgroundColor: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                            initial={{ rotate: 0, y: 0 }}
                                            animate={{ rotate: -45, y: -6.5 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </button>
                                </div>

                                {/* Links */}
                                <div className="flex flex-1 flex-col items-center justify-center gap-8">
                                    {ALL_LINKS.map((link, i) => (
                                        <motion.a
                                            key={link.label}
                                            href={link.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMobileMenuOpen(false);
                                                // Small delay so menu closes before scrolling
                                                setTimeout(() => {
                                                    const id = link.href.replace('#', '');
                                                    const el = document.getElementById(id);
                                                    if (el) {
                                                        el.scrollIntoView({ behavior: 'smooth' });
                                                    }
                                                }, 350);
                                            }}
                                            className="text-2xl font-medium tracking-[0.2em] uppercase"
                                            style={{
                                                fontFamily: 'var(--font-outfit)',
                                                color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
                                            }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1, duration: 0.4 }}
                                        >
                                            {link.label}
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scroll Progress - Hide initially and fade in with nav items */}
                    <motion.div style={{ opacity: navItemsOpacity }}>
                        <ScrollProgress />
                    </motion.div>
                </motion.header>
            )}
        </AnimatePresence>
    );
}
