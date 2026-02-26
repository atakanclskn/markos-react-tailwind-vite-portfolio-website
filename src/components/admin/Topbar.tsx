'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, Menu } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface TopbarProps {
    title: string;
    actions?: React.ReactNode;
}

export default function Topbar({ title, actions }: TopbarProps) {
    const router = useRouter();
    const { setMobileSidebarOpen } = useAdminStore();

    const handleLogout = async () => {
        await signOut(auth);
        router.replace('/admin/login');
    };

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/80 px-4 backdrop-blur-xl sm:h-16 sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMobileSidebarOpen(true)}
                    className="rounded-lg p-2 text-[#666] transition-colors hover:bg-white/[0.04] hover:text-[#a0a0a0] lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h2 className="text-base font-semibold text-[#f5f5f5] sm:text-lg">{title}</h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {actions}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-2.5 py-1.5
                        text-sm text-[#a0a0a0] transition-all duration-200
                        hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400
                        sm:px-3.5 sm:py-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Log Out</span>
                </button>
            </div>
        </header>
    );
}
