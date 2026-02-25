'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Mail,
    FileText,
    Image,
    FolderOpen,
    Settings,
    ChevronLeft,
    ChevronRight,
    Camera,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Messages', href: '/admin/messages', icon: Mail },
    { label: 'Section Texts', href: '/admin/sections', icon: FileText },
    { label: 'Media Sync', href: '/admin/media', icon: Image },
    { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar } = useAdminStore();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`
                fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06]
                bg-[#0c0c0c] transition-all duration-300
                ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
            `}
        >
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c8a96e]/10">
                    <Camera className="h-[18px] w-[18px] text-[#c8a96e]" />
                </div>
                {!sidebarCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
                            Markos Studio
                        </h1>
                        <p className="text-[11px] text-[#666] whitespace-nowrap">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                                transition-all duration-200
                                ${active
                                    ? 'bg-[#c8a96e]/10 text-[#c8a96e]'
                                    : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                                }
                                ${sidebarCollapsed ? 'justify-center' : ''}
                            `}
                            title={sidebarCollapsed ? item.label : undefined}
                        >
                            <item.icon
                                className={`h-[18px] w-[18px] shrink-0 ${
                                    active ? 'text-[#c8a96e]' : 'text-[#666] group-hover:text-[#a0a0a0]'
                                }`}
                            />
                            {!sidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="border-t border-white/[0.06] p-3">
                <button
                    onClick={toggleSidebar}
                    className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2
                        text-sm text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0]"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
