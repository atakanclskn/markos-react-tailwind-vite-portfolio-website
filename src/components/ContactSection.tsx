'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getContactInfo, submitContactMessage } from '@/lib/firestore';
import type { ContactInfo } from '@/types';

const SUBJECT_OPTIONS = [
    'General Inquiry',
    'Landscape Photography',
    'Portrait Photography',
    'Fashion Photography',
    'Product Photography',
    'Wedding & Events',
    'Other',
];

export default function ContactSection({ previewData }: { previewData?: ContactInfo }) {
    const { theme } = useTheme();
    const [contactInfo, setContactInfoState] = useState<ContactInfo | null>(null);
    const [isLoading, setIsLoading] = useState(!previewData);

    useEffect(() => {
        if (previewData) {
            setIsLoading(false);
            return;
        }

        let mounted = true;
        getContactInfo()
            .then((data) => {
                if (mounted && data) setContactInfoState(data);
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [previewData]);

    const activeData = previewData || contactInfo;

    if (!previewData && isLoading) {
        return (
            <section id="contact" className="px-6 py-24 md:px-12 lg:px-20">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="mb-16 text-center">
                        <div className="mx-auto mb-4 h-3 w-24 rounded bg-white/10" />
                        <div className="mx-auto h-10 w-72 rounded bg-white/10" />
                    </div>
                    <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
                        <div className="space-y-4">
                            <div className="h-8 w-52 rounded bg-white/10" />
                            <div className="h-4 w-full rounded bg-white/10" />
                            <div className="h-4 w-5/6 rounded bg-white/10" />
                            <div className="mt-8 space-y-4">
                                <div className="h-14 w-full rounded-lg bg-white/10" />
                                <div className="h-14 w-full rounded-lg bg-white/10" />
                                <div className="h-14 w-full rounded-lg bg-white/10" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="h-12 w-full rounded-lg bg-white/10" />
                            <div className="h-12 w-full rounded-lg bg-white/10" />
                            <div className="h-12 w-full rounded-lg bg-white/10" />
                            <div className="h-32 w-full rounded-lg bg-white/10" />
                            <div className="h-12 w-full rounded-lg bg-white/10" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!activeData) return null;

    const email = activeData.email;
    const phone = activeData.phone;
    const address = activeData.address;
    const statusActive = activeData.statusActive ?? true;
    const statusText = statusActive
        ? 'Currently available for new projects'
        : 'Currently not available for new projects';

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        email: '',
        phone: '',
        message: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
        if (!formData.subject) newErrors.subject = 'Please select a subject.';
        if (!formData.email.trim()) {
            newErrors.email = 'Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.message.trim()) newErrors.message = 'Please enter your message.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            await submitContactMessage(formData);

            setSubmitted(true);
            setFormData({ name: '', subject: '', email: '', phone: '', message: '' });

            setTimeout(() => {
                setSubmitted(false);
            }, 4000);
        } catch (error: unknown) {
            console.error('Error submitting form:', error);
            setSubmitError('An error occurred. Please try again.');
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
        <section id="contact" className="px-6 py-24 md:px-12 lg:px-20" >
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
                        Contact
                    </p>
                    <h2
                        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                        style={{
                            fontFamily: 'var(--font-outfit)',
                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                        }}
                    >
                        Let&apos;s Work Together
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
                            Start Your Project
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
                            Get in touch to bring your project to life.
                            We&apos;ll get back to you as soon as possible.
                        </p>

                        {/* Contact details */}
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <a
                                    href={`mailto:${email}`}
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300 hover:bg-[rgba(200,169,110,0.2)]"
                                    style={{
                                        backgroundColor: theme === 'dark' ? 'rgba(200,169,110,0.1)' : 'rgba(200,169,110,0.1)',
                                    }}
                                >
                                    <svg className="h-5 w-5" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </a>
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
                                    <a
                                        href={`mailto:${email}`}
                                        className="text-sm transition-colors duration-300 hover:text-[var(--color-brand)]"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        {email}
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <a
                                    href={`tel:${phone.replace(/\s/g, '')}`}
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300 hover:bg-[rgba(200,169,110,0.2)]"
                                    style={{
                                        backgroundColor: 'rgba(200,169,110,0.1)',
                                    }}
                                >
                                    <svg className="h-5 w-5" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </a>
                                <div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                        }}
                                    >
                                        Phone
                                    </p>
                                    <a
                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                        className="text-sm transition-colors duration-300 hover:text-[var(--color-brand)]"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300 hover:bg-[rgba(200,169,110,0.2)]"
                                    style={{
                                        backgroundColor: 'rgba(200,169,110,0.1)',
                                    }}
                                >
                                    <svg className="h-5 w-5" style={{ color: 'var(--color-brand)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </a>
                                <div>
                                    <p
                                        className="text-sm font-medium"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a',
                                        }}
                                    >
                                        Location
                                    </p>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm transition-colors duration-300 hover:text-[var(--color-brand)]"
                                        style={{
                                            fontFamily: 'var(--font-outfit)',
                                            color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        {address}
                                    </a>
                                </div>
                            </div>

                        </div>

                        {/* Availability status */}
                        <div
                            className="mt-10 inline-flex items-center gap-3 rounded-full px-5 py-3"
                            style={{
                                backgroundColor: statusActive
                                    ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.08)')
                                    : (theme === 'dark' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.08)'),
                                border: `1px solid ${statusActive
                                    ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.2)')
                                    : (theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.2)')
                                    }`,
                            }}
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusActive ? 'bg-green-400' : 'bg-red-400'} opacity-75`} />
                                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${statusActive ? 'bg-green-500' : 'bg-red-500'}`} />
                            </span>
                            <span
                                className="text-sm font-medium"
                                style={{
                                    fontFamily: 'var(--font-outfit)',
                                    color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                                }}
                            >
                                {statusText}
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
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div
                                    key="success-message"
                                    className="flex h-full flex-col items-center justify-center rounded-2xl p-12 text-center"
                                    style={{
                                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                                        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                                    }}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                >
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
                                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                                        style={{ backgroundColor: 'rgba(200,169,110,0.1)' }}
                                    >
                                        <svg
                                            className="h-10 w-10"
                                            style={{ color: 'var(--color-brand)' }}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <motion.h4
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.4 }}
                                        className="mb-3 text-2xl font-bold tracking-tight md:text-3xl"
                                        style={{ fontFamily: 'var(--font-outfit)', color: theme === 'dark' ? '#f5f5f5' : '#0a0a0a' }}
                                    >
                                        Message Sent
                                    </motion.h4>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.5 }}
                                        className="text-base font-light leading-relaxed"
                                        style={{ fontFamily: 'var(--font-outfit)', color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
                                    >
                                        Thank you for reaching out. <br className="hidden sm:block" />
                                        We will get back to you shortly.
                                    </motion.p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="contact-form"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                    noValidate
                                >
                                    {/* Name */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                                            }}
                                            className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                            style={{ ...inputBaseStyle, borderColor: errors.name ? '#ef4444' : inputBaseStyle.borderColor }}
                                        />
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="mt-1 text-xs text-red-500"
                                                >
                                                    {errors.name}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Subject */}
                                    <div className="relative">
                                        <div
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300"
                                            style={{
                                                ...inputBaseStyle,
                                                borderColor: errors.subject ? '#ef4444' : (isDropdownOpen ? 'var(--color-brand)' : inputBaseStyle.borderColor),
                                                color: formData.subject ? (theme === 'dark' ? '#f5f5f5' : '#0a0a0a') : 'rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            <span style={{
                                                color: formData.subject
                                                    ? (theme === 'dark' ? '#f5f5f5' : '#0a0a0a')
                                                    : (theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)')
                                            }}>
                                                {formData.subject || 'Select Subject'}
                                            </span>
                                            <svg
                                                className={`h-5 w-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                                style={{ color: 'var(--color-brand)' }}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, scaleY: 0.9, y: 5 }}
                                                    animate={{ opacity: 1, scaleY: 1, y: 0 }}
                                                    exit={{ opacity: 0, scaleY: 0.9, y: 5 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute z-20 mt-2 w-full origin-top cursor-pointer overflow-hidden rounded-lg border shadow-lg"
                                                    style={{
                                                        backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
                                                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)',
                                                    }}
                                                >
                                                    {SUBJECT_OPTIONS.map((opt) => (
                                                        <div
                                                            key={opt}
                                                            onClick={() => {
                                                                setFormData({ ...formData, subject: opt });
                                                                if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="px-4 py-3 text-sm transition-colors duration-200"
                                                            style={{
                                                                fontFamily: 'var(--font-outfit)',
                                                                color: formData.subject === opt
                                                                    ? 'var(--color-brand)'
                                                                    : (theme === 'dark' ? '#f5f5f5' : '#0a0a0a'),
                                                                backgroundColor: formData.subject === opt
                                                                    ? (theme === 'dark' ? 'rgba(200,169,110,0.1)' : 'rgba(200,169,110,0.1)')
                                                                    : 'transparent',
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (formData.subject !== opt) {
                                                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (formData.subject !== opt) {
                                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                                }
                                                            }}
                                                        >
                                                            {opt}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {errors.subject && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="mt-1 text-xs text-red-500"
                                                >
                                                    {errors.subject}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                                            }}
                                            className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                            style={{ ...inputBaseStyle, borderColor: errors.email ? '#ef4444' : inputBaseStyle.borderColor }}
                                        />
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="mt-1 text-xs text-red-500"
                                                >
                                                    {errors.email}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Your Phone Number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                            style={inputBaseStyle}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <textarea
                                            placeholder="Your Message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => {
                                                setFormData({ ...formData, message: e.target.value });
                                                if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                                            }}
                                            className="w-full resize-none rounded-lg border px-4 py-3.5 text-sm outline-none transition-colors duration-300 focus:border-[var(--color-brand)]"
                                            style={{
                                                ...inputBaseStyle,
                                                borderColor: errors.message ? '#ef4444' : inputBaseStyle.borderColor,
                                                backgroundColor: inputBaseStyle.backgroundColor
                                            }}
                                        />
                                        <AnimatePresence>
                                            {errors.message && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="mt-1 text-xs text-red-500"
                                                >
                                                    {errors.message}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Submit Area */}
                                    <div className="flex w-full flex-col gap-4">
                                        {isSubmitting ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex w-full items-center justify-center py-4"
                                            >
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-brand)] border-t-transparent" />
                                                <span
                                                    className="ml-3 text-sm"
                                                    style={{
                                                        fontFamily: 'var(--font-outfit)',
                                                        color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                                                    }}
                                                >
                                                    Sending...
                                                </span>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                type="submit"
                                                className="w-full rounded-lg px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-all duration-300"
                                                style={{
                                                    fontFamily: 'var(--font-outfit)',
                                                    backgroundColor: 'var(--color-brand)',
                                                    color: '#000',
                                                }}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                Send Message
                                            </motion.button>
                                        )}

                                        <AnimatePresence>
                                            {submitError && (
                                                <motion.p
                                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                                    className="text-center text-xs text-red-500 sm:text-left"
                                                >
                                                    {submitError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
