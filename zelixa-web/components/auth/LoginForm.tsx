'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth.service';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const res = await authService.login(values);
      handleLoginSuccess(res);
    } catch (err: any) {
      handleLoginError(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginSuccess = (res: any) => {
    if (res.roles.includes('ROLE_ADMIN')) {
      router.push('/admin');
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get('next');
      router.push(next || '/');
    }
  };

  const handleLoginError = (err: any) => {
    const errorMessage = err?.response?.data?.message || err.message || 'Authentication failed. Please try again.';
    toast({
      title: 'Authentication Error',
      description: errorMessage,
      variant: 'destructive',
    });
  };

  const handleRequestOtp = async () => {
    if (!phoneNumber) {
      toast({ title: 'Error', description: 'Please enter your phone number', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await authService.requestOtp(phoneNumber);
      setOtpSent(true);
      toast({ title: 'OTP Sent', description: 'Please check your WhatsApp' });
    } catch (err: any) {
      handleLoginError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      toast({ title: 'Error', description: 'Please enter the OTP code', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const res = await authService.loginWithOtp(phoneNumber, otpCode);
      handleLoginSuccess(res);
    } catch (err: any) {
      handleLoginError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-background/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</h1>
        <p className="text-sm text-slate-400 mt-1">Login to your zelixa account</p>
      </div>

      <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl mb-6">
        <button
          onClick={() => setMode('EMAIL')}
          className={cn(
            "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
            mode === 'EMAIL' ? "bg-white dark:bg-slate-800 shadow-sm text-pink-500" : "text-slate-400"
          )}
        >
          Email
        </button>
        <button
          onClick={() => setMode('WHATSAPP')}
          className={cn(
            "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all",
            mode === 'WHATSAPP' ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-500" : "text-slate-400"
          )}
        >
          WhatsApp
        </button>
      </div>

      {mode === 'EMAIL' ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                      <Input
                        placeholder="you@example.com"
                        className="pl-11 h-12 rounded-2xl border border-slate-100 focus:ring-1 focus:ring-pink-100 transition-all font-medium"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-bold text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-pink-500 transition-colors" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-11 h-12 rounded-2xl border border-slate-100 focus:ring-1 focus:ring-pink-100 transition-all font-medium"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-bold text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-3xl font-bold uppercase tracking-wide text-sm shadow-md shadow-pink-100 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+</span>
              <Input
                placeholder="628123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-8 h-12 rounded-2xl border border-slate-100 focus:ring-1 focus:ring-emerald-100 transition-all font-medium"
                disabled={isLoading || otpSent}
              />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">OTP Code</label>
              <Input
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="h-12 text-center text-2xl font-bold tracking-[0.5em] rounded-2xl border border-slate-100 focus:ring-1 focus:ring-emerald-100 transition-all"
                disabled={isLoading}
              />
            </div>
          )}

          {!otpSent ? (
            <Button
              onClick={handleRequestOtp}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-bold uppercase tracking-wide text-sm shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send OTP via WhatsApp'}
            </Button>
          ) : (
            <Button
              onClick={handleVerifyOtp}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-bold uppercase tracking-wide text-sm shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Sign In'}
            </Button>
          )}

          {otpSent && (
            <button
              onClick={() => setOtpSent(false)}
              className="w-full text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-pink-500 transition-colors"
            >
              Change phone number
            </button>
          )}
        </div>
      )}

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Social Access</span>
        <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-14 flex items-center justify-center gap-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-white/5 transition duration-200 active:scale-95"
        onClick={() => (window.location.href = 'http://localhost:8081/oauth2/authorization/keycloak?kc_idp_hint=google')}
        disabled={isLoading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
          <path fill="#1976D2" d="M43.611 20.083A19.925 19.925 0 0 0 44 14c0-6.627-5.373-12-12-12c-3.059 0-5.842 1.154-7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c16.318 0 23.945 13.917 23.945 13.917C43.611 20.083 43.611 20.083 43.611 20.083z" opacity=".05" />
          <path fill="#1976D2" d="M43.611 20.083A19.925 19.925 0 0 0 44 14c0-6.627-5.373-12-12-12c-3.059 0-5.842 1.154-7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c16.318 0 23.945 13.917 23.945 13.917C43.611 20.083 43.611 20.083 43.611 20.083z" opacity=".07" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C40.738 35.562 44 30.174 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
        Sign in with Google
      </Button>

      <p className="text-center mt-6 text-xs font-bold text-slate-400">
        New here?{' '}
        <Link
          href="/register"
          className="text-pink-500 hover:text-pink-600 uppercase tracking-widest font-bold"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
