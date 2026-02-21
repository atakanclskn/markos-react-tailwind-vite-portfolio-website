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
    createdAt: Date;
}

// --- Site Content ---
export interface HeroContent {
    slogan: string;
    welcomeText: string;
}

export interface ContactInfo {
    heading: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    statusText: string;
    statusActive: boolean;
}

export interface FounderInfo {
    name: string;
    bio: string;
    photoUrl: string;
}

export interface FooterContent {
    links: FooterLink[];
    copyright: string;
}

export interface FooterLink {
    label: string;
    url: string;
}

// --- Settings ---
export interface SiteSettings {
    googlePhotosToken?: string;
    lastSyncAt?: Date;
}

// --- Theme ---
export type Theme = 'dark' | 'light';
