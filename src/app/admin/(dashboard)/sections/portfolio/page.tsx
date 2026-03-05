'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { useAdminStore } from '@/store/adminStore';
import { getBentoGridSettings, updateBentoGridSettings, logAuditAction } from '@/lib/firestore';
import type { BentoGridSettings } from '@/types';
import { SliderField, SaveButton } from '../components';
import { Loader2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function PortfolioSettingsPage() {
    const { data: session } = useSession();
    const { bentoGridSettings, setBentoGridSettings } = useAdminStore();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [bentoSettingsForm, setBentoSettingsForm] = useState<BentoGridSettings>({
        animationIntervalSeconds: 12,
    });

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const bento = await getBentoGridSettings();
                if (bento) {
                    setBentoGridSettings(bento);
                    setBentoSettingsForm(bento);
                }
            } catch (err) {
                console.error('Failed to fetch portfolio settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [setBentoGridSettings]);

    const handleSaveBentoGrid = async () => {
        setSaving(true);
        try {
            await updateBentoGridSettings(bentoSettingsForm);
            setBentoGridSettings(bentoSettingsForm);

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('UPDATE', 'Updated Portfolio Settings', `Animation interval set to ${bentoSettingsForm.animationIntervalSeconds}s`, adminEmail);

            showToast('Portfolio Grid settings saved successfully.');
        } catch (err) {
            console.error('Failed to save bento grid settings:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Topbar title="Portfolio Settings" />
                <div className="flex justify-center py-32">
                    <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                </div>
            </>
        );
    }

    return (
        <>
            <Topbar title="Portfolio Settings" />
            {toast && (
                <div className="fixed right-4 left-4 sm:left-auto sm:right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
                    <span>{toast}</span>
                    <button onClick={() => setToast(null)}><X className="h-3.5 w-3.5" /></button>
                </div>
            )}
            <div className="mx-auto max-w-3xl p-6 lg:p-8">
                <div className="rounded-xl border border-white/[0.06] bg-[#111] p-6 space-y-4">
                    <div className="text-sm text-[#a0a0a0] mb-4 border-b border-white/5 pb-4">
                        Adjust the overall pacing of the portfolio gallery animations. A higher number means fewer layout shifts and slower image changes, creating a calmer experience.
                    </div>

                    <div className="grid gap-6 sm:grid-cols-1 max-w-md">
                        <SliderField
                            label="Animation Frequency (Seconds)"
                            value={bentoSettingsForm.animationIntervalSeconds || 12}
                            min={5}
                            max={60}
                            onChange={(v) => setBentoSettingsForm({ ...bentoSettingsForm, animationIntervalSeconds: v })}
                        />
                    </div>

                    <SaveButton onClick={handleSaveBentoGrid} loading={saving} />
                </div>
            </div>
        </>
    );
}
