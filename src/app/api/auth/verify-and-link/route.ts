import { GoogleOAuth2Service } from '@/services/account/google-oauth2-service';
import cache from '@/utils/cache';
import { prisma } from '@/utils/db';
import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Validate session
        // const session = await getServerSession(authOptions);
        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        const { agribankEmail, otp, googleEmail, googleId } = await req.json();

        // Validate required fields
        if (!agribankEmail || !otp || !googleEmail || !googleId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate email format
        if (!agribankEmail.endsWith('@agribank.com.vn')) {
            return NextResponse.json({ error: 'Invalid Agribank email format' }, { status: 400 });
        }

        // Check OTP attempts
        const attempts = await cache.get(`otp_attempts_${agribankEmail}`) || 0;
        if (attempts >= 3) {
            return NextResponse.json({ error: 'Too many attempts. Please request a new code' }, { status: 429 });
        }

        // Get stored OTP
        const storedOtp = await cache.get(`otp_${agribankEmail}`);
        if (!storedOtp) {
            return NextResponse.json({ error: 'Verification code expired' }, { status: 400 });
        }

        if (otp !== storedOtp) {
            await cache.set(`otp_attempts_${agribankEmail}`, attempts + 1, 300);
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        // Check if Google account is already linked
        const existingLink = await GoogleOAuth2Service.getUserLoginInfoByProvider(googleId, googleEmail);
        if (existingLink) {
            return NextResponse.json({ error: 'This Google account is already linked to another user' }, { status: 400 });
        }

        // Get user
        const user = await prisma.users.findFirst({
            where: {
                Email: agribankEmail,
                IsActive: true,
                ObjectStatus: 1
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Link accounts
        await GoogleOAuth2Service.linkGoogleToAgribank(user.Sid, {
            id: googleId,
            email: googleEmail
        });

        // Clear OTP and attempts
        await cache.remove(`otp_${agribankEmail}`);
        await cache.remove(`otp_attempts_${agribankEmail}`);

        logger.info(`Successfully linked Google account ${googleEmail} to Agribank account ${agribankEmail}`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        logger.error(`[verify-and-link] Error: ${error.message}`);
        return NextResponse.json({ error: 'Failed to verify and link account' }, { status: 500 });
    }
}