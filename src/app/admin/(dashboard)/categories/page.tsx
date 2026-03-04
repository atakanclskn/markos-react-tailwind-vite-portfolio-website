'use client';

import { useEffect, useState, useCallback } from 'react';
import Topbar from '@/components/admin/Topbar';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Check,
    X,
    Loader2,
    FolderOpen,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import {
    getCategories,
    addCategory as addCategoryFn,
    updateCategory as updateCategoryFn,
    deleteCategory as deleteCategoryFn,
} from '@/lib/firestore';
import type { Category } from '@/types';

export default function CategoriesPage() {
    const { categories, setCategories } = useAdminStore();
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        try {
            const slug = generateSlug(newName);
            const order = categories.length;
            const docRef = await addCategoryFn({ name: newName.trim(), slug, order });
            const newCategory: Category = {
                id: docRef.id,
                name: newName.trim(),
                slug,
                order,
                createdAt: new Date(),
            };
            setCategories([...categories, newCategory]);
            setNewName('');
            setAdding(false);
            showToast('Category added successfully.');
        } catch (err) {
            console.error('Failed to add category:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editName.trim()) return;
        setSaving(true);
        try {
            const slug = generateSlug(editName);
            await updateCategoryFn(editingId, { name: editName.trim(), slug });
            setCategories(
                categories.map((c) =>
                    c.id === editingId ? { ...c, name: editName.trim(), slug } : c
                )
            );
            setEditingId(null);
            setEditName('');
            showToast('Category updated successfully.');
        } catch (err) {
            console.error('Failed to update category:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            await deleteCategoryFn(id);
            setCategories(categories.filter((c) => c.id !== id));
            setDeletingId(null);
            showToast('Category deleted.');
        } catch (err) {
            console.error('Failed to delete category:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleReorder = async (index: number, direction: 'up' | 'down') => {
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= categories.length) return;

        const updated = [...categories];
        [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];

        // Update order values
        const reordered = updated.map((cat, i) => ({ ...cat, order: i }));
        setCategories(reordered);

        // Persist to Firestore
        try {
            await Promise.all([
                updateCategoryFn(reordered[index].id, { order: index }),
                updateCategoryFn(reordered[swapIndex].id, { order: swapIndex }),
            ]);
        } catch (err) {
            console.error('Failed to reorder:', err);
        }
    };

    return (
        <>
            <Topbar
                title="Categories"
                actions={
                    <button
                        onClick={() => setAdding(true)}
                        className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-3.5 py-2
                            text-sm font-medium text-[#0a0a0a] transition-all duration-200 hover:bg-[#e0c992]"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Category</span>
                    </button>
                }
            />

            {/* Toast */}
            {toast && (
                <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 shadow-lg">
                    <span>{toast}</span>
                    <button onClick={() => setToast(null)}>
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            )}

            <div className="mx-auto max-w-2xl p-6 lg:p-8">
                {/* Add new category inline */}
                {adding && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#c8a96e]/20 bg-[#111] p-4">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            placeholder="Category name..."
                            autoFocus
                            className="flex-1 rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2
                                text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={saving || !newName.trim()}
                            className="rounded-lg bg-[#c8a96e] p-2 text-[#0a0a0a] transition-colors hover:bg-[#e0c992] disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setAdding(false);
                                setNewName('');
                            }}
                            className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0]"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Categories List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] py-20 text-[#666]">
                        <FolderOpen className="mb-3 h-10 w-10 text-[#333]" />
                        <p className="text-sm">No categories yet</p>
                        <p className="mt-1 text-xs text-[#555]">
                            Click &quot;New Category&quot; to add one.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {categories.map((cat, index) => (
                            <div
                                key={cat.id}
                                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111] p-4
                                    transition-all duration-200 hover:border-white/[0.1]"
                            >
                                {/* Drag Handle / Reorder */}
                                <div className="flex flex-col gap-0.5">
                                    <button
                                        onClick={() => handleReorder(index, 'up')}
                                        disabled={index === 0}
                                        className="rounded p-0.5 text-[#444] transition-colors hover:text-[#a0a0a0] disabled:opacity-30"
                                    >
                                        <ArrowUp className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={() => handleReorder(index, 'down')}
                                        disabled={index === categories.length - 1}
                                        className="rounded p-0.5 text-[#444] transition-colors hover:text-[#a0a0a0] disabled:opacity-30"
                                    >
                                        <ArrowDown className="h-3 w-3" />
                                    </button>
                                </div>

                                <GripVertical className="h-4 w-4 shrink-0 text-[#333]" />

                                {/* Name or Edit Input */}
                                {editingId === cat.id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                        autoFocus
                                        className="flex-1 rounded-lg border border-white/[0.06] bg-[#141414] px-3 py-1.5
                                            text-sm text-[#f5f5f5] outline-none
                                            focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                                    />
                                ) : (
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#f5f5f5]">
                                            {cat.name}
                                        </p>
                                        <p className="text-xs text-[#555]">/{cat.slug}</p>
                                    </div>
                                )}

                                {/* Order badge */}
                                <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-xs text-[#555]">
                                    #{index + 1}
                                </span>

                                {/* Actions */}
                                {editingId === cat.id ? (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={handleSaveEdit}
                                            disabled={saving}
                                            className="rounded-lg p-2 text-emerald-400 transition-colors hover:bg-emerald-500/10"
                                        >
                                            {saving ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04]"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : deletingId === cat.id ? (
                                    <div className="flex items-center gap-1 overflow-hidden">
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            disabled={saving}
                                            className="flex animate-in slide-in-from-right-2 duration-200 items-center justify-center rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10"
                                            title="Confirm Delete"
                                        >
                                            {saving ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(null)}
                                            disabled={saving}
                                            className="flex animate-in slide-in-from-right-4 duration-200 items-center justify-center rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04]"
                                            title="Cancel"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="rounded-lg p-2 text-[#555] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0]"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingId(cat.id)}
                                            className="rounded-lg p-2 text-[#555] transition-colors hover:bg-red-500/10 hover:text-red-400 focus:outline-none"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
