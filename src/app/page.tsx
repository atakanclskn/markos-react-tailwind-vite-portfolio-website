'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import FounderSection from '@/components/FounderSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Small delay to ensure client-side hydration and font painting
  // before revealing the DOM, preventing the fallback font flash.
  import('react').then((React) => {
    React.useEffect(() => {
      setMounted(true);
    }, []);
  });

  const handleCategoryClick = (category: string) => {
    const slug = category
      .toLowerCase()
      .replace(/ & /g, '-')
      .replace(/&/g, '-')
      .replace(/ /g, '-');
    router.push(`/gallery/${slug}`);
  };

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.2s ease-in'
      }}
    >
      <Navbar visible={true} />

      <main>
        <Preloader />
        <Hero />
        <BentoGrid onCategoryClick={handleCategoryClick} />
        <FounderSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
