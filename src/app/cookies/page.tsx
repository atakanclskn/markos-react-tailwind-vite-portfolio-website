import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLegalContent } from '@/lib/firestore';

export const metadata = {
    title: 'Cookie Policy - Markos Studio',
    description: 'Cookie Policy for Markos Studio',
};

export default async function CookiesPage() {
    const rawData = await getLegalContent();
    const content = rawData?.cookies || 'As is common practice with almost all professional websites, this site uses cookies...';

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
                        Cookie Policy
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
