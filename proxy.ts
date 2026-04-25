import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET)

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = path.startsWith('/dashboard');
    const isPublicAuthRoute = path === '/' ;

    // COOKIE TOKEN
    const cookie = req.cookies.get('auth_session')?.value;
    try {
        
        if (cookie) await jwtVerify(cookie, SECRET_KEY);
        if (isProtectedRoute && !cookie) return NextResponse.redirect(new URL('/', req.nextUrl));
        if (isPublicAuthRoute && cookie) return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
        
        return NextResponse.next();
    } catch (error) {
        if (isProtectedRoute) {
            const response = NextResponse.redirect(new URL('/', req.nextUrl));
            response.cookies.delete('auth_session');
            return response;
        }
        return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',],
};