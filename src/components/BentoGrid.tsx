'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Her kategori için premium crossfade efekti yaratacak çoklu görseller
const CATEGORIES = [
    { id: "landscape", title: "Landscape", images: ["https://picsum.photos/seed/land1/1200/800", "https://picsum.photos/seed/land2/1200/800", "https://picsum.photos/seed/land3/1200/800"] },
    { id: "portrait", title: "Portre", images: ["https://picsum.photos/seed/port1/800/1200", "https://picsum.photos/seed/port2/800/1200", "https://picsum.photos/seed/port3/800/1200"] },
    { id: "animal", title: "Animal", images: ["https://picsum.photos/seed/anim1/1000/1000", "https://picsum.photos/seed/anim2/1000/1000", "https://picsum.photos/seed/anim3/1000/1000"] },
    { id: "fashion", title: "Fashion", images: ["https://picsum.photos/seed/fash1/800/1200", "https://picsum.photos/seed/fash2/800/1200", "https://picsum.photos/seed/fash3/800/1200"] },
    { id: "product", title: "Product", images: ["https://picsum.photos/seed/prod1/1000/800", "https://picsum.photos/seed/prod2/1000/800", "https://picsum.photos/seed/prod3/1000/800"] },
    { id: "wedding", title: "Party & Wedding", images: ["https://picsum.photos/seed/wed1/1200/800", "https://picsum.photos/seed/wed2/1200/800", "https://picsum.photos/seed/wed3/1200/800"] },
    { id: "bw", title: "B&W", images: ["https://picsum.photos/seed/bw1/1000/1000", "https://picsum.photos/seed/bw2/1000/1000", "https://picsum.photos/seed/bw3/1000/1000"] },
];

// Grid'i 2 satıra bölüyoruz (3 üstte, 4 altta)
const ROW1 = CATEGORIES.slice(0, 3);
const ROW2 = CATEGORIES.slice(3, 7);

// Rastgele flex ağırlıkları üreten yardımcı fonksiyon
const getRandomWeights = (count: number) => {
    return Array.from({ length: count }, () => Math.random() * 2 + 1); // 1 ile 3 arası değerler
};

interface BentoGridProps {
    onCategoryClick: (category: string) => void;
}

function GridItem({ category, weight, onClick }: { category: typeof CATEGORIES[0], weight: number, onClick: (category: string) => void }) {
    const [imgIndex, setImgIndex] = useState(0);

    // Görsellerin rastgele aralıklarla, çok yavaş değişmesini sağlayan effect
    useEffect(() => {
        const intervalTime = Math.random() * 6000 + 6000; // 6 ile 12 saniye arası rastgele
        const timer = setInterval(() => {
            setImgIndex((prev) => (prev + 1) % category.images.length);
        }, intervalTime);
        return () => clearInterval(timer);
    }, [category.images.length]);

    return (
        <motion.div
            layout
            animate={{ flex: weight }}
            transition={{ duration: 4, ease: "easeInOut" }} // Çok daha yavaş ve organik geçiş
            onClick={() => onClick(category.id)}
            className="relative h-full overflow-hidden group cursor-pointer bg-zinc-900"
        >
            {/* Soft Crossfade Image Swap */}
            <AnimatePresence mode="popLayout">
                <motion.img
                    key={imgIndex}
                    src={category.images[imgIndex]}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeInOut" }} // Premium yavaş geçiş
                    referrerPolicy="no-referrer"
                />
            </AnimatePresence>

            {/* Hover Effect & Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
            <motion.div
                className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />

            {/* Category Label */}
            <div className="absolute bottom-6 left-6 flex items-center gap-4 z-10">
                <div className="w-8 h-[1px] bg-white/50 group-hover:w-16 group-hover:bg-white transition-all duration-700 ease-out" />
                <span className="text-white font-medium tracking-[0.2em] uppercase text-xs md:text-sm drop-shadow-lg">
                    {category.title}
                </span>
            </div>
        </motion.div>
    );
}

export default function BentoGrid({ onCategoryClick }: BentoGridProps) {
    const [row1Weights, setRow1Weights] = useState(() => getRandomWeights(ROW1.length));
    const [row2Weights, setRow2Weights] = useState(() => getRandomWeights(ROW2.length));

    // Grid karelerinin boyutlarını asenkron ve tek tek değiştiren effect
    useEffect(() => {
        // Üst satır için bağımsız döngü: Her 3.5 saniyede sadece RASTGELE BİR kutunun boyutu değişir
        const timer1 = setInterval(() => {
            setRow1Weights((prev) => {
                const next = [...prev];
                const randomIndex = Math.floor(Math.random() * next.length);
                next[randomIndex] = Math.random() * 2 + 1;
                return next;
            });
        }, 3500);

        // Alt satır için bağımsız döngü: Her 4.8 saniyede sadece RASTGELE BİR kutunun boyutu değişir
        const timer2 = setInterval(() => {
            setRow2Weights((prev) => {
                const next = [...prev];
                const randomIndex = Math.floor(Math.random() * next.length);
                next[randomIndex] = Math.random() * 2 + 1;
                return next;
            });
        }, 4800);

        return () => {
            clearInterval(timer1);
            clearInterval(timer2);
        };
    }, []);

    return (
        <section id="categories" className="py-32 px-4 md:px-12 max-w-[1600px] mx-auto">
            <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        PORTFOLYO
                    </h2>
                    <div className="w-24 h-[1px] bg-[var(--color-foreground)] mt-6 opacity-20" />
                </div>
                <p className="text-[var(--color-muted)] text-sm md:text-base max-w-sm md:text-right font-light tracking-wide leading-relaxed">
                    Discover our work across different disciplines. Each frame holds its own story.
                </p>
            </div>

            {/* 16:9 Kusursuz Container */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden flex flex-col gap-2 bg-black/50 border border-white/5 shadow-2xl">
                {/* Row 1 */}
                <div className="flex-1 flex gap-2 w-full">
                    {ROW1.map((cat, i) => (
                        <GridItem key={cat.id} category={cat} weight={row1Weights[i]} onClick={onCategoryClick} />
                    ))}
                </div>
                {/* Row 2 */}
                <div className="flex-1 flex gap-2 w-full">
                    {ROW2.map((cat, i) => (
                        <GridItem key={cat.id} category={cat} weight={row2Weights[i]} onClick={onCategoryClick} />
                    ))}
                </div>
            </div>
        </section>
    );
}
