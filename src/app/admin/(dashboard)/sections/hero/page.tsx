'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { useAdminStore } from '@/store/adminStore';
import { getHeroContent, updateHeroContent } from '@/lib/firestore';
import type { HeroContent } from '@/types';
import { InputField, SaveButton } from '../components';
import { Loader2, X } from 'lucide-react';
import AdminSplitView from '@/components/admin/AdminSplitView';
import Hero from '@/components/Hero';

export default function HeroSectionPage() {
    const { heroContent, setHeroContent } = useAdminStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [heroForm, setHeroForm] = useState<HeroContent>({ title: '', subtitle: '', buttonText: '' });

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const hero = await getHeroContent();
                if (hero) {
                    setHeroContent(hero);
                    setHeroForm(hero);
                }
            } catch (err) {
                console.error('Failed to fetch hero content:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [setHeroContent]);

    const handleSaveHero = async () => {
        setSaving(true);
        try {
            await updateHeroContent(heroForm);
            setHeroContent(heroForm);
            showToast('Hero section saved successfully.');
        } catch (err) {
            console.error('Failed to save hero:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Topbar title="Hero Section" />
                <div className="flex justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    return (
        <AdminSplitView
            title="Hero Section Editor"
            preview={
                <div className="w-full min-h-full bg-black">
                    <Hero previewData={heroForm} />
                </div>
            }
        >
            <div className="p-6 lg:p-8 space-y-6">
                {toast && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-sm">
                        <span>{toast}</span>
                        <button onClick={() => setToast(null)} className="ml-auto"><X className="h-3.5 w-3.5" /></button>
                    </div>
                )}
                <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6 space-y-4">
                    <InputField
                        label="Main Title"
                        value={heroForm.title}
                        onChange={(v) => setHeroForm({ ...heroForm, title: v })}
                        placeholder="e.g. Capturing Moments"
                    />
                    <InputField
                        label="Subtitle"
                        value={heroForm.subtitle}
                        onChange={(v) => setHeroForm({ ...heroForm, subtitle: v })}
                        placeholder="e.g. Professional photography services"
                    />
                    <InputField
                        label="Button Text"
                        value={heroForm.buttonText}
                        onChange={(v) => setHeroForm({ ...heroForm, buttonText: v })}
                        placeholder="e.g. View Portfolio"
                    />
                    <SaveButton onClick={handleSaveHero} loading={saving} />
                </div>
            </div>
        </AdminSplitView>
    );
}
