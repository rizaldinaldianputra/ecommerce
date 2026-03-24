'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

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

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const res = await authService.login(values);

      // Role-based redirect
      if (res.roles.includes('ROLE_ADMIN')) {
        router.push('/admin');
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const next = searchParams.get('next');
        router.push(next || '/');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Invalid credentials. Please try again.';
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-background/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</h1>
        <p className="text-sm text-slate-400 mt-1">Login to your shekza account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Email Field */}
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

          {/* Password Field */}
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

          {/* Google Login (Directly via Keycloak hint) */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-14 flex items-center justify-center gap-3 rounded-3xl border border-gray-300 bg-white text-gray-800 font-semibold text-sm shadow-sm hover:bg-gray-50 transition duration-200 active:scale-95"
            onClick={() => (window.location.href = 'http://localhost:8081/oauth2/authorization/keycloak?kc_idp_hint=google')}
            disabled={isLoading}
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </Button>


          {/* Keycloak Login */}

        </form>
      </Form>

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
