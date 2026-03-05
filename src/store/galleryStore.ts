import { create } from 'zustand';

interface GalleryState {
    direction: number;
    setDirection: (dir: number) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
    direction: 1,
    setDirection: (dir) => set({ direction: dir }),
}));
