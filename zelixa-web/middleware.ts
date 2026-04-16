import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('shekza_token')?.value;
  const role = request.cookies.get('shekza_role')?.value;
  const { pathname } = request.nextUrl;

  // Define system/public resource paths
  const isResource = 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('.') ||
    pathname.includes('webpack-hmr');

  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminPath = pathname.startsWith('/admin');

  // Handle HMR and other Next.js internal requests early
  if (pathname.startsWith('/_next') || pathname.includes('webpack-hmr')) {
    return NextResponse.next();
  }

  // 1. Handle Admin Role
  if (role === 'ROLE_ADMIN') {
    // Admin should only be on /admin paths. 
    // If on auth path or storefront path, kick to /admin
    if (!isAdminPath && !isResource) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 2. Handle Admin Path Protection
  if (isAdminPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'ROLE_ADMIN') {
      // Logged in as non-admin, kick to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. Handle Auth Path Protection (Logged in users shouldn't see login/register)
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL(role === 'ROLE_ADMIN' ? '/admin' : '/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
