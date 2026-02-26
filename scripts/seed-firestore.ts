/**
 * Firestore Seed Script
 * 
 * Populates the Firestore database with initial/default site content
 * so the frontend has data to display and the admin panel has content to edit.
 * 
 * Usage: npx tsx scripts/seed-firestore.ts
 */

import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
} from 'firebase/firestore';

// Load env vars
import { config } from 'dotenv';
config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('🔥 Initializing Firebase...');
console.log('   Project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// SEED DATA
// ============================================================

const heroContent = {
    title: 'Capturing Timeless Moments',
    subtitle: 'Premium photography that transforms your vision into art. Every frame tells a unique story.',
    buttonText: 'View Portfolio',
};

const founderInfo = {
    name: 'Markos',
    title: 'Photographer & Creative Director',
    bio: 'With over a decade of experience capturing life\'s most precious moments, I bring a unique artistic vision to every project. My approach combines technical excellence with creative storytelling, ensuring each photograph tells a compelling story.',
    photoUrl: '',
    stats: [
        { value: '10+', label: 'Years Experience' },
        { value: '500+', label: 'Projects Completed' },
        { value: '50+', label: 'Awards Won' },
    ],
};

const contactInfo = {
    heading: 'Start Your Project',
    description: "Get in touch to bring your project to life. We'll get back to you as soon as possible.",
    email: 'info@markosstudio.com',
    phone: '+44 747 384 6666',
    address: 'Manchester, United Kingdom',
    statusText: 'Currently available for new projects',
    statusActive: true,
};

const footerContent = {
    copyright: `© ${new Date().getFullYear()} Markos Studio. All rights reserved.`,
    socialLinks: [
        { iconName: 'Instagram', url: 'https://instagram.com/markosstudio' },
        { iconName: 'Twitter', url: 'https://twitter.com/markosstudio' },
        { iconName: 'Behance', url: 'https://behance.net/markosstudio' },
        { iconName: 'LinkedIn', url: 'https://linkedin.com/in/markosstudio' },
    ],
};

const seoSettings = {
    metaTitle: 'Markos Studio | Premium Photography',
    metaDescription: 'Premium photography services that transform your moments into art. Specializing in landscape, portrait, fashion, product, and event photography.',
    keywords: 'photography, studio, portrait, landscape, fashion, wedding, product photography, Manchester',
};

const categories = [
    { name: 'Landscape', slug: 'landscape', order: 0 },
    { name: 'Portrait', slug: 'portrait', order: 1 },
    { name: 'Animal', slug: 'animal', order: 2 },
    { name: 'Fashion', slug: 'fashion', order: 3 },
    { name: 'Product', slug: 'product', order: 4 },
    { name: 'Party & Wedding', slug: 'party-wedding', order: 5 },
    { name: 'B&W', slug: 'b-w', order: 6 },
];

// ============================================================
// SEED FUNCTIONS
// ============================================================

async function seedSiteContent() {
    console.log('\n📝 Seeding site content...');

    await setDoc(doc(db, 'siteContent', 'hero'), heroContent);
    console.log('   ✅ Hero content');

    await setDoc(doc(db, 'siteContent', 'founder'), founderInfo);
    console.log('   ✅ Founder info');

    await setDoc(doc(db, 'siteContent', 'contact'), contactInfo);
    console.log('   ✅ Contact info');

    await setDoc(doc(db, 'siteContent', 'footer'), footerContent);
    console.log('   ✅ Footer content');

    await setDoc(doc(db, 'siteContent', 'seo'), seoSettings);
    console.log('   ✅ SEO settings');
}

async function seedCategories() {
    console.log('\n📂 Seeding categories...');

    // Check if categories already exist
    const existing = await getDocs(collection(db, 'categories'));
    if (existing.size > 0) {
        console.log(`   ⚠️  ${existing.size} categories already exist, skipping...`);
        return;
    }

    for (const cat of categories) {
        await addDoc(collection(db, 'categories'), {
            ...cat,
            createdAt: serverTimestamp(),
        });
        console.log(`   ✅ ${cat.name}`);
    }
}

async function main() {
    console.log('\n🌱 Starting Firestore seed...\n');
    console.log('=' .repeat(50));

    try {
        await seedSiteContent();
        await seedCategories();

        console.log('\n' + '='.repeat(50));
        console.log('\n🎉 Seed complete! Your Firestore database is now populated.');
        console.log('\n💡 Next steps:');
        console.log('   1. Go to https://console.firebase.google.com to verify data');
        console.log('   2. Run "npm run dev" and check the site');
        console.log('   3. Go to /admin to edit content from the admin panel');
        console.log('');
    } catch (error: any) {
        console.error('\n❌ Seed failed:', error.message);
        
        if (error.code === 'permission-denied') {
            console.log('\n🔒 Firestore security rules are blocking writes.');
            console.log('   Go to Firebase Console → Firestore → Rules and set:');
            console.log('');
            console.log('   rules_version = \'2\';');
            console.log('   service cloud.firestore {');
            console.log('     match /databases/{database}/documents {');
            console.log('       match /{document=**} {');
            console.log('         allow read, write: if true;');
            console.log('       }');
            console.log('     }');
            console.log('   }');
            console.log('');
            console.log('   ⚠️  This is for development only. Set proper rules before going live!');
        }
        
        process.exit(1);
    }

    process.exit(0);
}

main();
