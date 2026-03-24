import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('shekza_token')?.value;
  const role = request.cookies.get('shekza_role')?.value;
  const { pathname } = request.nextUrl;

  // 1. Handle Admin Routes (/admin/**)
  if (pathname.startsWith('/admin')) {
    // Skip protection for login if it exists inside /admin (though we redirect it below)
    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== 'ROLE_ADMIN') {
      // User is logged in but NOT an admin, kick back to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 2. Handle User Routes (Storefront) - If admin, kick to /admin
  // We exclude common public paths and system paths
  const isPublicPath = 
    pathname === '/' ||
    pathname.startsWith('/products') || 
    pathname.startsWith('/categories') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  if (isPublicPath && role === 'ROLE_ADMIN' && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
     // Admin is trying to access storefront, kick to dashboard as requested: "admin ga boleh ke user"
     // But we should allow them to stay on /admin if they are already there (handled by startsWith above)
     // This block handles when they visit "/", "/products", etc.
     if (!pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin', request.url));
     }
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
