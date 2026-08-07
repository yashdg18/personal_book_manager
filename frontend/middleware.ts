import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight guard: checks whether the JWT cookie exists before the page
// even renders. This does NOT verify the token's signature/expiry — that
// happens on every API call via the backend's authMiddleware. This layer
// just avoids flashing protected UI to an obviously logged-out visitor.
const PROTECTED_PATHS = ['/dashboard', '/books'];
const AUTH_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/books/:path*', '/login', '/register'],
};
