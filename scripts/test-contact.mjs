// Quick test for /api/contact endpoint
async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                subject: 'General Inquiry',
                email: 'test@test.com',
                message: 'Hello, this is a test message.',
            }),
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
