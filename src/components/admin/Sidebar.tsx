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
    X,
    User,
    PlaySquare,
    Smartphone,
    MonitorPlay,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

const NAV_GROUPS = [
    {
        title: 'Sections',
        items: [
            { label: 'Preloader (Intro)', href: '/admin/sections/preloader', icon: PlaySquare },
            { label: 'Hero Area', href: '/admin/sections/hero', icon: MonitorPlay },
            { label: 'About (Founder)', href: '/admin/sections/founder', icon: User },
            { label: 'Contact Section', href: '/admin/sections/contact', icon: Smartphone },
        ],
    },
    {
        title: 'Media',
        items: [
            { label: 'Media Sync', href: '/admin/media', icon: Image },
            { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
        ],
    },
    {
        title: 'Global',
        items: [
            { label: 'Messages', href: '/admin/messages', icon: Mail },
            { label: 'Legal Policies', href: '/admin/legal', icon: FileText },
            { label: 'Settings', href: '/admin/settings', icon: Settings },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen } = useAdminStore();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-5">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-brand) 15%, transparent)' }}
                    >
                        <span
                            className="text-xl leading-none"
                            style={{ fontFamily: 'var(--font-monoton)', color: 'var(--color-brand)' }}
                        >
                            M
                        </span>
                    </div>
                    {(!sidebarCollapsed || mobileSidebarOpen) && (
                        <div className="overflow-hidden">
                            <h1 className="text-sm font-semibold text-[#f5f5f5] whitespace-nowrap">
                                Markos Studio
                            </h1>
                            <p className="text-[11px] text-[#666] whitespace-nowrap">Admin Panel</p>
                        </div>
                    )}
                </div>
                {/* Mobile close button */}
                <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="rounded-lg p-1.5 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0] lg:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
                {/* Core Dashboard Link */}
                <div className="space-y-1">
                    <Link
                        href="/admin"
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`
                            group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                            transition-all duration-200
                            ${pathname === '/admin'
                                ? ''
                                : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                            }
                            ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center' : ''}
                        `}
                        style={pathname === '/admin' ? {
                            color: 'var(--color-brand)',
                            backgroundColor: 'color-mix(in srgb, var(--color-brand) 10%, transparent)'
                        } : {}}
                        title={sidebarCollapsed && !mobileSidebarOpen ? 'Dashboard' : undefined}
                    >
                        <LayoutDashboard
                            className={`h-[18px] w-[18px] shrink-0 transition-colors ${pathname === '/admin' ? '' : 'text-[#666] group-hover:text-[#a0a0a0]'}`}
                            style={pathname === '/admin' ? { color: 'var(--color-brand)' } : {}}
                        />
                        {(!sidebarCollapsed || mobileSidebarOpen) && <span>Dashboard</span>}
                    </Link>
                </div>

                {NAV_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {(!sidebarCollapsed || mobileSidebarOpen) && (
                            <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-[#444] mb-2 mt-4">
                                {group.title}
                            </h2>
                        )}
                        {group.items.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className={`
                                        group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                                        transition-all duration-200
                                        ${active
                                            ? ''
                                            : 'text-[#a0a0a0] hover:bg-white/[0.04] hover:text-[#f5f5f5]'
                                        }
                                        ${sidebarCollapsed && !mobileSidebarOpen ? 'justify-center' : ''}
                                    `}
                                    style={active ? {
                                        color: 'var(--color-brand)',
                                        backgroundColor: 'color-mix(in srgb, var(--color-brand) 10%, transparent)'
                                    } : {}}
                                    title={sidebarCollapsed && !mobileSidebarOpen ? item.label : undefined}
                                >
                                    <item.icon
                                        className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? '' : 'text-[#666] group-hover:text-[#a0a0a0]'}`}
                                        style={active ? { color: 'var(--color-brand)' } : {}}
                                    />
                                    {(!sidebarCollapsed || mobileSidebarOpen) && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle (desktop only) */}
            <div className="hidden border-t border-white/[0.06] p-3 lg:block">
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
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/[0.06]
                    bg-[#0c0c0c] transition-all duration-300 lg:flex
                    ${sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Overlay Backdrop */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <aside
                className={`
                    fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-white/[0.06]
                    bg-[#0c0c0c] transition-transform duration-300 lg:hidden
                    ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {sidebarContent}
            </aside>
        </>
    );
}
