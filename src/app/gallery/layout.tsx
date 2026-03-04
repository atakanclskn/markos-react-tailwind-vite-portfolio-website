import GalleryPersistentUI from './GalleryPersistentUI';

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <GalleryPersistentUI>
            {children}
        </GalleryPersistentUI>
    );
}
