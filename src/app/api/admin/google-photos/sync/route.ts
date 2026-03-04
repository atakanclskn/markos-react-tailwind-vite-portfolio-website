import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Initialize Firebase Admin (server-side)
function getAdminApp() {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    // Try service account JSON first, fallback to Application Default Credentials
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
        const serviceAccount = JSON.parse(serviceAccountKey);
        return initializeApp({
            credential: cert(serviceAccount),
            storageBucket,
        });
    }

    return initializeApp({
        projectId,
        storageBucket,
    });
}

interface MediaItem {
    id: string;
    baseUrl: string;
    filename: string;
    mimeType: string;
    mediaMetadata?: {
        width?: string;
        height?: string;
    };
}

/**
 * POST /api/admin/google-photos/sync
 * 
 * Syncs photos from a Google Photos album to Firebase Storage.
 * 
 * Body: { albumId: string, categoryId: string }
 * 
 * Flow:
 * 1. Fetch all media items from the specified Google Photos album
 * 2. Download each image via its temporary baseUrl
 * 3. Upload to Firebase Storage
 * 4. Save the permanent Firebase Storage URL to Firestore
 */
export async function POST(request: NextRequest) {
    try {
        const { albumId, categoryId } = await request.json();

        if (!albumId || !categoryId) {
            return NextResponse.json(
                { error: 'albumId and categoryId are required.' },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions) as any;
        const accessToken = session?.accessToken;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized. Please connect your Google account first.' },
                { status: 401 }
            );
        }

        // 1. Fetch media items from Google Photos album
        const allMediaItems: MediaItem[] = [];
        let nextPageToken: string | undefined;

        do {
            const body: Record<string, string | number> = {
                albumId,
                pageSize: 100,
            };
            if (nextPageToken) body.pageToken = nextPageToken;

            const searchRes = await fetch(
                'https://photoslibrary.googleapis.com/v1/mediaItems:search',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!searchRes.ok) {
                const errData = await searchRes.json().catch(() => ({}));
                console.error('Google Photos search error:', errData);
                return NextResponse.json(
                    { error: 'Failed to fetch media items.', details: errData },
                    { status: searchRes.status }
                );
            }

            const searchData = await searchRes.json();
            if (searchData.mediaItems) {
                allMediaItems.push(...searchData.mediaItems);
            }
            nextPageToken = searchData.nextPageToken;
        } while (nextPageToken);

        if (allMediaItems.length === 0) {
            return NextResponse.json({ synced: 0, message: 'No media items found in album.' });
        }

        // 2. Initialize Firebase Admin
        const app = getAdminApp();
        const bucket = getStorage(app).bucket();
        const adminDb = getFirestore(app);

        // 3. Get existing synced Google Photos IDs to avoid duplicates
        const existingSnap = await adminDb
            .collection('photos')
            .where('categoryId', '==', categoryId)
            .get();
        const existingGoogleIds = new Set(
            existingSnap.docs
                .map((doc) => doc.data().googlePhotosId)
                .filter(Boolean)
        );

        // 4. Filter out already-synced items
        const newItems = allMediaItems.filter(
            (item) => !existingGoogleIds.has(item.id)
        );

        if (newItems.length === 0) {
            return NextResponse.json({
                synced: 0,
                message: 'All photos are already synced.',
            });
        }

        // 5. Download and upload each photo
        let syncedCount = 0;
        const errors: string[] = [];
        const currentOrder = existingSnap.size;

        for (let i = 0; i < newItems.length; i++) {
            const item = newItems[i];

            try {
                // Google Photos baseUrl with max dimension parameter
                const downloadUrl = `${item.baseUrl}=d`;

                const imageRes = await fetch(downloadUrl);
                if (!imageRes.ok) {
                    errors.push(`Failed to download: ${item.filename}`);
                    continue;
                }

                const buffer = Buffer.from(await imageRes.arrayBuffer());
                const ext = item.mimeType?.split('/')[1] || 'jpg';
                const storagePath = `photos/${categoryId}/${item.id}.${ext}`;

                // Upload to Firebase Storage
                const file = bucket.file(storagePath);
                await file.save(buffer, {
                    metadata: {
                        contentType: item.mimeType || 'image/jpeg',
                        metadata: {
                            googlePhotosId: item.id,
                        },
                    },
                });

                // Make file publicly accessible
                await file.makePublic();

                const storageUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

                // 6. Save to Firestore
                await adminDb.collection('photos').add({
                    categoryId,
                    storageUrl,
                    thumbnailUrl: storageUrl,
                    googlePhotosId: item.id,
                    width: parseInt(item.mediaMetadata?.width || '0'),
                    height: parseInt(item.mediaMetadata?.height || '0'),
                    order: currentOrder + i,
                    createdAt: FieldValue.serverTimestamp(),
                });

                syncedCount++;
            } catch (itemError) {
                console.error(`Error syncing ${item.filename}:`, itemError);
                errors.push(`Error: ${item.filename}`);
            }
        }

        return NextResponse.json({
            synced: syncedCount,
            total: newItems.length,
            errors: errors.length > 0 ? errors : undefined,
            message: `Successfully synced ${syncedCount} of ${newItems.length} new photos.`,
        });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
