'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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
    // Preloader logo has already animated to navbar position
    // Show navbar immediately — logo is already where it should be
    setLoading(false);
    setShowNavbar(true);
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
    <>
      <AnimatePresence>
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
    </>
  );
}
