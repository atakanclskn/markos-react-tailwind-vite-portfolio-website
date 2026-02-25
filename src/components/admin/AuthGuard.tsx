'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAdminStore } from '@/store/adminStore';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated, isAuthLoading, setAuthenticated, setAuthLoading } = useAdminStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                router.replace('/admin/login');
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [router, setAuthenticated, setAuthLoading]);

    if (isAuthLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#c8a96e]" />
                    <p className="text-sm text-[#a0a0a0]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
