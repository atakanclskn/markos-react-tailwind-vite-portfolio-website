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

        // First verify the token is valid and has correct scopes
        const tokenInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
        const tokenInfo = await tokenInfoRes.json();

        console.log('[albums] Token info:', JSON.stringify(tokenInfo));

        const hasPhotosScope = tokenInfo?.scope?.includes('photoslibrary');
        if (!hasPhotosScope) {
            return NextResponse.json(
                {
                    error: 'Token is missing Google Photos permission. Please disconnect and reconnect.',
                    tokenScope: tokenInfo?.scope
                },
                { status: 403 }
            );
        }

        const response = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=50', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const responseText = await response.text();
        console.log('[albums] Google Photos status:', response.status, 'body:', responseText.slice(0, 500));

        if (!response.ok) {
            let errorData = {};
            try { errorData = JSON.parse(responseText); } catch { }
            return NextResponse.json(
                { error: 'Failed to fetch albums from Google Photos.', details: errorData, tokenScope: tokenInfo?.scope },
                { status: response.status }
            );
        }

        const data = JSON.parse(responseText);

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
        return NextResponse.json({ error: 'Internal server error.', details: String(error) }, { status: 500 });
    }
}
