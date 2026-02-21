'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const SUBJECT_OPTIONS = [
    'Genel Bilgi',
    'Landscape Fotograf',
    'Portre Fotograf',
    'Fashion Fotograf',
    'Urun Fotograf',
    'Dugun & Organizasyon',
    'Diger',
];

export default function ContactSection() {
    const { theme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Dynamic import to avoid loading firebase on initial page load
            const { submitContactMessage } = await import('@/lib/firestore');
            await submitContactMessage(formData);
            setSubmitted(true);
            setFormData({ name: '', subject: '', email: '', phone: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseStyle = {
        fontFamily: 'var(--font-outfit)',
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
    };

    return (
        <section id="contact" className="px-6 py-24 md:px-12 lg:px-20">
            <div className="mx-auto max-w-6xl">
                {/* Section header */}
                <motion.div
                    className="mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p
                        className="mb-4 text-xs font-medium tracking-[0.4em] uppercase"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            color: 'var(--color-brand)',
                        }}
                    >
                        Iletisim
                    </p>
                    <h2
                        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                        }}
                    >
                        Birlikte Calisalim
                    </h2>
                </motion.div>

                {/* Two column layout */}
                <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
                    {/* Left: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3
                            className="mb-4 text-2xl font-bold sm:text-3xl"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                            }}
                        >
                            Projenize Baslayalim
                        </h3>
                        <p
                            className="mb-10 text-base leading-relaxed"
                            style={{
                                fontFamily: 'var(--font-outfit)',
                                color:
                                    theme === 'dark'
                                        ? 'rgba(255,255,255,0.5)'
                                        : 'rgba(0,0,0,0.5)',
                            }}
                        >
                            Projenizi hayata gecirmek icin bizimle iletisime gecin.
                            Size en kisa surede donecegiz.
                        </p>

                        {/* Contact details */}
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                                    style={{
                                        backgroundColor: theme === 'dark' ? 'rgba(200,169,110,0.1)' : 'rgba(200,169,110,0.1)',
                                    }}
                                >
                                    <svg className="h-5 w-5" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                        }}
                                    >
                                        Email
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        info@markosstudio.com
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                                    style={{
                                        backgroundColor: 'rgba(200,169,110,0.1)',
                                    }}
                                >
                                    <svg className="h-5 w-5" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </div>
                                <div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                        }}
                                    >
                                        Telefon
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        +90 (555) 123 4567
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
                                    style={{
                                        backgroundColor: 'rgba(200,169,110,0.1)',
                                    }}
                                >
                                    <svg className="h-5 w-5" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                        }}
                                    >
                                        Lokasyon
                                    </p>
                                    <p
                                        className="text-sm"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        Istanbul, Turkiye
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Availability status */}
                        <div
                            className="mt-10 inline-flex items-center gap-3 rounded-full px-5 py-3"
                            style={{
                                backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                                border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.2)'}`,
                            }}
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                            </span>
                            <span
                                className="text-sm font-medium"
                                style={{
                                    fontFamily: 'var(--font-outfit)',
                                    color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                }}
                            >
                                Su an yeni projeler icin musaitiz
                            </span>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {submitted ? (
                            <motion.div
                                className="flex h-full flex-col items-center justify-center rounded-2xl p-12 text-center"
                                style={{
                                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                    border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div
                                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                                >
                                    <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h4
                                    className="mb-2 text-xl font-bold"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                    }}
                                >
                                    Mesajiniz Iletildi
                                </h4>
                                <p
                                    className="text-sm"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                    }}
                                >
                                    En kisa surede size donecegiz.
                                </p>
                                <button
                                    className="mt-6 text-sm font-medium underline transition-colors duration-300"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        color: 'var(--color-brand)',
                                    }}
                                    onClick={() => setSubmitted(false)}
                                >
                                    Yeni mesaj gonder
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Adiniz"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                        style={inputBaseStyle}
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <select
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full cursor-pointer appearance-none rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                        style={inputBaseStyle}
                                    >
                                        <option value="" disabled>
                                            Konu Secin
                                        </option>
                                        {SUBJECT_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Email */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="E-posta Adresiniz"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                        style={inputBaseStyle}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <input
                                        type="tel"
                                        placeholder="Telefon Numaraniz"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                        style={inputBaseStyle}
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <textarea
                                        placeholder="Mesajiniz"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full resize-none rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                        style={inputBaseStyle}
                                    />
                                </div>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-lg px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-300"
                                    style={{
                                        fontFamily: 'var(--font-outfit)',
                                        backgroundColor: 'var(--color-brand)',
                                        color: '#000',
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    {isSubmitting ? 'Gonderiliyor...' : 'Mesaj Gonder'}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
