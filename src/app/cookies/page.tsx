import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
    title: 'Cookie Policy - Markos Studio',
    description: 'Cookie Policy for Markos Studio',
};

export default function CookiesPage() {
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
                    <p className="lead text-xl font-light text-white/90 light:text-black/90">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">1. What Are Cookies</h2>
                    <p>
                        As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer,
                        to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">2. How We Use Cookies</h2>
                    <p>
                        We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling
                        cookies without completely disabling the functionality and features they add to this site.
                    </p>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">3. The Cookies We Set</h2>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>
                            <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to
                            set your preferences for how this site runs when you use it (such as light or dark theme). In order to remember your preferences, we need to set cookies.
                        </li>
                        <li>
                            <strong>Authentication cookies:</strong> If you are an administrator logging into the backend dashboard, secure session cookies are utilized
                            to maintain your authenticated state.
                        </li>
                    </ul>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">4. Third Party Cookies</h2>
                    <p>
                        In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might
                        encounter through this site.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>
                            <strong>Analytics:</strong> This site uses analytics solutions to help us understand how you use the site and ways that we can improve your experience.
                            These cookies may track things such as how long you spend on the site and the pages that you visit.
                        </li>
                    </ul>

                    <h2 className="mt-12 mb-6 text-2xl font-bold text-white light:text-black">5. Disabling Cookies</h2>
                    <p>
                        You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this).
                        Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
