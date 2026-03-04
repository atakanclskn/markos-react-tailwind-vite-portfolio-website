import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthProvider from '@/components/admin/AuthProvider';

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

import { getSEOSettings } from '@/lib/firestore';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSEOSettings();

  const siteName = settings?.siteName || 'Markos Studio';
  const metaTitle = settings?.metaTitle || 'Markos Studio | Premium Photography';
  const description = settings?.metaDescription || 'Professional photography services. Landscape, Portrait, Fashion, Product, Animal, Party & Wedding, and B&W photography by Onur Satici.';

  const keywordStr = settings?.keywords || 'photography, studio, markos, onur satici, landscape, portrait, fashion, product, wedding';
  const keywordsArr = keywordStr.split(',').map((k) => k.trim()).filter(Boolean);

  return {
    title: metaTitle,
    description: description,
    keywords: keywordsArr,
    openGraph: {
      title: metaTitle,
      description: description,
      siteName: siteName,
      type: 'website',
    },
    // Allows `page.tsx` to inherit a default template: "Page Title | SiteName"
    // e.g., if a page returns `title: 'Contact'`, the final tab says `Contact | Markos Studio`
    // However, since we defined 'title' as a string above, it overrides it for the homepage.
    // So usually `template` works well, but we'll stick to dynamic top-level overriding for now.
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${monoton.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
