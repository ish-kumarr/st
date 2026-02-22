'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Loader2, Mail } from 'lucide-react';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage('Clinical verification complete. Redirecting to authorized sign-in...');
                setTimeout(() => router.push('/signin'), 2000);
            } else {
                setError(data.error || 'Security code validation failed');
            }
        } catch (err) {
            setError('Connection to security gateway failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resend: true }), // Backend handled this in signup logic
            });
            const data = await res.json();
            if (data.success) {
                setMessage('New security code dispatched to your clinical email.');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to dispatch security code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md space-y-12"
        >
            <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Verification</span>
                <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-foreground">
                    Enter <br />Code
                </h1>
                <p className="text-muted-foreground font-light text-lg">
                    A verification code has been sent to <span className="text-foreground font-bold">{email}</span>. Please enter it below to continue.
                </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                        <ShieldCheck className="h-4 w-4" />
                    </div>
                    <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-DIGIT CODE"
                        className="w-full bg-white border border-foreground/[0.08] rounded-none py-6 px-12 text-3xl font-black tracking-[0.5em] text-center focus:outline-none focus:border-primary transition-all placeholder:text-[10px] placeholder:tracking-widest placeholder:opacity-30"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <span>⚠️</span> {error}
                    </motion.div>
                )}

                {message && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        <span>✅</span> {message}
                    </motion.div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-16 rounded-none bg-black text-white hover:bg-primary transition-all duration-500 font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Verify Email
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="pt-8 border-t border-foreground/[0.05] flex flex-col gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex justify-between items-center w-full">
                    <span className="opacity-40">Didn't receive the code?</span>
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-primary hover:tracking-[0.4em] transition-all duration-300"
                    >
                        Resend Code
                    </button>
                </div>
                <Link href="/signup" className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Use a different email
                </Link>
            </div>
        </motion.div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
            <Header />
            <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
                <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
                    <VerifyEmailContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
