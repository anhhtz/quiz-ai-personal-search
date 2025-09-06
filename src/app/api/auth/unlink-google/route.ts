import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/utils/db';
import { authOptions } from '@/utils/auth';
import { LoginProvider } from '@/types/enums';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.userLoginInfos.deleteMany({
            where: {
                UserSid: session.user.sid,
                LoginProvider: LoginProvider.Google,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error unlinking Google account:', error);
        return NextResponse.json(
            { error: 'Failed to unlink account' },
            { status: 500 }
        );
    }
}