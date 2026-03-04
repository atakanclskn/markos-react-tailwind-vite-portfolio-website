import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * GET /api/admin/google-photos/albums
 * Fetch albums from Google Photos Library API using stored access token.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        const accessToken = session?.accessToken;

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
