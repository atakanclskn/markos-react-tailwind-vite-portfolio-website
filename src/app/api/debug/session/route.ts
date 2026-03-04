import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    const session = await getServerSession(authOptions) as any;

    if (!session) {
        return NextResponse.json({ error: 'No session found', session: null });
    }

    // Decode the access token to see its scopes
    let tokenInfo = null;
    if (session.accessToken) {
        try {
            const res = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${session.accessToken}`);
            tokenInfo = await res.json();
        } catch (e) {
            tokenInfo = { error: 'Failed to decode token' };
        }
    }

    return NextResponse.json({
        hasSession: !!session,
        hasAccessToken: !!session.accessToken,
        sessionScope: session.scope || 'NOT SET',
        tokenInfo,
        userEmail: session.user?.email,
    });
}
