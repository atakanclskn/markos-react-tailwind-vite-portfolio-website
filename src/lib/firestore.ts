import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    DocumentData,
    getCountFromServer,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
    Category,
    Photo,
    ContactMessage,
    HeroContent,
    ContactInfo,
    FounderInfo,
    FooterContent,
    SEOSettings,
    LegalContent,
} from '@/types';

// --- Categories ---
export async function getCategories(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
    })) as Category[];
}

export async function addCategory(data: Omit<Category, 'id' | 'createdAt'>) {
    return addDoc(collection(db, 'categories'), {
        ...data,
        createdAt: serverTimestamp(),
    });
}

export async function updateCategory(id: string, data: Partial<Category>) {
    return updateDoc(doc(db, 'categories', id), data as DocumentData);
}

export async function deleteCategory(id: string) {
    return deleteDoc(doc(db, 'categories', id));
}

// --- Photos ---
export async function getPhotosByCategory(categoryId: string): Promise<Photo[]> {
    // Using only 'where' (no orderBy) to avoid needing a composite Firestore index.
    // We sort client-side instead.
    const q = query(
        collection(db, 'photos'),
        where('categoryId', '==', categoryId)
    );
    const snapshot = await getDocs(q);
    const photos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
    })) as Photo[];

    // Sort by 'order' ascending client-side
    return photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// --- Cache for Gallery Prefetching ---
// This allows the GalleryDock to fetch photos *before* triggering a route transition.
const globalPhotosCache = new Map<string, Photo[]>();

export const getPhotosFromCache = (categorySlug: string): Photo[] | null => {
    return globalPhotosCache.get(categorySlug) || null;
};

export const prefetchPhotosForCategory = async (categorySlug: string): Promise<Photo[]> => {
    if (globalPhotosCache.has(categorySlug)) {
        return globalPhotosCache.get(categorySlug)!;
    }

    // Find category ID
    const cats = await getCategories();
    const cat = cats.find(c => c.slug === categorySlug);
    if (!cat || !cat.id) return [];

    const photos = await getPhotosByCategory(cat.id);
    globalPhotosCache.set(categorySlug, photos);
    return photos;
};

export async function getAllPhotos(): Promise<Photo[]> {
    const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
    })) as Photo[];
}

