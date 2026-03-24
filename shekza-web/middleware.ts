import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {

    // Redirect /admin/login to the main /login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check for our custom JWT cookie
    const token = request.cookies.get('shekza_token');

    if (!token) {
      // No token found, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
};
