import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
const AUTH_COOKIE_NAME = 'auth_token';

const PROTECTED_PATHS = ['/bookmark', '/profile', '/admin'];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path));
}

function getAuthToken(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isProtectedPath(pathname)) {
    const token = getAuthToken(request);
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    const targetUrl = `${BACKEND_URL}${pathname}`;
    const queryString = request.nextUrl.search;
    const fullUrl = `${targetUrl}${queryString}`;

    try {
      const forwardedHeaders = Object.fromEntries(request.headers.entries());
      delete forwardedHeaders['content-length'];
      delete forwardedHeaders['host'];

      let reqBody: string | undefined = undefined;
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        const text = await request.clone().text();
        if (text.length > 0) {
          reqBody = text;
        }
      }

      const response = await fetch(fullUrl, {
        method: request.method,
        headers: {
          ...forwardedHeaders,
          'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
          'x-real-ip': request.headers.get('x-real-ip') || '',
        },
        body: reqBody,
      });

      const data = await response.text();

      return new NextResponse(data, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    } catch (error) {
      console.error('Middleware fetch error:', error);
      return NextResponse.json(
        { error: 'Backend unavailable' },
        { status: 503 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/bookmark/:path*', '/profile/:path*', '/admin/:path*'],
};