import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Panel | Markos Studio',
    description: 'Markos Studio content management system.',
    robots: { index: false, follow: false },
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className="font-[Outfit,sans-serif] antialiased bg-[#0a0a0a] text-[#f5f5f5]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
            >
                {children}
            </body>
        </html>
    );
}
