import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Galeri | Markos Studio',
    description: 'Markos Studio fotograf galerisi',
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
