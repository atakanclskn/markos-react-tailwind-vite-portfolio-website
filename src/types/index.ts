// --- Category ---
export interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
    createdAt: Date;
}

// --- Photo ---
export interface Photo {
    id: string;
    categoryId: string;
    storageUrl: string;
    thumbnailUrl: string;
    order: number;
    createdAt: Date;
    googlePhotosId?: string;
    googleDriveId?: string;
    width?: number;
    height?: number;
}

// --- Contact Message ---
export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    read: boolean;
    starred: boolean;
    archived: boolean;
    createdAt: Date;
}

// --- Site Content ---
export interface HeroContent {
    title: string;
    subtitle: string;
    buttonText: string;
}

export interface ContactInfo {
    heading: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    statusText: string;
    statusActive: boolean;
}

export interface FounderInfo {
    name: string;
    title: string;
    bio: string;
    photoUrl: string;
    stats: FounderStat[];
}

export interface FounderStat {
    value: string;
    label: string;
}

export interface FooterContent {
    copyright: string;
    socialLinks: SocialLink[];
}

export interface SocialLink {
    iconName: string;
    url: string;
}

// --- SEO Settings ---
export interface SEOSettings {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
}

// --- Site Settings ---
export interface BentoGridSettings {
    animationIntervalSeconds: number;
}

export interface SiteSettings {
    seo: SEOSettings;
    footer: FooterContent;
}

// --- Google Photos ---
export interface GooglePhotosAlbum {
    id: string;
    title: string;
    mediaItemsCount: string;
    coverPhotoBaseUrl: string;
}

export interface SyncProgress {
    status: 'idle' | 'syncing' | 'complete' | 'error';
    total: number;
    current: number;
    message: string;
}

// --- Theme ---
export type Theme = 'dark' | 'light';
