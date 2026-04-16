'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      authService.handleOAuthSuccess(token);
      router.push('/');
      router.refresh();
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50/30">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto" />
        <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Authenticating</h2>
        <p className="text-slate-400 font-bold text-sm">Finishing the premium handshake...</p>
      </div>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    }>
      <LoginSuccessContent />
    </Suspense>
  );
}
