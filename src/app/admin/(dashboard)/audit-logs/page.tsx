'use client';

import { useState, useEffect } from 'react';
import { Shield, Search, Filter, Calendar } from 'lucide-react';
import { getAuditLogs } from '@/lib/firestore';
import type { AuditLog, AuditActionType } from '@/types';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<AuditActionType | 'ALL'>('ALL');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const fetchedLogs = await getAuditLogs();
                setLogs(fetchedLogs);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Formatting date
    const formatDate = (date: Date) => {
        if (!date) return 'N/A';
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    // Helper for action type color tags
    const getTypeStyles = (type: AuditActionType) => {
        switch (type) {
            case 'LOGIN': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'CREATE': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'UPDATE': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'DELETE': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'SETTINGS': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'SYSTEM': return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
            default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
        }
    };

    // Filtering logic
    const filteredLogs = logs.filter((log) => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'ALL' || log.type === selectedType;

        let matchesDate = true;
        if (dateRange.start && dateRange.end) {
            const logTime = log.timestamp.getTime();
            const startStr = new Date(dateRange.start).getTime();
            const endStr = new Date(dateRange.end).getTime() + 86400000; // Add 24h to include end day fully
            matchesDate = logTime >= startStr && logTime <= endStr;
        }

        return matchesSearch && matchesType && matchesDate;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
    const currentLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Shield className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-[#f5f5f5]">System Audit Logs</h1>
                    <p className="text-sm text-[#a0a0a0]">Traceability and security monitoring.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border border-white/[0.06] bg-[#121212]">
                {/* Type Filter */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#666] uppercase tracking-wider">Type</label>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as AuditActionType | 'ALL')}
                            className="w-full appearance-none rounded-lg border border-white/[0.06] bg-[#0c0c0c] py-2 pl-9 pr-4 text-sm text-[#f5f5f5] focus:border-[var(--color-brand)] focus:outline-none"
                        >
                            <option value="ALL">All Events</option>
                            <option value="LOGIN">Login</option>
                            <option value="CREATE">Create</option>
                            <option value="UPDATE">Update</option>
                            <option value="DELETE">Delete</option>
                            <option value="SETTINGS">Settings</option>
                        </select>
                    </div>
                </div>

                {/* Date Start */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#666] uppercase tracking-wider">Start Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="w-full rounded-lg border border-white/[0.06] bg-[#0c0c0c] py-2 pl-9 pr-4 text-sm text-[#f5f5f5] focus:border-[var(--color-brand)] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Date End */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#666] uppercase tracking-wider">End Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="w-full rounded-lg border border-white/[0.06] bg-[#0c0c0c] py-2 pl-9 pr-4 text-sm text-[#f5f5f5] focus:border-[var(--color-brand)] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#666] uppercase tracking-wider">User / Action</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]" />
                        <input
                            type="text"
                            placeholder="Search user or action..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-white/[0.06] bg-[#0c0c0c] py-2 pl-9 pr-4 text-sm text-[#f5f5f5] focus:border-[var(--color-brand)] focus:outline-none placeholder:text-[#444]"
                        />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border border-white/[0.06] bg-[#121212] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-[#a0a0a0]">
                        <thead className="bg-[#1a1a1a] text-xs uppercase text-[#666]">
                            <tr>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Action & Details</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#666]">
                                        Loading audit logs...
                                    </td>
                                </tr>
                            ) : currentLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-[#666]">
                                        No logs found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                currentLogs.map((log) => (
                                    <tr key={log.id} className="transition-colors hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-wider ${getTypeStyles(log.type)}`}>
                                                &rarr; {log.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#f5f5f5] mb-0.5">{log.action}</div>
                                            <div className="text-[11px] font-mono text-[#666] line-clamp-1">{log.details}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-white/[0.05] flex items-center justify-center">
                                                    <span className="text-[10px] font-semibold text-[#a0a0a0]">
                                                        {log.user.substring(0, 2).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-xs">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-[11px] font-mono">
                                            {formatDate(log.timestamp)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#666]">
                        <span>Showing last:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="bg-transparent text-[#f5f5f5] focus:outline-none mr-1"
                        >
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span>activities</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-[#666] hover:text-[#f5f5f5] disabled:opacity-50 transition-colors"
                        >
                            Prev
                        </button>
                        <span className="text-[#a0a0a0]">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-[#666] hover:text-[#f5f5f5] disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
