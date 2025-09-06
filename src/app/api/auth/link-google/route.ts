import { LoginProvider, ObjectStatus } from '@/types/enums';
import { authOptions } from '@/utils/auth';
import { prisma } from '@/utils/db';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

function getRedirectUrl(path: string, state: string, request: NextRequest): URL {
    const baseUrl = request.headers.get('x-forwarded-proto') === 'https'
        ? `https://${request.headers.get('host')}`
        : `http://${request.headers.get('host')}`;

    return new URL(`${path}?state=${state}`, baseUrl);
}

async function linkGoogleAccount(
    userSid: string,
    googleId: string,
    googleEmail: string
) {
    return prisma.userLoginInfos.create({
        data: {
            Sid: crypto.randomUUID(),
            UserSid: userSid,
            LoginProvider: LoginProvider.Google,
            ProviderKey: 'google',
            ProviderUserId: googleId,
            Email: googleEmail,
            ObjectStatus: ObjectStatus.ReadyToUse,
            CreatedBy: userSid,
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        },
    });
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.redirect(
                getRedirectUrl('/auth', '', request),
                { status: 302 }
            );
        }

        // Get Google profile from OAuth flow
        const searchParams = request.nextUrl.searchParams;
        const googleEmail = searchParams?.get('email');
        const googleId = searchParams?.get('sub');

        if (!googleEmail || !googleId) {
            return NextResponse.redirect(
                getRedirectUrl('/dashboard/profile/link', 'google_auth_failed', request),
                { status: 302 }
            );
        }

        // Link accounts
        await linkGoogleAccount(session.user.sid, googleId, googleEmail);

        return NextResponse.redirect(
            getRedirectUrl('/dashboard/profile/link', 'google_linked', request),
            { status: 302 }
        );
    } catch (error) {
        console.error('Error linking Google account:', error);
        return NextResponse.redirect(
            getRedirectUrl('/dashboard/profile/link', 'link_failed', request),
            { status: 302 }
        );
    }
}