// --- Messages ---
export async function submitContactMessage(
    data: Omit<ContactMessage, 'id' | 'read' | 'starred' | 'archived' | 'createdAt'>
) {
    // Use Firestore REST API to avoid client SDK hanging on permission denied
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (!projectId || !apiKey) {
        throw new Error('Firebase configuration missing');
    }

    const now = new Date().toISOString();
    const firestoreDoc = {
        fields: {
            name: { stringValue: data.name || '' },
            subject: { stringValue: data.subject || '' },
            email: { stringValue: data.email || '' },
            phone: { stringValue: data.phone || '' },
            message: { stringValue: data.message || '' },
            read: { booleanValue: false },
            starred: { booleanValue: false },
            archived: { booleanValue: false },
            createdAt: { timestampValue: now },
        },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/messages?key=${apiKey}`;

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreDoc),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Firestore REST write failed:', err);
        throw new Error('Failed to save message');
    }

    return res.json();
}

export async function getMessages(): Promise<ContactMessage[]> {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        starred: doc.data().starred ?? false,
        archived: doc.data().archived ?? false,
        createdAt: doc.data().createdAt?.toDate(),
    })) as ContactMessage[];
}

export async function markMessageRead(id: string) {
    return updateDoc(doc(db, 'messages', id), { read: true });
}

export async function toggleMessageStarred(id: string, starred: boolean) {
    return updateDoc(doc(db, 'messages', id), { starred });
}

export async function toggleMessageArchived(id: string, archived: boolean) {
    return updateDoc(doc(db, 'messages', id), { archived });
}

export async function deleteMessage(id: string) {
    return deleteDoc(doc(db, 'messages', id));
}

// --- Site Content ---
export async function getHeroContent(): Promise<HeroContent | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'hero'));
    return snap.exists() ? (snap.data() as HeroContent) : null;
}

export async function updateHeroContent(data: HeroContent) {
    return setDoc(doc(db, 'siteContent', 'hero'), data as DocumentData, { merge: true });
}

export async function getContactInfo(): Promise<ContactInfo | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'contact'));
    return snap.exists() ? (snap.data() as ContactInfo) : null;
}

export async function updateContactInfo(data: ContactInfo) {
    return setDoc(doc(db, 'siteContent', 'contact'), data as DocumentData, { merge: true });
}

export async function getFounderInfo(): Promise<FounderInfo | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'founder'));
    return snap.exists() ? (snap.data() as FounderInfo) : null;
}

export async function updateFounderInfo(data: Partial<FounderInfo>) {
    return setDoc(doc(db, 'siteContent', 'founder'), data as DocumentData, { merge: true });
}

export async function getFooterContent(): Promise<FooterContent | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'footer'));
    return snap.exists() ? (snap.data() as FooterContent) : null;
}

export async function updateFooterContent(data: FooterContent) {
    return setDoc(doc(db, 'siteContent', 'footer'), data as DocumentData, { merge: true });
}

// --- Photos (Admin) ---
export async function addPhoto(data: Omit<Photo, 'id' | 'createdAt'>) {
    return addDoc(collection(db, 'photos'), {
        ...data,
        createdAt: serverTimestamp(),
    });
}

export async function updatePhoto(id: string, data: Partial<Photo>) {
    return updateDoc(doc(db, 'photos', id), data as DocumentData);
}

export async function deletePhoto(id: string) {
    return deleteDoc(doc(db, 'photos', id));
}

// --- SEO Settings ---
export async function getSEOSettings(): Promise<SEOSettings | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'seo'));
    return snap.exists() ? (snap.data() as SEOSettings) : null;
}

export async function updateSEOSettings(data: SEOSettings) {
    return setDoc(doc(db, 'siteContent', 'seo'), data as DocumentData, { merge: true });
}

// --- BentoGrid Settings ---
import type { BentoGridSettings } from '@/types';
export async function getBentoGridSettings(): Promise<BentoGridSettings | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'bentoGrid'));
    return snap.exists() ? (snap.data() as BentoGridSettings) : null;
}

export async function updateBentoGridSettings(data: BentoGridSettings) {
    return setDoc(doc(db, 'siteContent', 'bentoGrid'), data as DocumentData, { merge: true });
}

// --- Counts (Dashboard) ---
export async function getCollectionCount(collectionName: string): Promise<number> {
    const coll = collection(db, collectionName);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
}

export async function getUnreadMessageCount(): Promise<number> {
    const q = query(collection(db, 'messages'), where('read', '==', false));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
}

// --- Appearance Settings ---
import type { AppearanceSettings } from '@/types';

export async function getAppearanceSettings(): Promise<AppearanceSettings | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'appearance'));
    return snap.exists() ? (snap.data() as AppearanceSettings) : null;
}

export async function updateAppearanceSettings(data: AppearanceSettings) {
    return setDoc(doc(db, 'siteContent', 'appearance'), data as DocumentData, { merge: true });
}

// --- Preloader Settings ---
import type { PreloaderSettings } from '@/types';

export async function getPreloaderSettings(): Promise<PreloaderSettings | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'preloader'));
    return snap.exists() ? (snap.data() as PreloaderSettings) : null;
}

export async function updatePreloaderSettings(data: PreloaderSettings) {
    return setDoc(doc(db, 'siteContent', 'preloader'), data as DocumentData, { merge: true });
}

// --- Legal Settings ---
export async function getLegalContent(): Promise<LegalContent | null> {
    const docRef = doc(db, 'settings', 'legal');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as LegalContent;
    }
    return null;
}

export async function updateLegalContent(data: LegalContent) {
    return setDoc(doc(db, 'settings', 'legal'), data, { merge: true });
}
