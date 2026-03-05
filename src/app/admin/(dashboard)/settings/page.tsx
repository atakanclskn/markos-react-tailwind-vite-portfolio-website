'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import {
    Save,
    Loader2,
    Plus,
    Trash2,
    X,
    Globe,
    Link as LinkIcon,
    Palette,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import {
    getSEOSettings,
    updateSEOSettings,
    getFooterContent,
    updateFooterContent,
    getAppearanceSettings,
    updateAppearanceSettings,
} from '@/lib/firestore';
import type { SEOSettings, FooterContent, SocialLink, AppearanceSettings } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { InputField, ConfirmModal } from '../sections/components';

const PREMIUM_COLORS = [
    { name: 'Pure White (Default)', hex: '#ffffff' },
    { name: 'Signature Gold', hex: '#c8a96e' },
    { name: 'Rose Gold', hex: '#b76e79' },
    { name: 'Platinum', hex: '#e5e4e2' },
    { name: 'Emerald', hex: '#50c878' },
    { name: 'Midnight Blue', hex: '#191970' },
];

export default function SettingsPage() {
    const { seoSettings, setSEOSettings, footerContent, setFooterContent } = useAdminStore();

    const [loading, setLoading] = useState(true);
    const [savingSEO, setSavingSEO] = useState(false);
    const [savingFooter, setSavingFooter] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [deleteLinkIndex, setDeleteLinkIndex] = useState<number | null>(null);

    // Local form states
    const [seoForm, setSeoForm] = useState<SEOSettings>({
        siteName: '',
        metaTitle: '',
        metaDescription: '',
        keywords: '',
    });
    const [footerForm, setFooterForm] = useState<FooterContent>({
        copyright: '',
        socialLinks: [],
    });

    const { brandColor, setBrandColor } = useTheme();
    const [appearanceForm, setAppearanceForm] = useState<AppearanceSettings>({
        brandColor: brandColor || '#ffffff',
    });
    const [savingAppearance, setSavingAppearance] = useState(false);

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [seo, footer, appearance] = await Promise.all([
                    getSEOSettings(),
                    getFooterContent(),
                    getAppearanceSettings()
                ]);
                if (seo) {
                    setSEOSettings(seo);
                    setSeoForm(seo);
                }
                if (footer) {
                    setFooterContent(footer);
                    setFooterForm(footer);
                }
                if (appearance) {
                    setAppearanceForm(appearance);
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- SEO ---
    const handleSaveSEO = async () => {
        setSavingSEO(true);
        try {
            await updateSEOSettings(seoForm);
            setSEOSettings(seoForm);
            showToast('SEO settings saved.');
        } catch (err) {
            console.error('Failed to save SEO:', err);
        } finally {
            setSavingSEO(false);
        }
    };

    // --- Footer ---
    const handleSaveFooter = async () => {
        setSavingFooter(true);
        try {
            await updateFooterContent(footerForm);
            setFooterContent(footerForm);
            showToast('Footer settings saved.');
        } catch (err) {
            console.error('Failed to save footer:', err);
        } finally {
            setSavingFooter(false);
        }
    };

    // --- Appearance ---
    const handleSaveAppearance = async () => {
        setSavingAppearance(true);
        try {
            await updateAppearanceSettings(appearanceForm);
            // Instantly apply globally to the page via Context without reload
            setBrandColor(appearanceForm.brandColor);
            showToast('Appearance settings saved. Brand color updated.');
        } catch (err) {
            console.error('Failed to save appearance:', err);
        } finally {
            setSavingAppearance(false);
        }
    };

    const addSocialLink = () => {
        setFooterForm({
            ...footerForm,
            socialLinks: [...footerForm.socialLinks, { iconName: '', url: '' }],
        });
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
        const updated = [...footerForm.socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setFooterForm({ ...footerForm, socialLinks: updated });
    };

    const removeSocialLink = (index: number) => {
        setDeleteLinkIndex(index);
    };

    const confirmDeleteSocialLink = () => {
        if (deleteLinkIndex === null) return;
        setFooterForm({
            ...footerForm,
            socialLinks: footerForm.socialLinks.filter((_, i) => i !== deleteLinkIndex),
        });
        setDeleteLinkIndex(null);
    };

    if (loading) {
        return (
            <>
                <Topbar title="Settings" />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar title="Settings" />

            {/* Toast */}
            {toast && (
                <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
                    <span>{toast}</span>
                    <button onClick={() => setToast(null)}>
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="mx-auto max-w-3xl p-6 lg:p-8 space-y-8">
                {/* Appearance Settings */}
                <section className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
                        <Palette className="h-4 w-4" style={{ color: 'var(--color-brand)' }} />
                        <h3 className="text-sm font-semibold text-[#f5f5f5]">Appearance & Theming</h3>
                    </div>
                    <div className="space-y-6 p-5">
                        {/* Live Color Preview and Picker */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <label className="block text-sm text-[#a0a0a0]">Brand Accent Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {PREMIUM_COLORS.map((preset) => (
                                        <button
                                            key={preset.hex}
                                            type="button"
                                            onClick={() => setAppearanceForm({ ...appearanceForm, brandColor: preset.hex })}
                                            className={`h-10 w-10 rounded-full border-2 transition-transform ${appearanceForm.brandColor.toLowerCase() === preset.hex.toLowerCase()
                                                ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                                : 'border-transparent hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: preset.hex }}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>
                                <div className="pt-2 flex items-center gap-4">
                                    <span className="text-xs text-[#666]">Or enter custom Hex:</span>
                                    <div className="relative w-32">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]">#</div>
                                        <input
                                            type="text"
                                            value={appearanceForm.brandColor.replace('#', '')}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                                                setAppearanceForm({ ...appearanceForm, brandColor: `#${val}` });
                                            }}
                                            placeholder="ffffff"
                                            className="w-full rounded-lg border border-white/[0.06] bg-[#141414] pl-7 pr-3 py-2 text-sm text-[#f5f5f5] outline-none focus:border-[#c8a96e]/40 uppercase tracking-widest"
                                        />
                                        <input
                                            type="color"
                                            value={appearanceForm.brandColor}
                                            onChange={(e) => setAppearanceForm({ ...appearanceForm, brandColor: e.target.value })}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Live Demo Mini-card */}
                            <div className="sm:w-64 rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-5 flex flex-col justify-center items-center text-center">
                                <span className="text-xs text-[#666] mb-4 uppercase tracking-widest">Live Preview</span>
                                <div
                                    className="h-12 w-12 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    style={{ backgroundColor: `color-mix(in srgb, ${appearanceForm.brandColor} 15%, transparent)` }}
                                >
                                    <span className="text-2xl" style={{ fontFamily: 'var(--font-monoton)', color: appearanceForm.brandColor }}>M</span>
                                </div>
                                <div
                                    className="px-4 py-1.5 rounded-full text-xs font-medium"
                                    style={{ backgroundColor: appearanceForm.brandColor, color: '#0a0a0a' }}
                                >
                                    Primary Button
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-white/[0.06]">
                            <button
                                onClick={handleSaveAppearance}
                                disabled={savingAppearance}
                                className="flex items-center gap-2 rounded-lg px-4 py-2 mt-4 text-sm font-medium text-[#0a0a0a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--color-brand)' }}
                            >
                                {savingAppearance ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-[#0a0a0a]" />
                                ) : (
                                    <Save className="h-4 w-4 text-[#0a0a0a]" />
                                )}
                                <span>Apply Brand Color</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* SEO Settings */}
                <section className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
                        <Globe className="h-4 w-4 text-[#c8a96e]" />
                        <h3 className="text-sm font-semibold text-[#f5f5f5]">SEO Settings</h3>
                    </div>
                    <div className="space-y-4 p-5">
                        <div>
                            <label className="mb-1.5 block text-sm text-[#a0a0a0]">Meta Title</label>
                            <InputField
                                label="Site Name (Base Title)"
                                value={seoForm.siteName}
                                onChange={(val: string) => setSeoForm({ ...seoForm, siteName: val })}
                                placeholder="e.g. Markos Studio"
                            />
                            <p className="mt-1 text-xs text-[#666] -translate-y-2">Used as the base suffix for page titles in the browser tab.</p>

                            <InputField
                                label="Meta Title"
                                value={seoForm.metaTitle}
                                onChange={(val: string) => setSeoForm({ ...seoForm, metaTitle: val })}
                                placeholder="Brand Name | Tagline"
                            />
                            <p className="mt-1 text-xs text-[#555]">
                                {seoForm.metaTitle.length}/60 characters recommended
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                Meta Description
                            </label>
                            <textarea
                                value={seoForm.metaDescription}
                                onChange={(e) =>
                                    setSeoForm({ ...seoForm, metaDescription: e.target.value })
                                }
                                rows={3}
                                placeholder="Professional photography services..."
                                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                    text-sm text-[#f5f5f5] placeholder-[#444] outline-none resize-none
                                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                            />
                            <p className="mt-1 text-xs text-[#555]">
                                {seoForm.metaDescription.length}/160 characters recommended
                            </p>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                Keywords
                            </label>
                            <input
                                type="text"
                                value={seoForm.keywords}
                                onChange={(e) =>
                                    setSeoForm({ ...seoForm, keywords: e.target.value })
                                }
                                placeholder="photography, studio, portrait, landscape"
                                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                    text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                            />
                            <p className="mt-1 text-xs text-[#555]">Comma-separated values</p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSaveSEO}
                                disabled={savingSEO}
                                className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-4 py-2
                                    text-sm font-medium text-[#0a0a0a] transition-all duration-200
                                    hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {savingSEO ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>Save SEO</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Footer Settings */}
                <section className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
                        <LinkIcon className="h-4 w-4 text-[#c8a96e]" />
                        <h3 className="text-sm font-semibold text-[#f5f5f5]">Footer Settings</h3>
                    </div>
                    <div className="space-y-4 p-5">
                        <div>
                            <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                Copyright Text
                            </label>
                            <input
                                type="text"
                                value={footerForm.copyright}
                                onChange={(e) =>
                                    setFooterForm({ ...footerForm, copyright: e.target.value })
                                }
                                placeholder="2025 Markos Studio. All rights reserved."
                                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                    text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                            />
                        </div>

                        {/* Social Media Links */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm text-[#a0a0a0]">Social Media Links</label>
                                <button
                                    onClick={addSocialLink}
                                    className="flex items-center gap-1.5 rounded-lg border border-dashed border-white/[0.1] px-3 py-1.5
                                        text-xs text-[#666] transition-colors hover:border-[#c8a96e]/30 hover:text-[#a0a0a0]"
                                >
                                    <Plus className="h-3 w-3" />
                                    <span>Add Link</span>
                                </button>
                            </div>

                            {footerForm.socialLinks.length === 0 ? (
                                <p className="text-xs text-[#555]">
                                    No social links added yet. Click &quot;Add Link&quot; to start.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {footerForm.socialLinks.map((link, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-3 rounded-lg border border-white/[0.06] bg-[#0c0c0c] p-3 sm:flex-row sm:items-center"
                                        >
                                            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                                                <input
                                                    type="text"
                                                    value={link.iconName}
                                                    onChange={(e) =>
                                                        updateSocialLink(index, 'iconName', e.target.value)
                                                    }
                                                    placeholder="Icon name (e.g. Instagram)"
                                                    className="w-full rounded-md border border-white/[0.06] bg-[#141414] px-3 py-1.5
                                                        text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                                        focus:border-[#c8a96e]/40 sm:w-40"
                                                />
                                                <input
                                                    type="url"
                                                    value={link.url}
                                                    onChange={(e) =>
                                                        updateSocialLink(index, 'url', e.target.value)
                                                    }
                                                    placeholder="https://..."
                                                    className="flex-1 rounded-md border border-white/[0.06] bg-[#141414] px-3 py-1.5
                                                        text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                                        focus:border-[#c8a96e]/40"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeSocialLink(index)}
                                                className="self-end rounded-md p-1.5 text-[#555] transition-colors hover:bg-red-500/10 hover:text-red-400 sm:self-center"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSaveFooter}
                                disabled={savingFooter}
                                className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-4 py-2
                                    text-sm font-medium text-[#0a0a0a] transition-all duration-200
                                    hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {savingFooter ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                <span>Save Footer</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <ConfirmModal
                open={deleteLinkIndex !== null}
                title="Delete Social Link"
                message="Are you sure you want to delete this social media link? This action cannot be undone."
                onConfirm={confirmDeleteSocialLink}
                onCancel={() => setDeleteLinkIndex(null)}
            />
        </>
    );
}
