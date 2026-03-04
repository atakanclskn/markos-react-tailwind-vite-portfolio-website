import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: 'markos-studio-3eb8e',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '0:000:web:000',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    console.log("Fetching collection...");
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    try {
        const snap = await getDocs(q);
        console.log(`Found ${snap.docs.length} categories with order:`);
        snap.docs.forEach(d => {
            console.log(d.data().name, d.data().order);
        });

        console.log("\nFetching ALL categories without order:");
        const snap2 = await getDocs(collection(db, 'categories'));
        console.log(`Found ${snap2.docs.length} total categories:`);
        snap2.docs.forEach(d => {
            console.log(d.data().name, d.data().order);
        });
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

test();
