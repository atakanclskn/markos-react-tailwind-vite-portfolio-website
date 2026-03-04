import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin (for Firestore only)
function getAdminApp() {
    if (getApps().length > 0) return getApps()[0];

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
        return initializeApp({ credential: cert(JSON.parse(serviceAccountKey)) });
    }
    return initializeApp({ projectId });
}

/**
 * POST /api/admin/google-drive/upload
 * 
 * Downloads a file from Google Drive using the user's access token,
 * uploads it to ImgBB, and saves the permanent URL to Firestore.
 * 
 * Body: { fileId, fileName, mimeType, categoryId }
 * Header: Authorization: Bearer <google_access_token>
 */
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        const accessToken = authHeader?.replace('Bearer ', '');

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const { fileId, fileName, mimeType, categoryId } = await request.json();

        if (!fileId || !categoryId) {
            return NextResponse.json({ error: 'fileId and categoryId are required.' }, { status: 400 });
        }

        // 1. Download the file from Google Drive
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const driveRes = await fetch(downloadUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!driveRes.ok) {
            const errText = await driveRes.text();
            console.error('Drive download error:', errText);
            return NextResponse.json(
                { error: `Failed to download from Google Drive: ${driveRes.status}` },
                { status: driveRes.status }
            );
        }

        const buffer = Buffer.from(await driveRes.arrayBuffer());

        // 2. Upload to ImgBB
        const base64Image = buffer.toString('base64');
        const formData = new FormData();
        const imgbbKey = process.env.IMGBB_API_KEY || '6902c7b41fa8673e8aa0d91855974b42';
        formData.append('key', imgbbKey);
        formData.append('image', base64Image);
        formData.append('name', fileName || fileId);

        const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
        });

        if (!imgbbRes.ok) {
            const imgbbErr = await imgbbRes.json().catch(() => ({}));
            console.error('ImgBB upload error:', imgbbErr);
            return NextResponse.json({ error: 'Failed to upload to ImgBB.' }, { status: 500 });
        }

        const imgbbData = await imgbbRes.json();
        if (!imgbbData.success) {
            return NextResponse.json({ error: 'ImgBB upload failed.' }, { status: 500 });
        }

        const storageUrl = imgbbData.data.url;
        const thumbnailUrl = imgbbData.data.thumb?.url || storageUrl;

        // 3. Save to Firestore
        const app = getAdminApp();
        const adminDb = getFirestore(app);

        // Check for duplicate
        const existing = await adminDb
            .collection('photos')
            .where('googleDriveId', '==', fileId)
            .where('categoryId', '==', categoryId)
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json({
                message: 'Photo already exists in this category.',
                storageUrl,
                skipped: true,
            });
        }

        const countSnap = await adminDb
            .collection('photos')
            .where('categoryId', '==', categoryId)
            .count()
            .get();
        const order = countSnap.data().count;

        await adminDb.collection('photos').add({
            categoryId,
            storageUrl,
            thumbnailUrl,
            googleDriveId: fileId,
            width: 0,
            height: 0,
            order,
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            success: true,
            storageUrl,
            thumbnailUrl,
            message: `${fileName} uploaded successfully.`,
        });
    } catch (error) {
        console.error('Drive upload error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
