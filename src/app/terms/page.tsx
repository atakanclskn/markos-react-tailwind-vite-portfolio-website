import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Terms & Conditions - Markos Studio',
    description: 'Terms and Conditions for Markos Studio',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[var(--color-surface-dark)] text-[#f5f5f5] transition-colors duration-500 light:bg-[var(--color-surface-light)] light:text-[#0a0a0a]">
            {/* Header / Navbar spacing */}
            <div className="relative z-50">
                <Navbar />
            </div>

            <div className="mx-auto max-w-4xl px-6 py-32 md:px-12 md:py-40">
                <div className="mb-12 border-b border-white/10 pb-8 light:border-black/10">
                    <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-[var(--color-brand)]">Legal</p>
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)' }}>
                        Terms & Conditions
                    </h1>
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-white/70 light:prose-neutral light:text-black/70" style={{ fontFamily: 'var(--font-outfit)' }}>
                    <p className="lead text-xl font-light text-white/90 light:text-black/90">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
                        In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">2. Intellectual Property</h2>
                    <p>
                        The Site and its original content, features, and functionality are owned by Markos Studio and are protected by international
                        copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                        All photography and imagery are strictly copywritten and may not be reproduced without explicit written consent.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">3. Licensing and Usage</h2>
                    <p>
                        Any images or media provided to clients as part of a service agreement are subject to specific licensing terms outlined in our
                        independent contracts. General visitors to the website do not hold any rights to save, alter, reproduce, or distribute our portfolio works.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">4. Disclaimer of Warranties</h2>
                    <p>
                        Our website and its contents are provided "as is" and "as available" without any warranty or representations of any kind, whether express or implied.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">5. Changes to This Agreement</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms and Conditions by posting the updated terms on the Site.
                        Your continued use of the Site after any such changes constitutes your acceptance of the new Terms and Conditions.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
