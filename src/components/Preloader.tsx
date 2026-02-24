'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

// Demo placeholder images for development
const IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    'https://images.unsplash.com/photo-1518173946687-a243486a29b0?w=800&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
];

const TOTAL = IMAGES.length;
const SLIDE_INTERVAL = 3500;
const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Gap between cards in vw (matches the style below)
const GAP_VW = 2;
// Side card width
const SIDE_W = 22;
// Slide step = side card width + gap (mathematically proven to make reset seamless)
const STEP_VW = SIDE_W + GAP_VW; // 24vw

function getImg(i: number) {
    return IMAGES[((i % TOTAL) + TOTAL) % TOTAL];
}

export default function Preloader() {
    // imageBase tracks which image is shown in the center (slot 2) when at rest
    const [imageBase, setImageBase] = useState(0);
    // slidingOffset: 0 = at rest, 1 = sliding one position left
    const [slidingOffset, setSlidingOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'loading' | 'transforming' | 'scrolling'>('loading');
    const sectionRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);

    // Auto-advance carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setSlidingOffset(1);
        }, SLIDE_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    // After CSS transition ends, reset position instantly
    const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
        // Only respond to the strip's own transform transition
        if (e.target !== stripRef.current) return;

        // Batch all resets into one render with no transition
        setIsAnimating(false);
        setSlidingOffset(0);
        setImageBase((prev) => prev + 1);
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

    // Handle phase transitions (split to avoid cleanup race)
    useEffect(() => {
        if (progress >= 100 && phase === 'loading') {
            setPhase('transforming');
        }
    }, [progress, phase]);

    useEffect(() => {
        if (phase === 'transforming') {
            const timeout = setTimeout(() => {
                setPhase('scrolling');
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [phase]);

    // Lock scroll until loading is complete
    useEffect(() => {
        if (phase === 'scrolling') return;

        const prevent = (e: Event) => e.preventDefault();
        const preventKeys = (e: KeyboardEvent) => {
            const scrollKeys = ['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp', 'Home', 'End'];
            if (scrollKeys.includes(e.key)) e.preventDefault();
        };

        window.addEventListener('wheel', prevent, { passive: false });
        window.addEventListener('touchmove', prevent, { passive: false });
        window.addEventListener('keydown', preventKeys, { passive: false });

        return () => {
            window.removeEventListener('wheel', prevent);
            window.removeEventListener('touchmove', prevent);
            window.removeEventListener('keydown', preventKeys);
        };
    }, [phase]);

    // After user scrolls past preloader, collapse it
    useEffect(() => {
        if (phase !== 'scrolling') return;

        const handleScroll = () => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                if (rect.bottom < 0) {
                    sectionRef.current.style.height = '0px';
                    sectionRef.current.style.minHeight = '0px';
                    sectionRef.current.style.overflow = 'hidden';
                    sectionRef.current.style.position = 'absolute';
                    window.removeEventListener('scroll', handleScroll);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [phase]);

    // TranslateX for the strip
    const translateX = -(slidingOffset * STEP_VW);

    // 5 fixed slots (keys 0..4), slot 2 is the center at rest
    // Image for slot i = imageBase + (i - 2)
    // Effective visual position = (i - 2) - slidingOffset
    // isCenter when effective position = 0

    return (
        <motion.div
            ref={sectionRef}
            className="relative z-40 flex h-[100vh] w-full items-center justify-center overflow-hidden"
            style={{ backgroundColor: '#050505' }}
        >
            {/* Background overlay */}
            <div className="absolute inset-0" style={{ backgroundColor: '#050505' }} />

            {/* Sliding Carousel Strip */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.08]">
                <div
                    ref={stripRef}
                    className="flex items-center"
                    style={{
                        gap: `${GAP_VW}vw`,
                        transform: `translateX(${translateX}vw)`,
                        transition: isAnimating
                            ? `transform 1.8s ${EASING}`
                            : 'none',
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {[0, 1, 2, 3, 4].map((slotIdx) => {
                        const imgIndex = imageBase + (slotIdx - 2);
                        const effectivePos = (slotIdx - 2) - slidingOffset;
                        const isCenter = effectivePos === 0;

                        return (
                            <div
                                key={slotIdx}
                                className="flex-shrink-0 overflow-hidden rounded-xl"
                                style={{
                                    width: isCenter ? '32vw' : `${SIDE_W}vw`,
                                    height: isCenter ? '50vh' : '38vh',
                                    transition: isAnimating
                                        ? `width 1.8s ${EASING}, height 1.8s ${EASING}`
                                        : 'none',
                                }}
                            >
                                <img
                                    src={getImg(imgIndex)}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="eager"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Side gradient masks to hide edge images */}
            <div
                className="pointer-events-none absolute top-0 left-0 h-full z-10"
                style={{
                    width: '18vw',
                    background: 'linear-gradient(to right, #050505 0%, #050505 30%, transparent 100%)',
                }}
            />
            <div
                className="pointer-events-none absolute top-0 right-0 h-full z-10"
                style={{
                    width: '18vw',
                    background: 'linear-gradient(to left, #050505 0%, #050505 30%, transparent 100%)',
                }}
            />

            {/* Combined Progress / Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 z-10 flex-col items-center justify-center min-h-[80px]">
                <motion.div
                    className="relative overflow-hidden"
                    style={{ borderRadius: '2px' }}
                    initial={{ width: '192px', height: '1px', opacity: 0, backgroundColor: 'rgba(255,255,255,0.10)' }}
                    animate={{
                        opacity: 1,
                        width: phase === 'loading' ? '192px' : '1px',
                        height: phase === 'loading' ? '1px' : '80px',
                        backgroundColor: phase === 'loading' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.20)',
                    }}
                    transition={{
                        default: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
                        opacity: { delay: phase === 'loading' ? 1 : 0, duration: 0.5 },
                    }}
                >
                    {/* Horizontal Loading Fill */}
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-white/50"
                        style={{ width: `${progress}%` }}
                        animate={{ opacity: phase === 'loading' ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Vertical Scroll Line Indicator */}
                    {phase === 'scrolling' && (
                        <div
                            className="absolute left-0 top-0 w-full scroll-light-anim"
                            style={{
                                height: '33.33%',
                                backgroundColor: '#ffffff',
                            }}
                        />
                    )}
                </motion.div>
            </div>

            {/* Bottom gradient fade into next section */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 w-full h-32 z-20"
                style={{
                    background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)',
                }}
            />
        </motion.div>
    );
}
