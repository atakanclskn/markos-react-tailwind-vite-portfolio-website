import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    DocumentData,
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
    data: Omit<ContactMessage, 'id' | 'read' | 'createdAt'>
) {
    return addDoc(collection(db, 'messages'), {
        ...data,
        read: false,
        createdAt: serverTimestamp(),
    });
}

export async function getMessages(): Promise<ContactMessage[]> {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
    })) as ContactMessage[];
}

export async function markMessageRead(id: string) {
    return updateDoc(doc(db, 'messages', id), { read: true });
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
    return updateDoc(doc(db, 'siteContent', 'hero'), data as DocumentData);
}

export async function getContactInfo(): Promise<ContactInfo | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'contact'));
    return snap.exists() ? (snap.data() as ContactInfo) : null;
}

export async function updateContactInfo(data: ContactInfo) {
    return updateDoc(doc(db, 'siteContent', 'contact'), data as DocumentData);
}

export async function getFounderInfo(): Promise<FounderInfo | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'founder'));
    return snap.exists() ? (snap.data() as FounderInfo) : null;
}

export async function updateFounderInfo(data: Partial<FounderInfo>) {
    return updateDoc(doc(db, 'siteContent', 'founder'), data as DocumentData);
}

export async function getFooterContent(): Promise<FooterContent | null> {
    const snap = await getDoc(doc(db, 'siteContent', 'footer'));
    return snap.exists() ? (snap.data() as FooterContent) : null;
}

export async function updateFooterContent(data: FooterContent) {
    return updateDoc(doc(db, 'siteContent', 'footer'), data as DocumentData);
}
