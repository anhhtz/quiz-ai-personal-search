import { getToken } from 'next-auth/jwt';
import { NextRequest } from "next/server";
import { logger } from '../utils/logger';
import getClientIP from './ip';

/**
 * {
  name: 'anhhoangtuan2',
  email: 'anhhoangtuan2@agribank.com.vn',
  picture: 'https://s.gravatar.com/avatar/e4d0624146edf509671bc7e8e5a33273?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fan.png',
  sub: 'email|6565ebbbda79a6a0a952dd30',
  iat: 1704895745,
  exp: 1707487745,
  jti: '35e82a25-28ed-42a4-8030-6e3208342c5c'
}
 */
const secret = process.env.NEXTAUTH_SECRET
async function validateAccessToken(req: NextRequest) {

    const token = await getToken({ req, secret })

    if (!token) {
        return {
            error: {
                code: 401,
                message: 'Invalid token'
            },
            validatedToken: null,
        }

    }

    if (isTokenExpired(token)) {
        return {
            error: {
                code: 401,
                message: 'Token expired'
            },
            validatedToken: null,
        }
    }

    return {
        error: null,
        validatedToken: token
    }
}

function isTokenExpired(token: any) {
    if (!token || !token.exp) {
        // Nếu không có token hoặc không có trường exp, coi như hết hạn
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Chia cho 1000 để đổi từ miligiây sang giây

    return token.exp < currentTime;
}

export { validateAccessToken };

export const validateTokenAndGetUserSid = async (request: NextRequest) => {
    const { error, validatedToken } = await validateAccessToken(request);

    if (error) {
        return { error: true, userSid: null };
    }

    const userSid = (validatedToken?.user as { sid?: string })?.sid;

    if (!userSid) {
        logger.info(`[${getClientIP(request)}][validateTokenAndGetUserSid] Invalid token ${JSON.stringify(validatedToken)} | userSid: ${userSid}`);
        return { error: true, userSid: null };
    }

    return { error: false, userSid };
};

