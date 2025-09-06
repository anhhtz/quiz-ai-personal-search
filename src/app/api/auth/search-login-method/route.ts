import { verifyTurnstileToken } from "@/lib/auth/turnstile";
import { getUserLoginMethodsByEmail } from "@/services/auth/auth-service";
import { ErrorCode } from "@/types/error-codes";
import { ApiError, ApiSuccess } from "@/utils/apis/api-response";
import getClientIP from "@/utils/ip";
import { NextRequest } from "next/server";
import { z } from "zod";

const postSchema = z.object({
    email: z.string().email(),
    turnstileToken: z.string(),
});

export const POST = async (request: NextRequest) => {
    const traceId = crypto.randomUUID();
    const clientIP = getClientIP(request) || '';
    try {
        const body = await request.json();
        if (!body) {
            return ApiError.badRequest('Bad Request', ErrorCode.INVALID_PARAM, [], traceId);
        }

        const postValidation = postSchema.safeParse(body);
        if (!postValidation.success) {
            return ApiError.badRequest('Bad Request', ErrorCode.INVALID_PARAM, postValidation.error.issues, traceId);
        }

        // get email and turnstile token
        const { email, turnstileToken } = postValidation.data;

        // verify turnstile token
        const result = await verifyTurnstileToken(turnstileToken);

        if (!result) {
            return ApiError.badRequest('Bad Request. Invalid Turnstile verification', ErrorCode.INVALID_PARAM, [], traceId);
        }

        const data = await getUserLoginMethodsByEmail(email)
        //
        let user = null;
        if (data?.Fullname || data?.FirstName || data?.LastName || data?.Email) {
            user = {
                fullName: data?.Fullname,
                firstName: data?.FirstName,
                lastName: data?.LastName,
                email: data?.Email,
            }
        }
        let loginProviders = null;
        if (data?.UserLoginInfos && data?.UserLoginInfos.length > 0) {
            loginProviders = data?.UserLoginInfos.flatMap(item => item.LoginProvider);
            // loginProviders = data?.UserLoginInfos.map((item) => {
            //     return {
            //         provider: item.LoginProvider,
            //         // providerId: item.ProviderUserId,
            //         // providerUserId: item.ProviderUserId,
            //         // email: item.Email,
            //     }
            // })
        }
        const responseData = { user, loginProviders }

        return ApiSuccess.ok(responseData, 'User login methods', traceId);
    }
    catch (error) {
        return ApiError.internal('Internal server error', ErrorCode.INTERNAL_ERROR, traceId);
    }
};