'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import GalleryDock from '@/components/GalleryDock';

// Placeholder gallery images per category for development
const GALLERY_IMAGES: Record<string, string[]> = {
    landscape: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=85',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=85',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85',
    ],
    portrait: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=85',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=85',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=85',
        'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1200&q=85',
    ],
    animal: [
        'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=1200&q=85',
        'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=1200&q=85',
        'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1200&q=85',
        'https://images.unsplash.com/photo-1425082661507-6d4d3f25f7da?w=1200&q=85',
        'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=1200&q=85',
    ],
    fashion: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85',
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=85',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=85',
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=85',
    ],
    product: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200&q=85',
        'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=85',
    ],
    'party-wedding': [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=85',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85',
        'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=1200&q=85',
    ],
    'b-w': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85',
        'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=1200&q=85',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
        'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=1200&q=85',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=85',
    ],
};

const CATEGORY_LABELS: Record<string, string> = {
    landscape: 'Landscape',
    portrait: 'Portrait',
    animal: 'Animal',
    fashion: 'Fashion',
    product: 'Product',
    'party-wedding': 'Party & Wedding',
    'b-w': 'B&W',
};

export default function GalleryPage() {
    const params = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const categorySlug = params.category as string;
    const categoryLabel = CATEGORY_LABELS[categorySlug] || categorySlug;
    const images = GALLERY_IMAGES[categorySlug] || [];

    if (!images.length) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p
                    className="text-lg"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    }}
                >
                    Kategori bulunamadi
                </p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-24">
            {/* Back button + category title */}
            <motion.header
                className="fixed top-0 left-0 z-40 flex w-full items-center justify-between px-6 py-5 md:px-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 100%)'
                        : 'linear-gradient(to bottom, rgba(250,250,250,0.9) 0%, transparent 100%)',
                }}
            >
                {/* Back button */}
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
                    style={{
                        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                    }}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span
                        className="text-sm font-medium tracking-wider uppercase"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                        Geri
                    </span>
                </button>

                {/* Category name */}
                <h1
                    className="text-lg font-bold tracking-wider uppercase sm:text-xl"
                    style={{
                        fontFamily: 'var(--font-outfit)',
                        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                    }}
                >
                    {categoryLabel}
                </h1>

                {/* Spacer for centering */}
                <div className="w-16" />
            </motion.header>

            {/* Immersive photo feed */}
            <div className="mx-auto max-w-5xl px-4 pt-24 sm:px-6">
                {images.map((src, index) => (
                    <motion.div
                        key={index}
                        className="mb-6 overflow-hidden rounded-xl sm:mb-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8, delay: index * 0.05 }}
                    >
                        <motion.img
                            src={src}
                            alt={`${categoryLabel} - ${index + 1}`}
                            className="w-full object-cover"
                            style={{
                                filter: categorySlug === 'b-w' ? 'grayscale(100%)' : 'none',
                            }}
                            loading="lazy"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Gallery Dock */}
            <GalleryDock activeCategory={categorySlug} />
        </div>
    );
}
