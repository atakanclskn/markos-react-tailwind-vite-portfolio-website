'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    Eye,
    MousePointerClick,
    TrendingUp,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Topbar from '@/components/admin/Topbar';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

interface AnalyticsData {
    timeline: any[];
    topPages: any[];
    topCountries: any[];
    devices: any[];
}

const COLORS = ['#c8a96e', '#8884d8', '#82ca9d', '#ffc658'];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<'7daysAgo' | '30daysAgo' | '90daysAgo'>('30daysAgo');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/analytics?startDate=${dateRange}&endDate=today`);
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.error || 'Failed to fetch analytics');
                }

                setData(json);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [dateRange]);

    // Calculate totals for KPI cards
    const totalUsers = data?.timeline.reduce((acc, curr) => acc + curr.activeUsers, 0) || 0;
    const totalViews = data?.timeline.reduce((acc, curr) => acc + curr.pageViews, 0) || 0;
    const totalSessions = data?.timeline.reduce((acc, curr) => acc + curr.sessions, 0) || 0;
    // Average bounce rate
    const avgBounceRate = data?.timeline.length
        ? data.timeline.reduce((acc, curr) => acc + curr.bounceRate, 0) / data.timeline.length
        : 0;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-3 shadow-xl">
                    <p className="mb-2 text-xs font-medium text-[#a0a0a0]">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-[#f5f5f5] capitalize">{entry.name}:</span>
                            <span className="font-semibold text-white">{entry.value}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Topbar title="Google Analytics Dashboard" />

            <div className="p-6 space-y-6">

                {/* Header & Date Range Picker */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-[#f5f5f5]">Website Performance</h1>
                        <p className="text-sm text-[#a0a0a0]">Real-time analytics from Google Servers.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#121212] border border-white/[0.06] rounded-lg p-1">
                        {[
                            { label: '7D', value: '7daysAgo' },
                            { label: '30D', value: '30daysAgo' },
                            { label: '90D', value: '90daysAgo' },
                        ].map(range => (
                            <button
                                key={range.value}
                                onClick={() => setDateRange(range.value as any)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${dateRange === range.value
                                        ? 'bg-[#c8a96e] text-[#0a0a0a]'
                                        : 'text-[#666] hover:text-[#f5f5f5] hover:bg-white/[0.04]'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 flex flex-col items-center justify-center text-center space-y-3">
                        <AlertCircle className="h-8 w-8 text-rose-500" />
                        <div>
                            <h3 className="text-base font-medium text-rose-400">Analytics Connection Error</h3>
                            <p className="text-sm text-rose-500/80 max-w-lg mt-1">{error}</p>
                        </div>
                        <p className="text-xs text-[#a0a0a0] mt-4">
                            Ensure you have added your Google Service Account credentials to your <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> file:<br />
                            <code className="text-rose-400 block mt-2">GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY</code>
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {loading && !error && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-[#c8a96e] mb-4" />
                        <p className="text-sm text-[#a0a0a0]">Fetching dashboard data...</p>
                    </div>
                )}

                {/* Dashboard Content */}
                {!loading && !error && data && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="rounded-xl border border-white/[0.06] bg-[#121212] p-5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-full bg-[#c8a96e]/10 flex items-center justify-center">
                                        <Users className="h-5 w-5 text-[#c8a96e]" />
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                </div>
                                <p className="text-3xl font-bold text-[#f5f5f5]">{totalUsers.toLocaleString()}</p>
                                <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mt-1">Active Users</p>
                            </div>

                            <div className="rounded-xl border border-white/[0.06] bg-[#121212] p-5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Eye className="h-5 w-5 text-blue-500" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-[#f5f5f5]">{totalViews.toLocaleString()}</p>
                                <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mt-1">Page Views</p>
                            </div>

                            <div className="rounded-xl border border-white/[0.06] bg-[#121212] p-5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                        <MousePointerClick className="h-5 w-5 text-purple-500" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-[#f5f5f5]">{totalSessions.toLocaleString()}</p>
                                <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mt-1">Total Sessions</p>
                            </div>

                            <div className="rounded-xl border border-white/[0.06] bg-[#121212] p-5 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                                        <BarChart3 className="h-5 w-5 text-rose-500" />
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-[#f5f5f5]">{avgBounceRate.toFixed(1)}%</p>
                                <p className="text-xs text-[#666] uppercase tracking-wider font-semibold mt-1">Avg Bounce Rate</p>
                            </div>
                        </div>

                        {/* Main Chart */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#121212] p-6">
                            <h2 className="text-base font-semibold text-[#f5f5f5] mb-6">Traffic Audience Overview</h2>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#c8a96e" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#c8a96e" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fill: '#666', fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => {
                                                const d = new Date(val);
                                                return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                                            }}
                                        />
                                        <YAxis
                                            tick={{ fill: '#666', fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="activeUsers" name="Users" stroke="#c8a96e" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                                        <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Top Pages Table */}
                            <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#121212] overflow-hidden">
                                <div className="p-5 border-b border-white/[0.06]">
                                    <h2 className="text-base font-semibold text-[#f5f5f5]">Most Visited Pages</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-[#a0a0a0]">
                                        <thead className="bg-[#1a1a1a] text-xs uppercase text-[#666]">
                                            <tr>
                                                <th className="px-5 py-3 font-medium">Page Path</th>
                                                <th className="px-5 py-3 font-medium text-right">Views</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/[0.04]">
                                            {data.topPages.length > 0 ? (
                                                data.topPages.map((page, idx) => (
                                                    <tr key={idx} className="hover:bg-white/[0.02]">
                                                        <td className="px-5 py-3 font-mono text-xs text-[#f5f5f5]">{page.path}</td>
                                                        <td className="px-5 py-3 text-right font-medium">{page.views.toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={2} className="px-5 py-8 text-center">No data available</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Devices Doughnut */}
                            <div className="rounded-xl border border-white/[0.06] bg-[#121212] p-5 flex flex-col">
                                <h2 className="text-base font-semibold text-[#f5f5f5] mb-2">Device Categories</h2>
                                <div className="flex-1 h-[250px] relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.devices}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="users"
                                                nameKey="category"
                                            >
                                                {data.devices.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-2">
                                    {data.devices.map((device, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-[#a0a0a0]">
                                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                            <span className="capitalize">{device.category}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
}
