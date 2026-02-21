'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BentoGrid from '@/components/BentoGrid';
import FounderSection from '@/components/FounderSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(false);
  const router = useRouter();

  const handlePreloaderComplete = () => {
    setLoading(false);
    // Small delay before showing navbar to allow smooth exit
    setTimeout(() => setShowNavbar(true), 200);
  };

  const handleCategoryClick = (category: string) => {
    const slug = category
      .toLowerCase()
      .replace(/ & /g, '-')
      .replace(/&/g, '-')
      .replace(/ /g, '-');
    router.push(`/gallery/${slug}`);
  };

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader key="preloader" onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <Navbar visible={showNavbar} />

          <main>
            <Hero />
            <BentoGrid onCategoryClick={handleCategoryClick} />
            <FounderSection />
            <ContactSection />
          </main>

          <Footer />
        </>
      )}
    </LayoutGroup>
  );
}
