import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/google-drive/upload
 * 
 * 1. Downloads a file from Google Drive using the user's access token
 * 2. Uploads to ImgBB
 * 3. Returns the permanent ImgBB URLs (Firestore save is done client-side)
 * 
 * Body: { fileId, fileName, mimeType }
 * Header: Authorization: Bearer <google_access_token>
 */
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        const accessToken = authHeader?.replace('Bearer ', '');

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const { fileId, fileName, mimeType } = await request.json();

        if (!fileId) {
            return NextResponse.json({ error: 'fileId is required.' }, { status: 400 });
        }

        // 1. Download from Google Drive
        const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const driveRes = await fetch(downloadUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!driveRes.ok) {
            const errText = await driveRes.text().catch(() => '');
            console.error(`[drive/upload] Drive download failed for ${fileId}: ${driveRes.status}`, errText.slice(0, 200));
            return NextResponse.json(
                { error: `Failed to download from Google Drive (${driveRes.status}). Make sure you have Drive access.` },
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
            console.error('[drive/upload] ImgBB upload failed:', await imgbbRes.text().catch(() => ''));
            return NextResponse.json({ error: 'Failed to upload to ImgBB.' }, { status: 500 });
        }

        const imgbbData = await imgbbRes.json();
        if (!imgbbData.success) {
            return NextResponse.json({ error: `ImgBB error: ${imgbbData?.error?.message || 'Unknown'}` }, { status: 500 });
        }

        const storageUrl = imgbbData.data.url;
        const thumbnailUrl = imgbbData.data.thumb?.url || storageUrl;

        // Return URLs - client-side Firestore save is done in the frontend
        return NextResponse.json({
            success: true,
            storageUrl,
            thumbnailUrl,
            googleDriveId: fileId,
        });
    } catch (error) {
        console.error('[drive/upload] Error:', error);
        return NextResponse.json({ error: `Internal server error: ${String(error)}` }, { status: 500 });
    }
}
