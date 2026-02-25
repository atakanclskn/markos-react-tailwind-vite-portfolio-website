import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
        }

        const secretKey = process.env.TURNSTILE_SECRET_KEY;

        if (!secretKey) {
            console.error('Turnstile secret key is not configured');
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
        }

        const formData = new URLSearchParams();
        formData.append('secret', secretKey);
        formData.append('response', token);

        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const data = await verifyResponse.json();

        if (data.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, errors: data['error-codes'] }, { status: 400 });
        }
    } catch (error) {
        console.error('Error verifying captcha:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
