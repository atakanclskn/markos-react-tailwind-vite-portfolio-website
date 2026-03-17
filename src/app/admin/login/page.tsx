'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { logAuditAction } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import GoogleButton from '@/components/admin/GoogleButton';
import { useWebHaptics } from 'web-haptics/react';

export default function LoginPage() {
    const { trigger } = useWebHaptics();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await logAuditAction('LOGIN', 'Admin Accessed Panel', 'User successfully authenticated and entered the dashboard.', email);
            router.replace('/admin');
        } catch (err: unknown) {
            const firebaseError = err as { code?: string };
            if (
                firebaseError.code === 'auth/user-not-found' ||
                firebaseError.code === 'auth/wrong-password' ||
                firebaseError.code === 'auth/invalid-credential'
            ) {
                setError('Invalid email or password.');
            } else if (firebaseError.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            // Trigger haptic feedback for mobile devices
            trigger("error");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Optional: you can check against an array of emails if you have multiple admins
            const allowedEmails = [
                'atakanclskn@outlook.com',
                'calskanatakan55@gmail.com',
                'atakadkfkf@gmail.com',
                process.env.NEXT_PUBLIC_ADMIN_EMAIL
            ].map(e => e?.toLowerCase());

            if (user.email && !allowedEmails.includes(user.email.toLowerCase())) {
                await signOut(auth); // Immediately sign them back out
                setError('This Google account is not authorized to access the admin panel.');
                trigger("error");
                setGoogleLoading(false);
                return;
            }

            await logAuditAction('LOGIN', 'Admin Accessed Panel via Google', 'User successfully authenticated with Google.', user.email || 'unknown');
            router.replace('/admin');
        } catch (err: unknown) {
            const firebaseError = err as { code?: string, message?: string };
            if (firebaseError.code === 'auth/popup-closed-by-user') {
                setError('Google sign-in was cancelled.');
            } else if (firebaseError.code === 'auth/popup-blocked') {
                setError('Google sign-in popup was blocked by the browser.');
            } else {
                setError(firebaseError.message || 'An unexpected error occurred during Google sign-in.');
            }
            trigger("error");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-10 flex flex-col items-center gap-3">
                    <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-brand) 15%, transparent)' }}
                    >
                        <span
                            className="text-3xl leading-none"
                            style={{ fontFamily: 'var(--font-monoton)', color: 'var(--color-brand)' }}
                        >
                            M
                        </span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-[#f5f5f5]">Markos Studio</h1>
                        <p className="mt-1 text-sm text-[#666]">Sign in to admin panel</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-sm text-[#a0a0a0]">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@markos.studio"
                            required
                            className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm text-[#a0a0a0]">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-white/[0.06] bg-[#141414] px-4 py-2.5
                                    pr-10 text-sm text-[#f5f5f5] placeholder-[#444] outline-none
                                    transition-colors focus:border-[#c8a96e]/40 focus:ring-1 focus:ring-[#c8a96e]/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#a0a0a0]"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#c8a96e] px-4 py-2.5
                            text-sm font-medium text-[#0a0a0a] transition-all duration-200
                            hover:bg-[#e0c992] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>

                    <div className="relative flex items-center py-2 text-sm text-[#666]">
                        <div className="flex-grow border-t border-white/[0.06]"></div>
                        <span className="shrink-0 px-4">or</span>
                        <div className="flex-grow border-t border-white/[0.06]"></div>
                    </div>

                    <GoogleButton
                        text={googleLoading ? "Signing in..." : "Sign in with Google"}
                        onClick={handleGoogleSignIn}
                        disabled={loading || googleLoading}
                    />
                </form>
            </div>
        </div>
    );
}
