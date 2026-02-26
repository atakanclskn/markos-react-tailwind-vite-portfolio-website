import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
        }

        const secretKey = process.env.TURNSTILE_SECRET_KEY;

        if (!secretKey) {
            // Captcha not configured — allow submission to pass through
            console.warn('TURNSTILE_SECRET_KEY is not configured, skipping captcha verification');
            return NextResponse.json({ success: true, skipCaptcha: true });
        }

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: secretKey,
                response: token,
            }),
        });

        const data = await verifyResponse.json();

        if (data.success) {
            return NextResponse.json({ success: true });
        } else {
            console.error('Turnstile verification failed:', data['error-codes']);
            return NextResponse.json({
                success: false,
                message: 'Verification failed: ' + (data['error-codes']?.join(', ') || 'Unknown error')
            }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Error verifying captcha:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
