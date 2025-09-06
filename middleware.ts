// middleware/ip-logger.ts

import getClientIP from '@/utils/ip';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { RoleType } from './src/types/enums';

// Define allowed roles using the RoleType enum values
const ADMIN_ROLES = [RoleType.AppAdministrators, RoleType.HostAdministrators];

export async function middleware(request: NextRequest) {
    const clientIp = getClientIP(request)
    // request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') //|| request.ip;

    // if (clientIp) {
    //     const context = request.nextUrl.clone();
    //     context.searchParams.set('clientIp', clientIp);
    //     request.nextUrl = context;
    // }
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('client-ip', clientIp || '');

    // Define the paths that require admin access
    const protectedPaths = ['/admin/*', '/dashboard/blogs', '/dashboard/qms'];
    const { pathname } = request.nextUrl;
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        // Pass the secret so that the full token is returned
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req: request, secret });

        // Debug logging – remove or comment out in production
        console.debug('Token from middleware:', token);

        if (!token) {
            return NextResponse.redirect(new URL('/auth/signin', request.url));
        }

        // Extract roles from the token and normalize them to numbers
        const tokenRoles = token.roles
            ? Array.isArray(token.roles)
                ? token.roles.map((role) => Number(role))
                : [Number(token.roles)]
            : [];

        // Check if any role from the token is in the allowedRoles array
        const isAuthorized = tokenRoles.some((role) => ADMIN_ROLES.includes(role));

        if (!isAuthorized) {
            return NextResponse.redirect(new URL('/errors/unauthorized', request.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}

export const config = {
    matcher: ['/dashboard/blogs/:path*', '/admin/:path*', '/dashboard/qms/:path*'],
};