'use client';

import { useState } from 'react';
import { Eye, EyeOff, Menu } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface AdminSplitViewProps {
    children: React.ReactNode; // The admin form
    preview: React.ReactNode; // The live preview component
    title?: string;
}

export default function AdminSplitView({ children, preview, title }: AdminSplitViewProps) {
    const [showPreview, setShowPreview] = useState(false);
    const { setMobileSidebarOpen } = useAdminStore();

    return (
        <div className="flex min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] w-full flex-col lg:flex-row bg-[#0a0a0a]">

            {/* Left Side: Form Controls */}
            <div className={`flex flex-col border-r border-white/[0.06] transition-all duration-300 ${showPreview ? 'hidden lg:flex lg:w-[450px] xl:w-[500px]' : 'w-full'}`}>
                {/* Fixed Sub-header for Preview Toggle */}
                <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/80 px-4 backdrop-blur-xl sm:h-16 sm:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0] lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <h2 className="text-base font-semibold text-[#f5f5f5] sm:text-lg">{title || 'Editor'}</h2>
                    </div>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-sm transition-all duration-200 sm:px-3.5 sm:py-2 ${showPreview
                            ? 'bg-[#c8a96e] text-[#0a0a0a] border-[#c8a96e]'
                            : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                            }`}
                    >
                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 lg:overflow-y-auto w-full relative">
                    {children}
                </div>
            </div>

            {/* Right Side: Live Preview Area */}
            {showPreview && (
                <div className="flex-1 flex flex-col bg-black overflow-hidden relative min-h-0">
                    <div className="absolute top-4 left-4 z-50 rounded-md bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 text-xs text-[#a0a0a0]">
                        Live Preview Mode
                    </div>
                    {/* Add a close preview button on mobile */}
                    <button
                        onClick={() => setShowPreview(false)}
                        className="lg:hidden fixed top-20 right-4 z-[60] rounded-lg bg-[#c8a96e] px-4 py-2 text-xs font-medium text-[#0a0a0a] shadow-xl"
                    >
                        Back to Editor
                    </button>
                    {/* Fake browser chrome or simple wrapper */}
                    <div className="flex-1 w-full lg:overflow-y-auto overflow-x-hidden isolate" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {preview}
                    </div>
                </div>
            )}
        </div>
    );
}
