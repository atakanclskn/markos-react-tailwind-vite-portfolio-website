'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/admin/Topbar';
import {
    Mail,
    MailOpen,
    Image,
    FolderOpen,
    TrendingUp,
    Loader2,
    RefreshCw,
    Shield,
} from 'lucide-react';
import {
    getCollectionCount,
    getUnreadMessageCount,
    getAuditLogs,
} from '@/lib/firestore';
import type { AuditLog } from '@/types';
import { useAdminStore } from '@/store/adminStore';

interface StatCard {
    label: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bg: string;
}

export default function DashboardPage() {
    const { stats, setStats } = useAdminStore();
    const [loading, setLoading] = useState(true);
    const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [totalMessages, unreadMessages, totalPhotos, totalCategories, logs] = await Promise.all([
                getCollectionCount('messages'),
                getUnreadMessageCount(),
                getCollectionCount('photos'),
                getCollectionCount('categories'),
                getAuditLogs(),
            ]);
            setStats({ totalMessages, unreadMessages, totalPhotos, totalCategories });
            // Show only top 5 recent logs for the dashboard widget
            setRecentLogs(logs.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cards: StatCard[] = [
        {
            label: 'Total Messages',
            value: stats.totalMessages,
            icon: Mail,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
        },
        {
            label: 'Unread Messages',
            value: stats.unreadMessages,
            icon: MailOpen,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
        },
        {
            label: 'Total Photos',
            value: stats.totalPhotos,
            icon: Image,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
        },
        {
            label: 'Active Categories',
            value: stats.totalCategories,
            icon: FolderOpen,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
        },
    ];

    return (
        <>
            <Topbar
                title="Dashboard"
                actions={
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3.5 py-2
                            text-sm text-[#a0a0a0] transition-colors hover:bg-white/[0.04] hover:text-[#f5f5f5]
                            disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                }
            />

            <div className="p-6 lg:p-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-[#f5f5f5]">Welcome back</h3>
                    <p className="mt-1 text-sm text-[#666]">
                        Here is an overview of your studio.
                    </p>
                </div>

                {/* Stats Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-[#c8a96e]" />
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => (
                            <div
                                key={card.label}
                                className="group rounded-xl border border-white/[0.06] bg-[#111] p-5
                                    transition-all duration-200 hover:border-white/[0.1] hover:bg-[#141414]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`rounded-lg ${card.bg} p-2.5`}>
                                        <card.icon className={`h-5 w-5 ${card.color}`} />
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-[#333] transition-colors group-hover:text-[#666]" />
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-bold text-[#f5f5f5]">
                                        {card.value}
                                    </p>
                                    <p className="mt-1 text-sm text-[#666]">{card.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8">
                    <h4 className="mb-4 text-sm font-medium text-[#a0a0a0]">Quick Actions</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <QuickAction
                            href="/admin/messages"
                            icon={Mail}
                            label="View Messages"
                            description="Check your inbox"
                        />
                        <QuickAction
                            href="/admin/gallery"
                            icon={Image}
                            label="Manage Gallery"
                            description="Upload or edit photos"
                        />
                        <QuickAction
                            href="/admin/audit-logs"
                            icon={Shield}
                            label="Security Logs"
                            description="Review system events"
                        />
                    </div>
                </div>

                {/* Recent Activity Widget */}
                <div className="mt-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[#a0a0a0]">Recent Activity</h4>
                        <Link href="/admin/audit-logs" className="text-xs font-medium text-[#c8a96e] hover:underline">
                            View All Logs
                        </Link>
                    </div>
                    {loading ? (
                        <div className="flex h-32 items-center justify-center rounded-xl border border-white/[0.06] bg-[#111]">
                            <Loader2 className="h-5 w-5 animate-spin text-[#c8a96e]" />
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/[0.06] bg-[#111] overflow-hidden">
                            {recentLogs.length > 0 ? (
                                <div className="divide-y divide-white/[0.04]">
                                    {recentLogs.map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02]">
                                            <div>
                                                <p className="text-sm font-medium text-[#f5f5f5]">{log.action}</p>
                                                <p className="text-xs text-[#a0a0a0] mt-0.5 line-clamp-1">{log.details}</p>
                                            </div>
                                            <div className="text-right shrink-0 ml-4">
                                                <p className="text-xs font-medium text-[#c8a96e]">{log.user}</p>
                                                <p className="text-[11px] text-[#666] mt-0.5">
                                                    {new Intl.DateTimeFormat('en-GB', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                                    }).format(log.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-sm text-[#666]">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function QuickAction({
    href,
    icon: Icon,
    label,
    description,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#111] p-4
                transition-all duration-200 hover:border-[#c8a96e]/20 hover:bg-[#141414]"
        >
            <div className="rounded-lg bg-[#c8a96e]/10 p-2.5">
                <Icon className="h-5 w-5 text-[#c8a96e]" />
            </div>
            <div>
                <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
                <p className="text-xs text-[#666]">{description}</p>
            </div>
        </Link>
    );
}
