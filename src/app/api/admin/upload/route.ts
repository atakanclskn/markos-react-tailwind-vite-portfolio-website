import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/upload
 * 
 * Accepts an image file (multipart/form-data) from the client,
 * uploads it to ImgBB, and returns the permanent URL.
 * 
 * Form fields: file (Blob), fileName (string)
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as Blob | null;
        const fileName = formData.get('fileName') as string || 'photo';

        if (!file) {
            return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
        }

        // Convert file to base64
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString('base64');

        // Upload to ImgBB
        const imgbbKey = process.env.IMGBB_API_KEY;
        if (!imgbbKey) {
            return NextResponse.json({ error: 'IMGBB_API_KEY is not configured.' }, { status: 500 });
        }
        const uploadForm = new FormData();
        uploadForm.append('key', imgbbKey);
        uploadForm.append('image', base64Image);
        uploadForm.append('name', fileName.replace(/\.[^.]+$/, '')); // strip extension

        const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: uploadForm,
        });

        if (!imgbbRes.ok) {
            console.error('[upload] ImgBB response not ok:', imgbbRes.status);
            return NextResponse.json({ error: 'ImgBB upload failed.' }, { status: 500 });
        }

        const imgbbData = await imgbbRes.json();
        if (!imgbbData.success) {
            return NextResponse.json({ error: `ImgBB error: ${imgbbData?.error?.message || 'Unknown'}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            storageUrl: imgbbData.data.url,
            thumbnailUrl: imgbbData.data.thumb?.url || imgbbData.data.url,
        });
    } catch (error) {
        console.error('[upload] Error:', error);
        return NextResponse.json({ error: `Internal error: ${String(error)}` }, { status: 500 });
    }
}
