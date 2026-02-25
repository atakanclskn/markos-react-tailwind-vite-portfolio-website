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
    const q = query(
        collection(db, 'photos'),
        where('categoryId', '==', categoryId),
        orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
    })) as Photo[];
}

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
    return addDoc(collection(db, 'messages'), {
        ...data,
        read: false,
        starred: false,
        archived: false,
        createdAt: serverTimestamp(),
    });
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
