import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Monoton&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://challenges.cloudflare.com" />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
