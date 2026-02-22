'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useAuth } from '@/hooks/use-auth';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, Fingerprint } from 'lucide-react';
import { toast } from 'sonner';

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (data.success) {
        signIn(data.user);
        toast.success('Successfully logged in.');
        router.push(data.user.role === 'admin' ? '/admin' : '/');
      } else {
        if (data.needsVerification) {
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } else {
          setError(data.error || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Member Login</span>
            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-foreground">
              Sign<br />In
            </h1>
            <p className="text-muted-foreground font-light text-sm uppercase tracking-widest mt-4">
              Log in to your account
            </p>
          </div>

          <motion.form
            key="password-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handlePasswordSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-white border border-foreground/[0.08] rounded-none py-5 px-12 text-xs font-bold focus:outline-none focus:border-black transition-all placeholder:text-[9px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="PASSWORD"
                  className="w-full bg-white border border-foreground/[0.08] rounded-none py-5 pl-12 pr-12 text-xs font-bold focus:outline-none focus:border-black transition-all placeholder:text-[9px] placeholder:font-black placeholder:tracking-widest placeholder:uppercase placeholder:opacity-30"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center opacity-20 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors">
                Forgot Password?
              </Link>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 border border-red-500/20 bg-red-50/50 text-red-600 text-[9px] font-black uppercase tracking-[0.2em]"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-20 rounded-none bg-black text-white hover:bg-primary transition-all duration-500 font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Log In <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </motion.form>

          <div className="pt-8 border-t border-foreground/[0.05] flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
            <span className="opacity-40">Don't have an account?</span>
            <Link href="/signup" className="text-primary hover:tracking-[0.4em] transition-all duration-300">
              Create Account
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
