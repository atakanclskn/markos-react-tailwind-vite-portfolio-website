import { create } from 'zustand';
import type {
    Category,
    Photo,
    ContactMessage,
    HeroContent,
    ContactInfo,
    FounderInfo,
    FooterContent,
    SEOSettings,
    SyncProgress,
} from '@/types';

interface AdminState {
    // --- Auth ---
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    setAuthenticated: (value: boolean) => void;
    setAuthLoading: (value: boolean) => void;

    // --- Sidebar ---
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    mobileSidebarOpen: boolean;
    setMobileSidebarOpen: (open: boolean) => void;

    // --- Dashboard Stats ---
    stats: {
        totalMessages: number;
        unreadMessages: number;
        totalPhotos: number;
        totalCategories: number;
    };
    setStats: (stats: AdminState['stats']) => void;

    // --- Messages ---
    messages: ContactMessage[];
    selectedMessageId: string | null;
    messageFilter: 'inbox' | 'starred' | 'archived';
    setMessages: (messages: ContactMessage[]) => void;
    setSelectedMessageId: (id: string | null) => void;
    setMessageFilter: (filter: 'inbox' | 'starred' | 'archived') => void;
    updateMessage: (id: string, data: Partial<ContactMessage>) => void;
    removeMessage: (id: string) => void;

    // --- Categories ---
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;
    updateCategory: (id: string, data: Partial<Category>) => void;
    removeCategory: (id: string) => void;

    // --- Photos ---
    photos: Photo[];
    setPhotos: (photos: Photo[]) => void;
    removePhoto: (id: string) => void;

    // --- Section Texts ---
    heroContent: HeroContent | null;
    founderInfo: FounderInfo | null;
    contactInfo: ContactInfo | null;
    setHeroContent: (data: HeroContent) => void;
    setFounderInfo: (data: FounderInfo) => void;
    setContactInfo: (data: ContactInfo) => void;

    // --- Settings ---
    footerContent: FooterContent | null;
    seoSettings: SEOSettings | null;
    setFooterContent: (data: FooterContent) => void;
    setSEOSettings: (data: SEOSettings) => void;

    // --- Sync ---
    syncProgress: SyncProgress;
    setSyncProgress: (progress: SyncProgress) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    // --- Auth ---
    isAuthenticated: false,
    isAuthLoading: true,
    setAuthenticated: (value) => set({ isAuthenticated: value }),
    setAuthLoading: (value) => set({ isAuthLoading: value }),

    // --- Sidebar ---
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    mobileSidebarOpen: false,
    setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

    // --- Dashboard Stats ---
    stats: {
        totalMessages: 0,
        unreadMessages: 0,
        totalPhotos: 0,
        totalCategories: 0,
    },
    setStats: (stats) => set({ stats }),

    // --- Messages ---
    messages: [],
    selectedMessageId: null,
    messageFilter: 'inbox',
    setMessages: (messages) => set({ messages }),
    setSelectedMessageId: (id) => set({ selectedMessageId: id }),
    setMessageFilter: (filter) => set({ messageFilter: filter, selectedMessageId: null }),
    updateMessage: (id, data) =>
        set((state) => ({
            messages: state.messages.map((m) => (m.id === id ? { ...m, ...data } : m)),
        })),
    removeMessage: (id) =>
        set((state) => ({
            messages: state.messages.filter((m) => m.id !== id),
            selectedMessageId: state.selectedMessageId === id ? null : state.selectedMessageId,
        })),

    // --- Categories ---
    categories: [],
    setCategories: (categories) => set({ categories }),
    addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
    updateCategory: (id, data) =>
        set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
    removeCategory: (id) =>
        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        })),

    // --- Photos ---
    photos: [],
    setPhotos: (photos) => set({ photos }),
    removePhoto: (id) =>
        set((state) => ({
            photos: state.photos.filter((p) => p.id !== id),
        })),

    // --- Section Texts ---
    heroContent: null,
    founderInfo: null,
    contactInfo: null,
    setHeroContent: (data) => set({ heroContent: data }),
    setFounderInfo: (data) => set({ founderInfo: data }),
    setContactInfo: (data) => set({ contactInfo: data }),

    // --- Settings ---
    footerContent: null,
    seoSettings: null,
    setFooterContent: (data) => set({ footerContent: data }),
    setSEOSettings: (data) => set({ seoSettings: data }),

    // --- Sync ---
    syncProgress: { status: 'idle', total: 0, current: 0, message: '' },
    setSyncProgress: (progress) => set({ syncProgress: progress }),
}));
