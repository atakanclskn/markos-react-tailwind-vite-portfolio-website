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
                <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0c0c0c] px-4 py-3 sm:px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="rounded-lg p-1.5 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0] lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <span className="text-sm font-medium text-[#f5f5f5]">{title || 'Editor'}</span>
                    </div>
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${showPreview
                            ? 'bg-[#c8a96e] text-[#0a0a0a]'
                            : 'bg-white/[0.06] text-[#f5f5f5] hover:bg-white/[0.1]'
                            }`}
                    >
                        {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
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
