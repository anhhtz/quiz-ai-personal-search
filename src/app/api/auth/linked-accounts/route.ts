import { LoginProvider, ObjectStatus } from '@/types/enums';
import { prisma } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams?.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const linkedAccount = await prisma.userLoginInfos.findFirst({
            where: {
                UserSid: userId,
                LoginProvider: LoginProvider.Google,
                ObjectStatus: ObjectStatus.ReadyToUse,
            },
        });

        return NextResponse.json({
            googleAccount: linkedAccount?.Email,
            hasGoogleLinked: !!linkedAccount,
        });
    } catch (error) {
        console.error('Error checking linked accounts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}