import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLegalContent } from '@/lib/firestore';

export const metadata = {
    title: 'Privacy Policy - Markos Studio',
    description: 'Privacy Policy for Markos Studio',
};

export default async function PrivacyPolicyPage() {
    const rawData = await getLegalContent();
    const content = rawData?.privacy || 'Welcome to Markos Studio. We respect your privacy and are committed to protecting your personal data...';

    return (
        <main className="min-h-screen bg-[var(--color-surface-dark)] text-[#f5f5f5] transition-colors duration-500 light:bg-[var(--color-surface-light)] light:text-[#0a0a0a]">
            {/* Header / Navbar spacing */}
            <div className="relative z-50">
                <Navbar visible />
            </div>

            <div className="mx-auto max-w-4xl px-6 py-32 md:px-12 md:py-40">
                <div className="mb-12 border-b border-white/10 pb-8 light:border-black/10">
                    <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-[var(--color-brand)]">Legal</p>
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Privacy Policy
                    </h1>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-white/70 light:prose-neutral light:text-black/70" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {content.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="min-h-[1.5rem] whitespace-pre-wrap">{paragraph}</p>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
