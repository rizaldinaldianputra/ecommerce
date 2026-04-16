'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

/**
 * Blocks admin users from accessing the storefront.
 * Works as a client-side complement to the middleware cookie check.
 * Handles cases where cookie might be set but client-side navigation bypassed middleware.
 */
export default function StorefrontAdminGuard() {
  const router = useRouter();

  useEffect(() => {
    const user = authService.getUser();
    if (user && user.roles?.includes('ROLE_ADMIN')) {
      router.replace('/admin');
    }

    // Also listen for auth changes (e.g., user logs in while on storefront)
    const handleAuthChange = () => {
      const updated = authService.getUser();
      if (updated?.roles?.includes('ROLE_ADMIN')) {
        router.replace('/admin');
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [router]);

  return null; // renders nothing
}
