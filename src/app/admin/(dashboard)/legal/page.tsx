'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { getLegalContent, updateLegalContent } from '@/lib/firestore';
import type { LegalContent } from '@/types';
import { TextAreaField, SaveButton } from '../sections/components';
import { Loader2, X } from 'lucide-react';
import AdminSplitView from '@/components/admin/AdminSplitView';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LegalSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [legalForm, setLegalForm] = useState<LegalContent>({
        privacy: '',
        terms: '',
        cookies: '',
    });

    // We'll use a local state to determine which preview to show.
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>('privacy');

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const data = await getLegalContent();
                if (data) {
                    setLegalForm(data);
                } else {
                    // Populate with some defaults if completely empty
                    setLegalForm({
                        privacy: 'Welcome to Markos Studio. We respect your privacy and are committed to protecting your personal data...',
                        terms: 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement...',
                        cookies: 'As is common practice with almost all professional websites, this site uses cookies...',
                    });
                }
            } catch (err) {
                console.error('Failed to fetch legal info:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateLegalContent(legalForm);
            showToast('Legal policies saved successfully.');
        } catch (err) {
            console.error('Failed to save legal info:', err);
            showToast('Error saving policies.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Topbar title="Legal Policies" />
                <div className="flex justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    // Helper to render the live preview mock page
    const renderPreview = () => {
        const titles = {
            privacy: 'Privacy Policy',
            terms: 'Terms & Conditions',
            cookies: 'Cookie Policy'
        };
        const content = legalForm[activeTab];

        return (
            <div className="w-full h-full relative isolate overflow-y-auto bg-[var(--color-surface-dark)] text-[#f5f5f5]">
                <div className="relative z-50 pointer-events-none">
                    <Navbar visible />
                </div>
                <div className="mx-auto max-w-4xl px-6 py-32 md:px-12 md:py-40">
                    <div className="mb-12 border-b border-white/10 pb-8">
                        <p className="mb-4 text-xs font-medium tracking-[0.3em] uppercase text-[var(--color-brand)]">Legal</p>
                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-outfit)' }}>
                            {titles[activeTab]}
                        </h1>
                    </div>
                    {/* Render newlines as distinct paragraphs for rough markdown-like preview */}
                    <div className="prose prose-invert prose-lg max-w-none text-white/70" style={{ fontFamily: 'var(--font-outfit)' }}>
                        {content.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="min-h-[1.5rem] whitespace-pre-wrap">{paragraph}</p>
                        ))}
                    </div>
                </div>
                <div className="pointer-events-none">
                    <Footer />
                </div>
            </div>
        );
    };

    return (
        <AdminSplitView
            title="Legal Policies Editor"
            preview={renderPreview()}
        >
            <div className="p-6 lg:p-8 space-y-6">
                {toast && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-sm">
                        <span>{toast}</span>
                        <button onClick={() => setToast(null)} className="ml-auto"><X className="h-3.5 w-3.5" /></button>
                    </div>
                )}

                {/* Custom Tabs */}
                <div className="flex space-x-2 border-b border-white/[0.06] mb-6">
                    {(['privacy', 'terms', 'cookies'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${activeTab === tab
                                ? 'border-[#c8a96e] text-[#c8a96e]'
                                : 'border-transparent text-[#666] hover:text-[#a0a0a0] hover:border-white/10'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Editor Content */}
                <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6 space-y-4">
                    <div className="mb-4">
                        <p className="text-sm text-[#a0a0a0]">
                            Edit the body of your <span className="text-[#f5f5f5] font-semibold">{activeTab}</span> policy.
                            Line breaks will be converted into paragraphs automatically on the live site.
                        </p>
                    </div>

                    <TextAreaField
                        label="Policy Text"
                        value={legalForm[activeTab]}
                        onChange={(v) => setLegalForm({ ...legalForm, [activeTab]: v })}
                        rows={20}
                        placeholder={`Enter your ${activeTab} details here...`}
                    />

                    <SaveButton onClick={handleSave} loading={saving} />
                </div>
            </div>
        </AdminSplitView>
    );
}
