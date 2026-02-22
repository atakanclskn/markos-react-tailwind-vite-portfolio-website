import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gallery | Markos Studio',
    description: 'Markos Studio photography gallery',
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
