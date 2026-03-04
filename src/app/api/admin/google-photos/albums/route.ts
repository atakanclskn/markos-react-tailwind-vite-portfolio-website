import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/google-photos/albums
 * Reads the access token from the Authorization header (sent by frontend).
 */
export async function GET(request: NextRequest) {
    try {
        // Read access token from Authorization header
        const authHeader = request.headers.get('Authorization');
        const accessToken = authHeader?.replace('Bearer ', '');

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Unauthorized. Please connect your Google Photos account first.' },
                { status: 401 }
            );
        }

        const response = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=50', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Google Photos API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to fetch albums from Google Photos.', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            albums: (data.albums || []).map((album: Record<string, string>) => ({
                id: album.id,
                title: album.title,
                mediaItemsCount: album.mediaItemsCount || '0',
                coverPhotoBaseUrl: album.coverPhotoBaseUrl || '',
            })),
        });
    } catch (error) {
        console.error('Albums fetch error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
