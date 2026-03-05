'use client';

import { ChevronDown, Save, Loader2 } from 'lucide-react';

export function AccordionItem({
    title,
    isOpen,
    onToggle,
    children,
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
            >
                <span className="text-sm font-medium text-[#f5f5f5]">{title}</span>
                <ChevronDown
                    className={`h-4 w-4 text-[#666] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            {isOpen && (
                <div className="border-t border-white/[0.06] px-5 py-5">{children}</div>
            )}
        </div>
    );
}

export function InputField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm text-[#a0a0a0]">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                    text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
            />
        </div>
    );
}

export function TextAreaField({
    label,
    value,
    onChange,
    placeholder,
    rows = 6,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm text-[#a0a0a0]">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                    text-sm text-[#f5f5f5] placeholder-[#444] outline-none resize-y
                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
            />
        </div>
    );
}

export function SliderField({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
}) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="rounded-lg border border-white/[0.06] bg-[#141414] p-4">
            <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-medium text-[#f5f5f5]">{label}</label>
                <div className="flex items-center gap-1.5 rounded-md bg-[#222] px-2.5 py-1">
                    <span className="text-sm font-semibold text-[#c8a96e]">{value}</span>
                    <span className="text-xs text-[#a0a0a0]">sec</span>
                </div>
            </div>

            <div className="relative flex items-center h-6">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute z-20 w-full opacity-0 cursor-pointer h-full"
                />

                <div className="absolute z-10 w-full h-1.5 rounded-full bg-[#333] overflow-hidden pointer-events-none">
                    <div
                        className="h-full bg-[#c8a96e] transition-all duration-150 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div
                    className="absolute z-10 h-4 w-4 rounded-full bg-white shadow-md pointer-events-none transition-all duration-150 ease-out"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>

            <div className="mt-2 flex justify-between px-1">
                <span className="text-[10px] text-[#666] font-medium tracking-wide">{min}s</span>
                <span className="text-[10px] text-[#666] font-medium tracking-wide">{max}s</span>
            </div>
        </div>
    );
}

export function SaveButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
    return (
        <div className="flex justify-end pt-2">
            <button
                onClick={onClick}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#c8a96e] px-4 py-2
                    text-sm font-medium text-[#0a0a0a] transition-all duration-200
                    hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Save className="h-4 w-4" />
                )}
                <span>Save Changes</span>
            </button>
        </div>
    );
}

export function DriveIcon({ className }: { className?: string }) {
    return (
        <img
            src="https://img.icons8.com/?size=100&id=3NOIXpWW8crC&format=png&color=FFFFFF"
            alt="Google Drive"
            className={className}
        />
    );
}

export function ConfirmModal({
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
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
