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
    Pencil,
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAdminStore } from '@/store/adminStore';
import {
    getAllPhotos,
    getCategories,
    deletePhoto as deletePhotoFn,
    addPhoto,
    getCollectionCount,
    updatePhoto,
} from '@/lib/firestore';
import GooglePicker, { PickerFile } from '@/components/admin/GooglePicker';
import type { Photo } from '@/types';

// ─── Reusable Modals ────────────────────────────────────────────────────────
function ConfirmModal({
    open,
    title,
    message,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#161616] p-6 shadow-2xl mx-4">
                <h3 className="mb-2 text-base font-semibold text-[#f5f5f5]">{title}</h3>
                <p className="mb-6 text-sm text-[#888]">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-white/[0.08] px-4 py-2 text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function EditPhotoModal({
    photo,
    categories,
    onSave,
    onClose,
}: {
    photo: Photo | null;
    categories: { id: string; name: string }[];
    onSave: (id: string, data: { categoryId: string; description: string }) => Promise<void>;
    onClose: () => void;
}) {
    const [categoryId, setCategoryId] = useState(photo?.categoryId ?? '');
    const [description, setDescription] = useState(photo?.description ?? '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (photo) {
            setCategoryId(photo.categoryId);
            setDescription(photo.description ?? '');
        }
    }, [photo]);

    if (!photo) return null;

    const handleSave = async () => {
        setSaving(true);
        await onSave(photo.id, { categoryId, description });
        setSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#161616] shadow-2xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                    <h3 className="text-base font-semibold text-[#f5f5f5]">Edit Photo</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Preview */}
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-[#111]">
                        <img
                            src={photo.thumbnailUrl || photo.storageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-1.5 block text-sm text-[#a0a0a0]">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full rounded-lg border border-white/[0.06] bg-[#111] px-3 py-2.5 text-sm text-[#f5f5f5] outline-none transition-colors focus:border-[#c8a96e]/40"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                            Description <span className="text-[#555]">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Short caption or note about this photo..."
                            className="w-full resize-none rounded-lg border border-white/[0.06] bg-[#111] px-3 py-2.5 text-sm text-[#f5f5f5] placeholder-[#444] outline-none transition-colors focus:border-[#c8a96e]/40"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#e0c992] disabled:opacity-50"
                    >
                        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
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

    // Modals
    const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
    const [editTarget, setEditTarget] = useState<Photo | null>(null);

    const showToast = useCallback((type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [photosData, catsData] = await Promise.all([getAllPhotos(), getCategories()]);
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

    const handlePickerSelected = useCallback((files: PickerFile[]) => {
        setPickedFiles(files);
    }, []);

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
        setSyncProgress({ status: 'syncing', total: pickedFiles.length, current: 0, message: 'Uploading...' });
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                    body: JSON.stringify({ fileId: file.id, fileName: file.name, mimeType: file.mimeType }),
                });
                const data = await res.json();
                if (data.error) {
                    errors.push(`${file.name}: ${data.error}`);
                } else {
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
            showToast('success', `${synced} photo(s) added!`);
            setPhotos(await getAllPhotos());
            setPickedFiles([]);
        } else {
            showToast('error', 'Failed to upload. Please try again.');
        }
        setIsSyncing(false);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            await deletePhotoFn(deleteTarget.id);
            setPhotos(photos.filter((p) => p.id !== deleteTarget.id));
            showToast('success', 'Photo deleted.');
        } catch {
            showToast('error', 'Failed to delete photo.');
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleSaveEdit = async (id: string, data: { categoryId: string; description: string }) => {
        try {
            await updatePhoto(id, data);
            setPhotos(photos.map((p) => (p.id === id ? { ...p, ...data } : p)));
            showToast('success', 'Photo updated.');
        } catch {
            showToast('error', 'Failed to update photo.');
        }
    };

    const filteredPhotos =
        filterCategory === 'all' ? photos : photos.filter((p) => p.categoryId === filterCategory);

    const getCategoryName = (categoryId: string) =>
        categories.find((c) => c.id === categoryId)?.name ?? 'Uncategorized';

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

            {/* Delete Confirm Modal */}
            <ConfirmModal
                open={!!deleteTarget}
                title="Delete Photo"
                message="Are you sure you want to delete this photo? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {/* Edit Photo Modal */}
            <EditPhotoModal
                photo={editTarget}
                categories={categories}
                onSave={handleSaveEdit}
                onClose={() => setEditTarget(null)}
            />

            <div className="p-6 lg:p-8">
                {/* Sync Panel */}
                <div className="mb-8 rounded-xl border border-white/[0.06] bg-[#111] p-4 sm:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-[#f5f5f5]">Google Drive Sync</h3>
                            <p className="mt-1 text-sm text-[#666]">
                                Connect your Google account, pick photos from Drive, then save them to a category.
                            </p>
                        </div>
                        {!session ? (
                            <button
                                onClick={() => signIn('google')}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
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
                            <div>
                                <label className="mb-1.5 block text-sm text-[#a0a0a0]">1. Select Target Category</label>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5 text-sm text-[#f5f5f5] outline-none focus:border-[#c8a96e]/40 sm:max-w-xs"
                                >
                                    <option value="">Select category...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm text-[#a0a0a0]">2. Pick Photos from Google Drive</label>
                                <GooglePicker accessToken={accessToken || ''} onPhotosSelected={handlePickerSelected}>
                                    <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]">
                                        <FolderOpen className="h-4 w-4" />
                                        <span>
                                            {pickedFiles.length > 0
                                                ? `${pickedFiles.length} photo(s) selected — click to change`
                                                : 'Open Google Drive Picker'}
                                        </span>
                                    </button>
                                </GooglePicker>
                            </div>
                            {pickedFiles.length > 0 && selectedCategoryId && (
                                <button
                                    onClick={handleUploadPicked}
                                    disabled={isSyncing}
                                    className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-5 py-2.5 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    <span>{isSyncing ? 'Uploading...' : `Upload ${pickedFiles.length} Photo(s)`}</span>
                                </button>
                            )}
                            {syncProgress.status !== 'idle' && (
                                <div className={`rounded-lg border px-4 py-3 text-sm ${syncProgress.status === 'syncing' ? 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                                        : syncProgress.status === 'complete' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                                            : 'border-red-500/20 bg-red-500/5 text-red-400'
                                    }`}>
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
                            className="rounded-lg border border-white/[0.06] bg-[#111] px-3 py-1.5 text-sm text-[#f5f5f5] outline-none focus:border-[#c8a96e]/40"
                        >
                            <option value="all">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {filteredPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.06]"
                                >
                                    <img
                                        src={photo.thumbnailUrl || photo.storageUrl}
                                        alt={photo.description || ''}
                                        className="h-full w-full object-cover"
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        {/* Category badge */}
                                        <span className="self-start rounded bg-black/50 px-1.5 py-0.5 text-xs text-[#a0a0a0]">
                                            {getCategoryName(photo.categoryId)}
                                        </span>
                                        {/* Action buttons */}
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => setEditTarget(photo)}
                                                className="rounded-lg bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                                                title="Edit photo"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(photo)}
                                                className="rounded-lg bg-red-500/20 p-1.5 text-red-400 transition-colors hover:bg-red-500/40"
                                                title="Delete photo"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
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
