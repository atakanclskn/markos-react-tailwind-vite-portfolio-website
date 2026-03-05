import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Privacy Policy - Markos Studio',
    description: 'Privacy Policy for Markos Studio',
};

export default function PrivacyPolicyPage() {
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
                    <p className="lead text-xl font-light text-white/90 light:text-black/90">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">1. Introduction</h2>
                    <p>
                        Welcome to Markos Studio. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">2. The Data We Collect About You</h2>
                    <p>
                        Personal data, or personal information, means any information about an individual from which that person can be identified.
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                        <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                    </ul>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">3. How We Use Your Personal Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
                        used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data
                        to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at info@markosstudio.com.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
