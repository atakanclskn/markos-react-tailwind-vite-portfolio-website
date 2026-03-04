'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import {
    RefreshCw,
    Loader2,
    Image as ImageIcon,
    Trash2,
    FolderOpen,
    Download,
    X,
    AlertCircle,
    CheckCircle2,
    LogIn,
    LogOut,
} from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAdminStore } from '@/store/adminStore';
import { getAllPhotos, getCategories, deletePhoto as deletePhotoFn } from '@/lib/firestore';
import type { GooglePhotosAlbum, Category, Photo } from '@/types';

export default function MediaPage() {
    const { data: session } = useSession();
    const { photos, setPhotos, categories, setCategories, syncProgress, setSyncProgress } =
        useAdminStore();

    const [loading, setLoading] = useState(true);
    const [albums, setAlbums] = useState<GooglePhotosAlbum[]>([]);
    const [albumsLoading, setAlbumsLoading] = useState(false);
    const [selectedAlbumId, setSelectedAlbumId] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

    // Fetch Google Photos albums
    const fetchAlbums = async () => {
        setAlbumsLoading(true);
        try {
            const res = await fetch('/api/admin/google-photos/albums');
            const data = await res.json();
            if (data.error) {
                showToast('error', data.error);
                return;
            }
            setAlbums(data.albums || []);
        } catch (err) {
            console.error('Failed to fetch albums:', err);
            showToast('error', 'Failed to fetch Google Photos albums.');
        } finally {
            setAlbumsLoading(false);
        }
    };

    // Sync album to Firebase
    const handleSync = async () => {
        if (!selectedAlbumId || !selectedCategoryId) {
            showToast('error', 'Please select both an album and a target category.');
            return;
        }

        setSyncProgress({ status: 'syncing', total: 0, current: 0, message: 'Starting sync...' });

        try {
            const res = await fetch('/api/admin/google-photos/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    albumId: selectedAlbumId,
                    categoryId: selectedCategoryId,
                }),
            });

            const data = await res.json();

            if (data.error) {
                setSyncProgress({
                    status: 'error',
                    total: 0,
                    current: 0,
                    message: data.error,
                });
                showToast('error', data.error);
                return;
            }

            setSyncProgress({
                status: 'complete',
                total: data.total || data.synced,
                current: data.synced,
                message: data.message,
            });

            showToast('success', data.message);

            // Refresh photos list
            const updatedPhotos = await getAllPhotos();
            setPhotos(updatedPhotos);
        } catch (err) {
            console.error('Sync failed:', err);
            setSyncProgress({
                status: 'error',
                total: 0,
                current: 0,
                message: 'Sync failed. Please try again.',
            });
            showToast('error', 'Sync failed. Please try again.');
        }
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
                                Connect your Google account, fetch albums, and sync photos to Firebase.
                            </p>
                        </div>

                        {!session ? (
                            <button
                                onClick={() => signIn('google')}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5
                                    text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
                            >
                                <LogIn className="h-4 w-4" />
                                <span>Connect Google Photos</span>
                            </button>
                        ) : (
                            <div className="flex w-full items-center gap-2 sm:w-auto">
                                <button
                                    onClick={fetchAlbums}
                                    disabled={albumsLoading}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-3.5 py-2
                                        text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]
                                        disabled:opacity-50 sm:flex-none"
                                >
                                    {albumsLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4" />
                                    )}
                                    <span>Fetch Albums</span>
                                </button>
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

                    {/* Album & Category Selection */}
                    {albums.length > 0 && (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                        Google Photos Album
                                    </label>
                                    <select
                                        value={selectedAlbumId}
                                        onChange={(e) => setSelectedAlbumId(e.target.value)}
                                        className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                            text-sm text-[#f5f5f5] outline-none transition-colors
                                            focus:border-[#c8a96e]/40"
                                    >
                                        <option value="">Select album...</option>
                                        {albums.map((album) => (
                                            <option key={album.id} value={album.id}>
                                                {album.title} ({album.mediaItemsCount} items)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm text-[#a0a0a0]">
                                        Target Category
                                    </label>
                                    <select
                                        value={selectedCategoryId}
                                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                                        className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                            text-sm text-[#f5f5f5] outline-none transition-colors
                                            focus:border-[#c8a96e]/40"
                                    >
                                        <option value="">Select category...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleSync}
                                disabled={syncProgress.status === 'syncing' || !selectedAlbumId || !selectedCategoryId}
                                className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-5 py-2.5
                                    text-sm font-medium text-[#0a0a0a] transition-all duration-200
                                    hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {syncProgress.status === 'syncing' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                <span>
                                    {syncProgress.status === 'syncing'
                                        ? 'Syncing...'
                                        : 'Sync Albums'}
                                </span>
                            </button>

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
                        <h3 className="text-base font-semibold text-[#f5f5f5]">
                            Synced Photos
                            <span className="ml-2 text-sm font-normal text-[#666]">
                                ({filteredPhotos.length})
                            </span>
                        </h3>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="rounded-lg border border-white/[0.06] bg-[#141414] px-3 py-2
                                text-sm text-[#a0a0a0] outline-none transition-colors
                                focus:border-[#c8a96e]/40"
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
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                        </div>
                    ) : filteredPhotos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] py-20 text-[#666]">
                            <ImageIcon className="mb-3 h-10 w-10 text-[#333]" />
                            <p className="text-sm">No photos found</p>
                            <p className="mt-1 text-xs text-[#555]">
                                Sync albums from Google Photos to see them here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {filteredPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#111]"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={photo.storageUrl}
                                            alt=""
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between px-3 py-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <FolderOpen className="h-3 w-3 text-[#555]" />
                                            <span className="text-xs text-[#666]">
                                                {getCategoryName(photo.categoryId)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeletePhoto(photo)}
                                            className="rounded-md p-1 text-[#555] transition-colors hover:bg-red-500/10 hover:text-red-400"
                                            title="Delete photo"
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
