import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedPaths = ['/dashboard', '/admin', '/api/logs'];

function getCsp() {
  const isDev = process.env.NODE_ENV !== 'production';

  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self'";

  const connectSrc = isDev
    ? "connect-src 'self' ws: wss:"
    : "connect-src 'self'";

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    connectSrc,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
}

function withSecurityHeaders(res: NextResponse) {
  const isProd = process.env.NODE_ENV === 'production';

  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'no-referrer');
  res.headers.set('Content-Security-Policy', getCsp());

  if (isProd) {
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      const redirect = new URL('/login', req.url);
      return withSecurityHeaders(NextResponse.redirect(redirect));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET), {
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
      });
    } catch {
      const redirect = new URL('/login', req.url);
      return withSecurityHeaders(NextResponse.redirect(redirect));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
