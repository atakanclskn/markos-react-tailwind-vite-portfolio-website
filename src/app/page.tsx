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
  const router = useRouter();

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
      <Navbar visible={true} />

      <main>
        <Preloader />
        <Hero />
        <BentoGrid onCategoryClick={handleCategoryClick} />
        <FounderSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
