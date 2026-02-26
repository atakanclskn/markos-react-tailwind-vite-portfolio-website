import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, subject, email, phone, message } = body;

        // Validate required fields
        if (!name || !subject || !email || !message) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Write to Firestore using REST API
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;

        if (!projectId || !apiKey) {
            console.error('Missing Firebase env vars. PROJECT_ID:', !!projectId, 'API_KEY:', !!apiKey);
            return NextResponse.json(
                { success: false, message: 'Server configuration error. Please try again later.' },
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
