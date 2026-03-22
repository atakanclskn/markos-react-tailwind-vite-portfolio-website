'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { useAdminStore } from '@/store/adminStore';
import { getFounderInfo, updateFounderInfo, logAuditAction } from '@/lib/firestore';
import type { FounderInfo, FounderStat } from '@/types';
import { InputField, SaveButton, DriveIcon } from '../components';
import { Loader2, X, LogIn, LogOut, HardDrive, Plus, Trash2 } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useWebHaptics } from 'web-haptics/react';
import GooglePicker, { PickerFile } from '@/components/admin/GooglePicker';
import AdminSplitView from '@/components/admin/AdminSplitView';
import FounderSection from '@/components/FounderSection';
import GoogleButton from '@/components/admin/GoogleButton';

export default function FounderSectionPage() {
    const { trigger } = useWebHaptics();
    const { founderInfo, setFounderInfo, adminEmail } = useAdminStore();
    const { data: session } = useSession();
    const accessToken = (session as any)?.accessToken as string | undefined;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const [uploadMode, setUploadMode] = useState<'drive' | 'computer'>('computer');
    const [pickedDriveFile, setPickedDriveFile] = useState<PickerFile | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [founderForm, setFounderForm] = useState<FounderInfo>({
        name: '', title: '', bio: '', photoUrl: '',
        stats: [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }],
    });

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const founder = await getFounderInfo();
                if (founder) {
                    setFounderInfo(founder);
                    setFounderForm({
                        ...founder,
                        stats: founder.stats?.length ? founder.stats : [{ value: '', label: '' }, { value: '', label: '' }, { value: '', label: '' }],
                    });
                    if (founder.photoUrl) setPhotoPreview(founder.photoUrl);
                }
            } catch (err) {
                console.error('Failed to fetch founder info:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [setFounderInfo]);

    const handleSaveFounder = async () => {
        setSaving(true);
        try {
            let photoUrl = founderForm.photoUrl;

            if (uploadMode === 'computer' && photoFile) {
                const formData = new FormData();
                formData.append('file', photoFile);
                const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                if (!res.ok) throw new Error('Failed to upload local image');
                const data = await res.json();
                photoUrl = data.storageUrl;
            } else if (uploadMode === 'drive' && pickedDriveFile) {
                if (!accessToken) throw new Error('Missing Google access token');
                const res = await fetch('/api/admin/google-drive/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileId: pickedDriveFile.id, accessToken: accessToken, fileName: pickedDriveFile.name }),
                });
                if (!res.ok) throw new Error(await res.text() || 'Failed to upload from Google Drive');
                const data = await res.json();
                photoUrl = data.storageUrl;
            }

            const data = { ...founderForm, photoUrl };
            await updateFounderInfo(data);
            setFounderInfo(data);

            const emailToLog = adminEmail || 'Unknown User';
            await logAuditAction('UPDATE', 'Updated FOUNDER Section', 'Changes saved to database.', emailToLog);

            setPhotoFile(null);
            setPickedDriveFile(null);
            setPhotoPreview(photoUrl);
            showToast('Founder section saved successfully.');
        } catch (err: any) {
            console.error('Failed to save founder:', err);
            trigger("error");
            showToast(err.message || 'Failed to save Founder Info');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setPickedDriveFile(null);
    };

    const handleDriveFileSelect = (files: PickerFile[]) => {
        if (files.length > 0) {
            setPickedDriveFile(files[0]);
            setPhotoFile(null);
            setPhotoPreview(files[0].thumbnailLink || null);
        }
    };

    const updateStat = (index: number, field: keyof FounderStat, value: string) => {
        const updated = [...founderForm.stats];
        updated[index] = { ...updated[index], [field]: value };
        setFounderForm({ ...founderForm, stats: updated });
    };

    const addStat = () => {
        setFounderForm({ ...founderForm, stats: [...founderForm.stats, { value: '', label: '' }] });
    };

    const removeStat = (index: number) => {
        const updated = [...founderForm.stats];
        updated.splice(index, 1);
        setFounderForm({ ...founderForm, stats: updated });
    };

    if (loading) {
        return (
            <>
                <Topbar title="About (Founder)" />
                <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" /></div>
            </>
        );
    }

    return (
        <AdminSplitView
            title="About (Founder) Editor"
            preview={
                <div className="w-full min-h-full bg-[#0a0a0a]">
                    <FounderSection previewData={founderForm} />
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
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="Name" value={founderForm.name} onChange={(v) => setFounderForm({ ...founderForm, name: v })} placeholder="e.g. Onur Satici" />
                        <InputField label="Title / Role" value={founderForm.title} onChange={(v) => setFounderForm({ ...founderForm, title: v })} placeholder="e.g. Founder & Photographer" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm text-[#a0a0a0]">Biography</label>
                        <textarea
                            value={founderForm.bio}
                            onChange={(e) => setFounderForm({ ...founderForm, bio: e.target.value })}
                            rows={4}
                            placeholder="Write a short biography..."
                            className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#444] outline-none resize-none transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                        />
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <label className="block text-sm text-[#a0a0a0]">Statistics</label>
                            <button
                                onClick={addStat}
                                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-[#141414] px-3 py-1.5 text-xs text-[#f5f5f5] transition-colors hover:bg-white/[0.04] hover:text-[#c8a96e]"
                            >
                                <Plus className="h-3.5 w-3.5" /> Add Stat
                            </button>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {founderForm.stats.map((stat, i) => (
                                <div key={i} className="group relative rounded-lg border border-white/[0.06] bg-[#111] p-3">
                                    <button
                                        onClick={() => removeStat(i)}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.06] bg-[#1a1a1a] text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                    <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="e.g. 10+" className="mb-2 w-full rounded-md border border-white/[0.06] bg-[#0a0a0a] px-3 py-1.5 text-center text-lg font-bold text-[#c8a96e] placeholder-[#333] outline-none focus:border-[#c8a96e]/40" />
                                    <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="e.g. Years Experience" className="w-full rounded-md border border-white/[0.06] bg-[#0a0a0a] px-3 py-1.5 text-center text-xs text-[#a0a0a0] placeholder-[#333] outline-none focus:border-[#c8a96e]/40" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-white/[0.06] bg-[#1a1a1a] p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <label className="text-sm font-medium text-[#f5f5f5]">Profile Photo</label>
                            {uploadMode === 'drive' && (
                                !session ? (
                                    <GoogleButton
                                        text="Connect Google"
                                        onClick={() => signIn('google')}
                                        className="!w-auto !py-1.5 !px-3 text-xs"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-[#666]">{session.user?.email}</span>
                                        <button onClick={() => signOut()} className="flex items-center rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1.5 text-xs text-red-500 hover:bg-red-500/20"><LogOut className="h-3.5 w-3.5" /></button>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="mb-4 flex gap-1 rounded-lg border border-white/[0.06] bg-[#0d0d0d] p-1">
                            <button onClick={() => setUploadMode('drive')} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${uploadMode === 'drive' ? 'bg-white/[0.06] text-[#f5f5f5]' : 'text-[#666] hover:text-[#a0a0a0]'}`}>
                                <DriveIcon className="h-4 w-4" /> Google Drive
                            </button>
                            <button onClick={() => setUploadMode('computer')} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${uploadMode === 'computer' ? 'bg-white/[0.06] text-[#f5f5f5]' : 'text-[#666] hover:text-[#a0a0a0]'}`}>
                                <HardDrive className="h-3.5 w-3.5" /> From Computer
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {photoPreview && <img src={photoPreview} alt="Preview" className="h-24 w-24 shrink-0 rounded-xl object-cover border border-white/[0.06]" />}
                            <div className="flex-1 w-full flex items-center justify-start h-24">
                                {uploadMode === 'drive' && session && (
                                    <GooglePicker accessToken={accessToken || ''} onPhotosSelected={handleDriveFileSelect}>
                                        <button className="flex w-fit items-center gap-2 rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-white/[0.04]">
                                            <DriveIcon className="h-4 w-4" /> <span>{pickedDriveFile ? pickedDriveFile.name : 'Select from Google Drive'}</span>
                                        </button>
                                    </GooglePicker>
                                )}
                                {uploadMode === 'drive' && !session && <p className="text-sm text-[#666]">Sign in to Google to pick photos.</p>}
                                {uploadMode === 'computer' && (
                                    <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5 text-sm text-[#f5f5f5] hover:bg-white/[0.04]">
                                        <HardDrive className="h-4 w-4" /> <span>{photoFile ? photoFile.name : 'Browse Files'}</span>
                                        <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <SaveButton onClick={handleSaveFounder} loading={saving} />
                </div>
            </div>
        </AdminSplitView>
    );
}
