'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { Loader2, Plus, Trash2, X, Save } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import {
    getFooterContent,
    updateFooterContent,
    logAuditAction,
} from '@/lib/firestore';
import type { FooterContent, SocialLink } from '@/types';
import { InputField, SaveButton, ConfirmModal } from '../components';
import { useSession } from 'next-auth/react';
import { useWebHaptics } from 'web-haptics/react';

export default function FooterSettingsPage() {
    const { trigger } = useWebHaptics();
    const { data: session } = useSession();
    const { footerContent, setFooterContent } = useAdminStore();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [deleteLinkIndex, setDeleteLinkIndex] = useState<number | null>(null);

    const [footerForm, setFooterForm] = useState<FooterContent>({
        copyright: '',
        socialLinks: [],
    });

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const footer = await getFooterContent();
                if (footer) {
                    setFooterContent(footer);
                    setFooterForm(footer);
                }
            } catch (err) {
                console.error('Failed to fetch footer settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSaveFooter = async () => {
        setSaving(true);
        try {
            await updateFooterContent(footerForm);
            setFooterContent(footerForm);

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('SETTINGS', 'Updated Footer Details', `Modified footer content or social links.`, adminEmail);

            showToast('Footer settings saved.');
        } catch (err) {
            console.error('Failed to save footer:', err);
            trigger("error");
        } finally {
            setSaving(false);
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
                <Topbar title="Footer Section" />
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar title="Footer Section" />

            {/* Toast */}
            {toast && (
                <div className="fixed right-4 left-4 sm:left-auto sm:right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
                    <span>{toast}</span>
                    <button onClick={() => setToast(null)} className="shrink-0">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="mx-auto max-w-3xl p-6 lg:p-8 space-y-8">
                <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6 space-y-4">
                    <InputField
                        label="Copyright Text"
                        value={footerForm.copyright}
                        onChange={(val) => setFooterForm({ ...footerForm, copyright: val })}
                        placeholder="© 2026 Markos Studio. All rights reserved."
                    />

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

                    <SaveButton onClick={handleSaveFooter} loading={saving} />
                </div>
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
