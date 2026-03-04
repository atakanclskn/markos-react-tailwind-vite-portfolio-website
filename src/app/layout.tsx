import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

import { Outfit, Monoton } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const monoton = Monoton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-monoton',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Markos Studio | Premium Photography',
  description:
    'Markos Studio - Professional photography services. Landscape, Portrait, Fashion, Product, Animal, Party & Wedding, and B&W photography by Onur Satici.',
  keywords: [
    'photography',
    'studio',
    'markos',
    'onur satici',
    'landscape',
    'portrait',
    'fashion',
    'product',
    'wedding',
  ],
  openGraph: {
    title: 'Markos Studio | Premium Photography',
    description: 'Professional photography services by Markos Studio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${monoton.variable}`}>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
