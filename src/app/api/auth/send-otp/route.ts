import cache from '@/utils/cache';
import { prisma } from '@/utils/db';
import { logger } from '@/utils/logger';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
//
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
// Validate API key before setting it
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
    logger.error('[send-otp] SendGrid API key is not configured');
    throw new Error('SendGrid API key is not configured');
}

// Add rate limiting key to prevent abuse
const RATE_LIMIT_DURATION = 60; // 1 minute
const MAX_ATTEMPTS = 3;

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Add rate limiting check
        const rateLimitKey = `rate_limit_${email}`;
        const attempts = await cache.get(rateLimitKey) || 0;

        if (attempts >= MAX_ATTEMPTS) {
            return NextResponse.json(
                { error: 'Too many attempts. Please try again later.' },
                { status: 429 }
            );
        }

        // Increment attempt counter
        await cache.set(rateLimitKey, attempts + 1, RATE_LIMIT_DURATION);

        // Validate email domain
        if (!email.endsWith('@agribank.com.vn')) {
            return NextResponse.json({ error: 'Please use your Agribank email address' }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.users.findFirst({
            where: {
                Email: email,
                IsActive: true,
                ObjectStatus: 1
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP in cache with 5 minutes expiration
        // await cache.set(`otp_${email}`, otp);
        await cache.set(`otp_${email}`, otp, 300);

        // Send email
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: 'Link Google Account - Verification Code',
            text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
            html: `
                <div>
                    <h2>Verification Code</h2>
                    <p>Your verification code is: <strong>${otp}</strong></p>
                    <p>This code will expire in 5 minutes.</p>
                </div>
            `,
        };

        await sgMail.send(msg);
        logger.info(`OTP sent to ${email}`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        logger.error(`[send-otp] Error: ${JSON.stringify(error)}`);
        return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
    }
}