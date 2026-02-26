'use client';

import AuthGuard from '@/components/admin/AuthGuard';
import Sidebar from '@/components/admin/Sidebar';
import { useAdminStore } from '@/store/adminStore';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { sidebarCollapsed } = useAdminStore();

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-[#0a0a0a]">
                <Sidebar />
                <main
                    className={`flex-1 transition-all duration-300 ${
                        sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
                    }`}
                >
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
