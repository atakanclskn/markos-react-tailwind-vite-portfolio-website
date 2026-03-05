'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import { useAdminStore } from '@/store/adminStore';
import { getPreloaderSettings, updatePreloaderSettings, logAuditAction } from '@/lib/firestore';
import type { PreloaderSettings, PreloaderImage } from '@/types';
import { SaveButton, DriveIcon } from '../components';
import { Loader2, X, Trash2, GripVertical, LogIn, LogOut, HardDrive, Plus } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import GooglePicker, { PickerFile } from '@/components/admin/GooglePicker';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import GoogleButton from '@/components/admin/GoogleButton';
import { useWebHaptics } from 'web-haptics/react';

export default function PreloaderPage() {
    const { preloaderSettings, setPreloaderSettings } = useAdminStore();
    const { data: session } = useSession();
    const { trigger } = useWebHaptics();
    const accessToken = (session as any)?.accessToken as string | undefined;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const [uploadMode, setUploadMode] = useState<'drive' | 'computer'>('computer');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [images, setImages] = useState<PreloaderImage[]>([]);

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const preloader = await getPreloaderSettings();
                if (preloader) {
                    setPreloaderSettings(preloader);
                    setImages(preloader.images || []);
                }
            } catch (err) {
                console.error('Failed to fetch preloader settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [setPreloaderSettings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const data: PreloaderSettings = { images };
            await updatePreloaderSettings(data);
            setPreloaderSettings(data);

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('UPDATE', 'Updated PRELOADER Images', `Saved ${images.length} images to the loading screen.`, adminEmail);

            showToast('Preloader settings saved successfully.');
        } catch (err) {
            console.error('Failed to save preloader settings:', err);
            showToast('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Failed to upload local image');
            const data = await res.json();

            setImages(prev => [...prev, {
                id: Math.random().toString(36).substring(7),
                storageUrl: data.storageUrl,
                thumbnailUrl: data.storageUrl
            }]);
        } catch (err) {
            showToast('Upload failed.');
            trigger("error");
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const handleDriveFileSelect = async (files: PickerFile[]) => {
        if (files.length === 0) return;

        setUploadingImage(true);
        try {
            if (!accessToken) throw new Error('Missing Google access token');

            const newImages: PreloaderImage[] = [];
            for (const file of files) {
                const res = await fetch('/api/admin/google-drive/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileId: file.id, accessToken: accessToken, fileName: file.name }),
                });
                if (!res.ok) throw new Error('Upload failed');
                const data = await res.json();
                newImages.push({
                    id: Math.random().toString(36).substring(7),
                    storageUrl: data.storageUrl,
                    thumbnailUrl: file.thumbnailLink || data.storageUrl
                });
            }

            setImages(prev => [...prev, ...newImages]);
        } catch (err) {
            showToast('Google Drive upload failed.');
            trigger("error");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(images);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setImages(items);
    };

    const handleDelete = (id: string) => {
        setImages(images.filter(img => img.id !== id));
    };

    if (loading) {
        return (
            <>
                <Topbar title="Preloader Settings" />
                <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" /></div>
            </>
        );
    }

    return (
        <>
            <Topbar title="Preloader Settings" />
            {toast && (
                <div className="fixed right-4 left-4 sm:left-auto sm:right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
                    <span className="truncate">{toast}</span>
                    <button onClick={() => setToast(null)} className="shrink-0"><X className="h-3.5 w-3.5" /></button>
                </div>
            )}

            <div className="w-full overflow-x-hidden">
                <div className="mx-auto max-w-3xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Header */}
                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-base sm:text-lg font-semibold text-[#f5f5f5]">Preloader Carousel Images</h2>
                        <p className="mt-1 text-xs sm:text-sm text-[#a0a0a0] leading-relaxed">
                            These images will appear in the high-speed carousel when users first load your website.
                            We recommend adding at least 8 images for a seamless loop.
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="rounded-xl border border-white/[0.06] bg-[#111] p-3 sm:p-5 lg:p-6 space-y-5 sm:space-y-6">

                        {/* ── Add Image Controls ── */}
                        <div className="rounded-lg border border-white/[0.06] bg-[#1a1a1a] p-3 sm:p-4">
                            {/* Header row */}
                            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                <label className="text-sm font-medium text-[#f5f5f5]">Add Images</label>
                                {uploadMode === 'drive' && (
                                    !session ? (
                                        <GoogleButton
                                            text="Connect Google"
                                            onClick={() => signIn('google')}
                                            className="!w-auto !py-1.5 !px-3 text-xs"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xs text-[#666] truncate max-w-[150px]">{session.user?.email}</span>
                                            <button onClick={() => signOut()} className="flex items-center shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1.5 text-xs text-red-500 hover:bg-red-500/20"><LogOut className="h-3.5 w-3.5" /></button>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Mode Toggle */}
                            <div className="mb-3 sm:mb-4 flex gap-1 rounded-lg border border-white/[0.06] bg-[#0d0d0d] p-1">
                                <button onClick={() => setUploadMode('drive')} className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${uploadMode === 'drive' ? 'bg-white/[0.06] text-[#f5f5f5]' : 'text-[#666] hover:text-[#a0a0a0]'}`}>
                                    <DriveIcon className="h-4 w-4 shrink-0" /> <span>Google Drive</span>
                                </button>
                                <button onClick={() => setUploadMode('computer')} className={`flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-md px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${uploadMode === 'computer' ? 'bg-white/[0.06] text-[#f5f5f5]' : 'text-[#666] hover:text-[#a0a0a0]'}`}>
                                    <HardDrive className="h-3.5 w-3.5 shrink-0" /> <span>From Computer</span>
                                </button>
                            </div>

                            {/* Upload Area */}
                            <div className="flex items-center justify-center min-h-[4.5rem] sm:min-h-[5rem] p-3 sm:p-4 text-center border-2 border-dashed border-white/[0.1] rounded-lg hover:border-[#c8a96e]/50 transition-colors">
                                {uploadingImage ? (
                                    <div className="flex items-center gap-2 text-[#c8a96e]"><Loader2 className="h-5 w-5 animate-spin" /> <span className="text-sm">Uploading...</span></div>
                                ) : uploadMode === 'drive' && session ? (
                                    <GooglePicker accessToken={accessToken || ''} onPhotosSelected={handleDriveFileSelect}>
                                        <button className="flex w-full h-full items-center justify-center gap-2 text-xs sm:text-sm text-[#f5f5f5]">
                                            <Plus className="h-5 w-5 text-[#c8a96e] shrink-0" />
                                            <span>Select from Drive</span>
                                        </button>
                                    </GooglePicker>
                                ) : uploadMode === 'drive' && !session ? (
                                    <p className="text-xs sm:text-sm text-[#666]">Sign in to Google to pick photos.</p>
                                ) : (
                                    <label className="flex w-full h-full cursor-pointer items-center justify-center gap-2 text-xs sm:text-sm text-[#f5f5f5]">
                                        <Plus className="h-5 w-5 text-[#c8a96e] shrink-0" />
                                        <span>Select a file</span>
                                        <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* ── Image List ── */}
                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm font-medium text-[#f5f5f5]">Carousel Order</label>
                                <span className="text-xs text-[#a0a0a0]">{images.length} images</span>
                            </div>

                            {images.length === 0 ? (
                                <div className="p-6 sm:p-8 text-center border border-white/[0.06] rounded-xl bg-[#141414]">
                                    <p className="text-[#666] text-xs sm:text-sm">No images selected yet. Using default fallback images.</p>
                                </div>
                            ) : (
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="preloader-images" direction="vertical">
                                        {(provided: any) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                {images.map((img, index) => (
                                                    <Draggable key={img.id} draggableId={img.id} index={index}>
                                                        {(provided: any, snapshot: any) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                className={`flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#141414] p-2 transition-colors ${snapshot.isDragging ? 'border-[#c8a96e]/50 shadow-lg' : 'hover:border-white/[0.1]'
                                                                    }`}
                                                            >
                                                                <div {...provided.dragHandleProps} className="cursor-grab p-0.5 sm:p-1 text-[#666] hover:text-[#f5f5f5] active:cursor-grabbing shrink-0">
                                                                    <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </div>
                                                                <img
                                                                    src={img.thumbnailUrl}
                                                                    alt=""
                                                                    className="h-9 w-12 sm:h-12 sm:w-16 shrink-0 rounded object-cover"
                                                                    loading="lazy"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="truncate text-[10px] sm:text-xs text-[#555]">
                                                                        {img.storageUrl}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(img.id)}
                                                                    className="shrink-0 rounded-lg p-1.5 sm:p-2 text-[#666] transition-colors hover:bg-red-500/10 hover:text-red-500"
                                                                    title="Delete image"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
                        </div>

                        <SaveButton onClick={handleSave} loading={saving} />
                    </div>
                </div>
            </div>
        </>
    );
}
