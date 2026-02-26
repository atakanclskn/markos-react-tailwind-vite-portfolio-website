import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, subject, email, phone, message, captchaToken } = body;

        // Validate required fields
        if (!name || !subject || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify captcha
        const secretKey = process.env.TURNSTILE_SECRET_KEY;
        if (secretKey && captchaToken) {
            const verifyResponse = await fetch(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        secret: secretKey,
                        response: captchaToken,
                    }),
                }
            );
            const verifyData = await verifyResponse.json();
            if (!verifyData.success) {
                console.error('Turnstile verification failed:', verifyData['error-codes']);
                return NextResponse.json(
                    { success: false, message: 'Captcha verification failed' },
                    { status: 400 }
                );
            }
        }

        // Write to Firestore using REST API (bypasses client SDK hanging issue)
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

        if (!projectId || !apiKey) {
            return NextResponse.json(
                { success: false, message: 'Firebase not configured' },
                { status: 500 }
            );
        }

        const now = new Date().toISOString();

        const firestoreDoc = {
            fields: {
                name: { stringValue: name },
                subject: { stringValue: subject },
                email: { stringValue: email },
                phone: { stringValue: phone || '' },
                message: { stringValue: message },
                read: { booleanValue: false },
                starred: { booleanValue: false },
                archived: { booleanValue: false },
                createdAt: { timestampValue: now },
            },
        };

        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/messages?key=${apiKey}`;

        const firestoreResponse = await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firestoreDoc),
        });

        if (!firestoreResponse.ok) {
            const errorData = await firestoreResponse.json();
            console.error('Firestore write error:', errorData);
            return NextResponse.json(
                { success: false, message: 'Failed to save message' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
