'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import {
    Loader2,
    Image as ImageIcon,
    Trash2,
    X,
    AlertCircle,
    CheckCircle2,
    LogIn,
    LogOut,
    FolderOpen,
    Upload,
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAdminStore } from '@/store/adminStore';
import { getAllPhotos, getCategories, deletePhoto as deletePhotoFn, addPhoto, getCollectionCount } from '@/lib/firestore';
import GooglePicker, { PickerFile } from '@/components/admin/GooglePicker';
import type { Category, Photo } from '@/types';

export default function MediaPage() {
    const { data: session } = useSession();
    const { photos, setPhotos, categories, setCategories, syncProgress, setSyncProgress } =
        useAdminStore();

    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [pickedFiles, setPickedFiles] = useState<PickerFile[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const showToast = useCallback((type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    }, []);

    // Fetch photos and categories
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [photosData, catsData] = await Promise.all([
                    getAllPhotos(),
                    getCategories(),
                ]);
                setPhotos(photosData);
                setCategories(catsData);
            } catch (err) {
                console.error('Failed to fetch media data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Called when user picks files from Google Picker
    const handlePickerSelected = useCallback((files: PickerFile[]) => {
        setPickedFiles(files);
    }, []);

    // Upload selected files to ImgBB and save to Firestore
    const handleUploadPicked = async () => {
        if (!pickedFiles.length || !selectedCategoryId) {
            showToast('error', 'Select a category and pick at least one photo.');
            return;
        }

        const accessToken = (session as any)?.accessToken;
        if (!accessToken) {
            showToast('error', 'Please connect your Google account first.');
            return;
        }

        setIsSyncing(true);
        setSyncProgress({ status: 'syncing', total: pickedFiles.length, current: 0, message: 'Uploading photos...' });

        let synced = 0;
        const errors: string[] = [];

        for (let i = 0; i < pickedFiles.length; i++) {
            const file = pickedFiles[i];
            setSyncProgress({
                status: 'syncing',
                total: pickedFiles.length,
                current: i,
                message: `Uploading ${i + 1} of ${pickedFiles.length}: ${file.name}`,
            });
            try {
                const res = await fetch('/api/admin/google-drive/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        fileId: file.id,
                        fileName: file.name,
                        mimeType: file.mimeType,
                    }),
                });

                const data = await res.json();
                if (data.error) {
                    console.error(`Failed to upload ${file.name}:`, data.error);
                    errors.push(`${file.name}: ${data.error}`);
                } else {
                    // Save to Firestore client-side using the client Firebase SDK
                    const photoCount = await getCollectionCount('photos');
                    await addPhoto({
                        categoryId: selectedCategoryId,
                        storageUrl: data.storageUrl,
                        thumbnailUrl: data.thumbnailUrl,
                        googleDriveId: file.id,
                        width: 0,
                        height: 0,
                        order: photoCount,
                    });
                    synced++;
                }
            } catch (err) {
                console.error(`Network error for ${file.name}:`, err);
                errors.push(`${file.name}: network error`);
            }
        }

        setSyncProgress({
            status: errors.length === pickedFiles.length ? 'error' : 'complete',
            total: pickedFiles.length,
            current: synced,
            message: `Synced ${synced} of ${pickedFiles.length} photos.${errors.length ? ' Some failed.' : ''}`,
        });

        if (synced > 0) {
            showToast('success', `${synced} photo(s) added to your portfolio!`);
            const updatedPhotos = await getAllPhotos();
            setPhotos(updatedPhotos);
            setPickedFiles([]);
        } else {
            showToast('error', 'Failed to upload photos. Please try again.');
        }

        setIsSyncing(false);
    };

    // Delete photo
    const handleDeletePhoto = async (photo: Photo) => {
        if (!confirm('Are you sure you want to delete this photo?')) return;
        try {
            await deletePhotoFn(photo.id);
            setPhotos(photos.filter((p) => p.id !== photo.id));
            showToast('success', 'Photo deleted.');
        } catch (err) {
            console.error('Failed to delete photo:', err);
            showToast('error', 'Failed to delete photo.');
        }
    };

    // Filter photos
    const filteredPhotos =
        filterCategory === 'all'
            ? photos
            : photos.filter((p) => p.categoryId === filterCategory);

    const getCategoryName = (categoryId: string) => {
        return categories.find((c) => c.id === categoryId)?.name || 'Uncategorized';
    };

    const accessToken = (session as any)?.accessToken;

    return (
        <>
            <Topbar title="Media Sync" />

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${toast.type === 'success'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : 'border-red-500/20 bg-red-500/10 text-red-400'
                        }`}
                >
                    {toast.type === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                        <AlertCircle className="h-4 w-4 shrink-0" />
                    )}
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)}>
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="p-6 lg:p-8">
                {/* Sync Panel */}
                <div className="mb-8 rounded-xl border border-white/[0.06] bg-[#111] p-4 sm:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-[#f5f5f5]">
                                Google Photos Sync
                            </h3>
                            <p className="mt-1 text-sm text-[#666]">
                                Connect your Google account, pick photos, then save them to a category.
                            </p>
                        </div>

                        {!session ? (
                            <button
                                onClick={() => signIn('google')}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5
                                    text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Connect Google</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-[#666]">{session.user?.email}</span>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/20"
                                    title="Disconnect Google"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {session && (
                        <div className="space-y-4">
                            {/* Step 1: Category Selection */}
                            <div>
                                <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                    1. Select Target Category
                                </label>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                        text-sm text-[#f5f5f5] outline-none transition-colors
                                        focus:border-[#c8a96e]/40 sm:max-w-xs"
                                >
                                    <option value="">Select category...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Step 2: Pick Photos */}
                            <div>
                                <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                    2. Pick Photos from Google
                                </label>
                                <GooglePicker
                                    accessToken={accessToken || ''}
                                    onPhotosSelected={handlePickerSelected}
                                >
                                    <button
                                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2.5
                                            text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]"
                                    >
                                        <FolderOpen className="h-4 w-4" />
                                        <span>
                                            {pickedFiles.length > 0
                                                ? `${pickedFiles.length} photo(s) selected — click to change`
                                                : 'Open Google Photos Picker'}
                                        </span>
                                    </button>
                                </GooglePicker>
                            </div>

                            {/* Step 3: Upload */}
                            {pickedFiles.length > 0 && selectedCategoryId && (
                                <button
                                    onClick={handleUploadPicked}
                                    disabled={isSyncing}
                                    className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-5 py-2.5
                                        text-sm font-medium text-[#0a0a0a] transition-all duration-200
                                        hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSyncing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    <span>{isSyncing ? 'Uploading...' : `Upload ${pickedFiles.length} Photo(s)`}</span>
                                </button>
                            )}

                            {/* Progress */}
                            {syncProgress.status !== 'idle' && (
                                <div
                                    className={`rounded-lg border px-4 py-3 text-sm ${syncProgress.status === 'syncing'
                                        ? 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                                        : syncProgress.status === 'complete'
                                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                                            : 'border-red-500/20 bg-red-500/5 text-red-400'
                                        }`}
                                >
                                    {syncProgress.message}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Photos Grid */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#a0a0a0]">
                            Synced Photos ({filteredPhotos.length})
                        </h3>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="rounded-lg border border-white/[0.06] bg-[#111] px-3 py-1.5
                                text-sm text-[#f5f5f5] outline-none transition-colors focus:border-[#c8a96e]/40"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex h-48 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                        </div>
                    ) : filteredPhotos.length === 0 ? (
                        <div className="flex h-48 flex-col items-center justify-center gap-3 text-[#444]">
                            <ImageIcon className="h-10 w-10" />
                            <p className="text-sm">No photos found</p>
                            <p className="text-xs">Sync albums from Google Photos to see them here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {filteredPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.06]"
                                >
                                    <img
                                        src={photo.thumbnailUrl || photo.storageUrl}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <span className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-[#a0a0a0]">
                                            {getCategoryName(photo.categoryId)}
                                        </span>
                                        <button
                                            onClick={() => handleDeletePhoto(photo)}
                                            className="self-end rounded-lg bg-red-500/20 p-1.5 text-red-400 transition-colors hover:bg-red-500/40"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
