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
    HardDrive,
    Cloud,
    ArrowUp,
    ArrowDown,
    Plus,
    Check
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
    addCategory as addCategoryFn,
    updateCategory as updateCategoryFn,
    deleteCategory as deleteCategoryFn,
    logAuditAction,
} from '@/lib/firestore';
import GooglePicker, { PickerFile } from '@/components/admin/GooglePicker';
import CustomDropdown from '@/components/admin/CustomDropdown';
import type { Photo, Category } from '@/types';
import { ConfirmModal, DriveIcon } from '../sections/components';
import GoogleButton from '@/components/admin/GoogleButton';


// ─── Reusable Modals ────────────────────────────────────────────────────────
// Removed Inline ConfirmModal

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
                        <CustomDropdown
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            value={categoryId}
                            onChange={(val: string) => setCategoryId(val)}
                            placeholder="Select category..."
                        />
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
export default function GalleryPage() {
    const { data: session } = useSession();
    const { photos, setPhotos, categories, setCategories, syncProgress, setSyncProgress } =
        useAdminStore();

    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [pickedFiles, setPickedFiles] = useState<PickerFile[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [uploadMode, setUploadMode] = useState<'drive' | 'computer'>('drive');
    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const [mobileAlbumsOpen, setMobileAlbumsOpen] = useState(false);

    // Modals
    const [deleteTarget, setDeleteTarget] = useState<Photo | null>(null);
    const [editTarget, setEditTarget] = useState<Photo | null>(null);

    // Category Management States
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
    const [editCatName, setEditCatName] = useState('');
    const [newCatName, setNewCatName] = useState('');
    const [addingCat, setAddingCat] = useState(false);
    const [savingCat, setSavingCat] = useState(false);

    useEffect(() => {
        if (filterCategory !== 'all') {
            setSelectedCategoryId(filterCategory);
        } else {
            setSelectedCategoryId('');
        }
    }, [filterCategory]);

    const showToast = useCallback((type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
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

    // ─── Category Handlers ──────────────────────────────────────────────────
    const generateSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        setSavingCat(true);
        try {
            const slug = generateSlug(newCatName);
            const order = categories.length;
            const docRef = await addCategoryFn({ name: newCatName.trim(), slug, order });
            setCategories([...categories, { id: docRef.id, name: newCatName.trim(), slug, order, createdAt: new Date() }]);

            // Audit Log
            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('CREATE', 'Created Category', `Category: ${newCatName.trim()}`, adminEmail);

            setNewCatName('');
            setAddingCat(false);
            showToast('success', 'Category added successfully.');
        } catch (err) {
            showToast('error', 'Failed to add category.');
        } finally {
            setSavingCat(false);
        }
    };

    const handleSaveEditCategory = async () => {
        if (!editingCatId || !editCatName.trim()) return;
        setSavingCat(true);
        try {
            const slug = generateSlug(editCatName);
            await updateCategoryFn(editingCatId, { name: editCatName.trim(), slug });
            setCategories(categories.map((c) => c.id === editingCatId ? { ...c, name: editCatName.trim(), slug } : c));

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('UPDATE', 'Updated Category', `Category renamed to: ${editCatName.trim()}`, adminEmail);

            setEditingCatId(null);
            showToast('success', 'Category updated.');
        } catch (err) {
            showToast('error', 'Failed to update category.');
        } finally {
            setSavingCat(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!deletingCatId) return;
        setSavingCat(true);
        try {
            await deleteCategoryFn(deletingCatId);
            setCategories(categories.filter((c) => c.id !== deletingCatId));

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('DELETE', 'Deleted Category', `Category ID: ${deletingCatId}`, adminEmail);

            if (filterCategory === deletingCatId) setFilterCategory('all');
            if (selectedCategoryId === deletingCatId) setSelectedCategoryId('');
            showToast('success', 'Category deleted.');
        } catch (err) {
            showToast('error', 'Failed to delete category.');
        } finally {
            setDeletingCatId(null);
            setSavingCat(false);
        }
    };

    const handleReorderCategory = async (index: number, direction: 'up' | 'down') => {
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= categories.length) return;
        const updated = [...categories];
        [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
        const reordered = updated.map((cat, i) => ({ ...cat, order: i }));
        setCategories(reordered);
        try {
            await Promise.all([
                updateCategoryFn(reordered[index].id, { order: index }),
                updateCategoryFn(reordered[swapIndex].id, { order: swapIndex }),
            ]);
        } catch (err) {
            showToast('error', 'Failed to reorder categories.');
        }
    };

    // ─── Photo Upload Handlers ──────────────────────────────────────────────
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
            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('CREATE', 'Uploaded Photos (Google Drive)', `${synced} photo(s) added to category ${getCategoryName(selectedCategoryId)}`, adminEmail);

            showToast('success', `${synced} photo(s) added!`);
            setPhotos(await getAllPhotos());
            setPickedFiles([]);
        } else {
            showToast('error', 'Failed to upload. Please try again.');
        }
        setIsSyncing(false);
    };

    const handleLocalUpload = async () => {
        if (!localFiles.length || !selectedCategoryId) {
            showToast('error', 'Select a category and at least one photo.');
            return;
        }
        setIsSyncing(true);
        setSyncProgress({ status: 'syncing', total: localFiles.length, current: 0, message: 'Uploading...' });
        let synced = 0;
        const errors: string[] = [];
        for (let i = 0; i < localFiles.length; i++) {
            const file = localFiles[i];
            setSyncProgress({
                status: 'syncing', total: localFiles.length, current: i,
                message: `Uploading ${i + 1} of ${localFiles.length}: ${file.name}`,
            });
            try {
                const form = new FormData();
                form.append('file', file);
                form.append('fileName', file.name);
                const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
                const data = await res.json();
                if (data.error) {
                    errors.push(`${file.name}: ${data.error}`);
                } else {
                    const photoCount = await getCollectionCount('photos');
                    await addPhoto({
                        categoryId: selectedCategoryId,
                        storageUrl: data.storageUrl,
                        thumbnailUrl: data.thumbnailUrl,
                        width: 0, height: 0, order: photoCount,
                    });
                    synced++;
                }
            } catch {
                errors.push(`${file.name}: network error`);
            }
        }
        setSyncProgress({
            status: errors.length === localFiles.length ? 'error' : 'complete',
            total: localFiles.length, current: synced,
            message: `Synced ${synced} of ${localFiles.length} photos.${errors.length ? ' Some failed.' : ''}`,
        });
        if (synced > 0) {
            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('CREATE', 'Uploaded Photos (Local)', `${synced} photo(s) added to category ${getCategoryName(selectedCategoryId)}`, adminEmail);

            showToast('success', `${synced} photo(s) uploaded!`);
            setPhotos(await getAllPhotos());
            setLocalFiles([]);
        } else {
            showToast('error', 'Upload failed. Please try again.');
        }
        setIsSyncing(false);
    };

    const handleDeletePhoto = async () => {
        if (!deleteTarget) return;
        try {
            await deletePhotoFn(deleteTarget.id);
            setPhotos(photos.filter((p) => p.id !== deleteTarget.id));

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('DELETE', 'Deleted Photo', `Photo removed from ${getCategoryName(deleteTarget.categoryId)}`, adminEmail);

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

            const adminEmail = session?.user?.email || 'Unknown User';
            await logAuditAction('UPDATE', 'Updated Photo Details', `Edited photo in ${getCategoryName(data.categoryId)}`, adminEmail);

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
            <Topbar title="Gallery Manager" />

            {/* Toast */}
            {toast && (
                <div
                    className={`fixed right-6 top-20 z-[100] flex items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${toast.type === 'success'
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
                open={!!deleteTarget || !!deletingCatId}
                title={deleteTarget ? "Delete Photo" : "Delete Album"}
                message={deleteTarget ? "Are you sure you want to delete this photo? This action cannot be undone." : "Are you sure you want to delete this album? Photos inside will become uncategorized!"}
                onConfirm={deleteTarget ? handleDeletePhoto : handleDeleteCategory}
                onCancel={() => { setDeleteTarget(null); setDeletingCatId(null); }}
            />

            {/* Edit Photo Modal */}
            <EditPhotoModal
                photo={editTarget}
                categories={categories}
                onSave={handleSaveEdit}
                onClose={() => setEditTarget(null)}
            />

            <div className="mx-auto flex h-[calc(100vh-64px)] max-w-[1600px] flex-col gap-6 overflow-hidden p-6 lg:flex-row lg:p-8">
                {/* ─── Left Sidebar: Albums/Categories ─── */}
                <div className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto lg:w-[320px] custom-scrollbar pb-20">
                    {/* ─── Left Side: Albums Sidebar ─── */}
                    <div className="w-full lg:w-64 shrink-0 rounded-xl border border-white/[0.06] bg-[#111]">
                        <div
                            className="flex items-center justify-between border-b border-white/[0.06] p-4 cursor-pointer lg:cursor-default select-none lg:select-auto"
                            onClick={() => setMobileAlbumsOpen(!mobileAlbumsOpen)}
                        >
                            <h3 className="text-base font-semibold text-[#f5f5f5]">
                                Albums <span className="text-xs text-[#666] lg:hidden mb-0.5 ml-2 font-normal">({categories.length + 1})</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setAddingCat(true); }}
                                    className="rounded p-1 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]"
                                    title="Add Category"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                                <button className="lg:hidden rounded p-1 text-[#666]">
                                    {mobileAlbumsOpen ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className={`p-3 space-y-1 relative ${mobileAlbumsOpen ? 'block' : 'hidden lg:block'}`}>
                            {addingCat && (
                                <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#1a1a1a] p-2">
                                    <input
                                        type="text"
                                        value={newCatName}
                                        onChange={(e) => setNewCatName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                        placeholder="Album name..."
                                        autoFocus
                                        className="w-full bg-transparent text-sm text-[#f5f5f5] placeholder-[#666] outline-none"
                                    />
                                    <button onClick={handleAddCategory} disabled={savingCat || !newCatName.trim()} className="text-[#c8a96e] disabled:opacity-50">
                                        {savingCat ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    </button>
                                    <button onClick={() => setAddingCat(false)} className="text-[#666] hover:text-[#f5f5f5]"><X className="h-4 w-4" /></button>
                                </div>
                            )}

                            <button
                                onClick={() => { setFilterCategory('all'); setMobileAlbumsOpen(false); }}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterCategory === 'all' ? 'bg-[#c8a96e]/10 text-[#c8a96e]' : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                                    }`}
                            >
                                <ImageIcon className="h-4 w-4 shrink-0" />
                                All Photos
                            </button>

                            {loading ? (
                                <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-[#c8a96e]" /></div>
                            ) : categories.map((cat, index) => (
                                <div key={cat.id} className={`flex items-center justify-between group rounded-lg px-3 py-2 text-sm font-medium transition-colors ${filterCategory === cat.id ? 'bg-[#c8a96e]/10 text-[#c8a96e]' : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'}`}>
                                    {editingCatId === cat.id ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input value={editCatName} onChange={(e) => setEditCatName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSaveEditCategory()} autoFocus className="w-full bg-transparent outline-none text-[#f5f5f5]" />
                                            <button onClick={handleSaveEditCategory} disabled={savingCat || !editCatName.trim()} className="text-[#c8a96e] shrink-0"><Check className="h-3.5 w-3.5" /></button>
                                            <button onClick={() => setEditingCatId(null)} className="text-[#666] shrink-0"><X className="h-3.5 w-3.5" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => { setFilterCategory(cat.id); setMobileAlbumsOpen(false); }} className="flex-1 text-left flex items-center gap-3 min-w-0 pr-2">
                                                <FolderOpen className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{cat.name}</span>
                                            </button>
                                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button disabled={index === 0} onClick={() => handleReorderCategory(index, 'up')} className="p-1 flex items-center justify-center text-[#666] hover:text-[#f5f5f5] disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
                                                <button disabled={index === categories.length - 1} onClick={() => handleReorderCategory(index, 'down')} className="p-1 flex items-center justify-center text-[#666] hover:text-[#f5f5f5] disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
                                                <button onClick={() => { setEditingCatId(cat.id); setEditCatName(cat.name); }} className="p-1 flex items-center justify-center text-[#666] hover:text-[#f5f5f5] ml-1"><Pencil className="h-3 w-3" /></button>
                                                <button onClick={() => setDeletingCatId(cat.id)} className="p-1 flex items-center justify-center text-[#666] hover:text-red-400"><Trash2 className="h-3 w-3" /></button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Right Side: Main Area ─── */}
                <div className="flex flex-1 flex-col gap-6 min-w-0 overflow-y-auto custom-scrollbar pb-20">
                    {/* Sync Panel */}
                    <div className="mb-8 rounded-xl border border-white/[0.06] bg-[#111] p-4 sm:p-6">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-[#f5f5f5]">
                                    {uploadMode === 'drive' ? 'Google Drive Sync' : 'Local File Upload'}
                                </h3>
                                <p className="mt-1 text-sm text-[#666]">
                                    {uploadMode === 'drive'
                                        ? 'Connect your Google account, pick photos from Drive, then save them to a category.'
                                        : 'Select photos directly from your computer and upload them to a category.'}
                                </p>
                            </div>
                            {uploadMode === 'drive' && (
                                !session ? (
                                    <div className="w-full sm:w-auto">
                                        <GoogleButton
                                            text="Connect Google Drive"
                                            onClick={() => signIn('google')}
                                        />
                                    </div>
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
                                )
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Upload Mode Tabs */}
                            <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-[#0d0d0d] p-1">
                                <button
                                    onClick={() => setUploadMode('drive')}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${uploadMode === 'drive'
                                        ? 'bg-white/[0.06] text-[#f5f5f5]'
                                        : 'text-[#666] hover:text-[#a0a0a0]'
                                        }`}
                                >
                                    <DriveIcon className="h-4 w-4" />
                                    Google Drive
                                </button>
                                <button
                                    onClick={() => setUploadMode('computer')}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${uploadMode === 'computer'
                                        ? 'bg-white/[0.06] text-[#f5f5f5]'
                                        : 'text-[#666] hover:text-[#a0a0a0]'
                                        }`}
                                >
                                    <HardDrive className="h-3.5 w-3.5" />
                                    From Computer
                                </button>
                            </div>

                            {/* Controls shown if (mode=computer) or (mode=drive and logged into Google) */}
                            {((uploadMode === 'drive' && session) || uploadMode === 'computer') && (
                                <>
                                    {/* Category selection shown for both modes */}
                                    <div>
                                        <label className="mb-1.5 block text-sm text-[#a0a0a0]">1. Select Target Category</label>
                                        <div className="sm:max-w-xs">
                                            <CustomDropdown
                                                options={[
                                                    { value: '', label: 'Select category...' },
                                                    ...categories.map(c => ({ value: c.id, label: c.name }))
                                                ]}
                                                value={selectedCategoryId}
                                                onChange={(val: string) => setSelectedCategoryId(val)}
                                                placeholder="Select category..."
                                            />
                                        </div>
                                    </div>

                                    {/* Google Drive mode */}
                                    {uploadMode === 'drive' && session && (
                                        <div>
                                            <label className="mb-1.5 block text-sm text-[#a0a0a0]">2. Pick Photos from Google Drive</label>
                                            <GooglePicker accessToken={accessToken || ''} onPhotosSelected={handlePickerSelected}>
                                                <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5 text-sm text-[#f5f5f5] transition-colors hover:bg-white/[0.04]">
                                                    <DriveIcon className="h-4 w-4" />
                                                    <span>
                                                        {pickedFiles.length > 0
                                                            ? `${pickedFiles.length} photo(s) selected`
                                                            : 'Google Drive'}
                                                    </span>
                                                </button>
                                            </GooglePicker>
                                        </div>
                                    )}

                                    {/* Computer mode */}
                                    {uploadMode === 'computer' && (
                                        <div>
                                            <label className="mb-1.5 block text-sm text-[#a0a0a0]">2. Select Photos from Your Computer</label>
                                            <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] px-4 py-2.5 text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]">
                                                <HardDrive className="h-4 w-4" />
                                                <span>
                                                    {localFiles.length > 0
                                                        ? `${localFiles.length} file(s) selected — click to change`
                                                        : 'Browse Files'}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => setLocalFiles(Array.from(e.target.files || []))}
                                                />
                                            </label>
                                            {localFiles.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {localFiles.map((f) => (
                                                        <span
                                                            key={f.name}
                                                            className="rounded bg-white/[0.05] px-2 py-0.5 text-xs text-[#888]"
                                                        >
                                                            {f.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Upload button */}
                                    {((uploadMode === 'drive' && pickedFiles.length > 0) || (uploadMode === 'computer' && localFiles.length > 0)) && selectedCategoryId && (
                                        <button
                                            onClick={uploadMode === 'drive' ? handleUploadPicked : handleLocalUpload}
                                            disabled={isSyncing}
                                            className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-5 py-2.5 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: 'var(--color-brand)' }}
                                        >
                                            {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            <span>{isSyncing ? 'Uploading...' : `Upload ${uploadMode === 'drive' ? pickedFiles.length : localFiles.length} Photo(s)`}</span>
                                        </button>
                                    )}
                                    {syncProgress.status !== 'idle' && (
                                        <div className={`rounded-lg border px-4 py-3 text-sm flex gap-2 items-center ${syncProgress.status === 'syncing' ? 'border-blue-500/20 bg-blue-500/5 text-blue-400'
                                            : syncProgress.status === 'complete' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                                                : 'border-red-500/20 bg-red-500/5 text-red-400'
                                            }`}>
                                            {syncProgress.status === 'syncing' && <Loader2 className="h-4 w-4 animate-spin" />}
                                            {syncProgress.message}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div >

                    {/* Photos Grid */}
                    < div >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-[#a0a0a0]">
                                {filterCategory === 'all' ? 'All Synced Photos' : `Photos in ${getCategoryName(filterCategory)}`} ({filteredPhotos.length})
                            </h3>
                            {/* Filter removed since it is built into the left sidebar */}
                        </div>

                        {
                            loading ? (
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
            </div>
        </>
    );
}
