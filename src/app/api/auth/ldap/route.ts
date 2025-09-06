import { ErrorCode } from "@/types/error-codes";
import { ApiError, ApiSuccess } from "@/utils/apis/api-response";
import getClientIP from "@/utils/ip";
import { authenticate } from "@/utils/ldap-auth";
import { fluentLogger } from "@/utils/logger";
import { z } from "zod";


const ldapAccountSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export const POST = async (req: Request) => {
    const traceId = crypto.randomUUID();
    const clientIP = getClientIP(req);
    let ldapAccountSchemaValidated: any = null;

    try {
        const body = await req.json();
        ldapAccountSchemaValidated = ldapAccountSchema.safeParse(body || {});

        if (!ldapAccountSchemaValidated.success) {
            fluentLogger.error().message('Invalid request body').identify({ ip: clientIP }).data({ body, error: ldapAccountSchemaValidated.error }).service({ type: 'api', name: 'auth/ldap', method: 'POST' }).function({ name: 'POST', path: 'src/app/api/auth/ldap/route.ts' }).trace({ id: traceId }).log();

            return ApiError.validation('Invalid request body', ldapAccountSchemaValidated.error.flatten(), traceId);
        }
        const { username, password } = ldapAccountSchemaValidated.data;
        const ldapAccount = await authenticate(username, password);

        if (ldapAccount) {
            fluentLogger.info().identify({ ip: clientIP, username }).message('LDAP authentication successful').data({ username, ldapAccount }).service({ type: 'api', name: 'auth/ldap', method: 'POST' }).function({ name: 'POST', path: 'src/app/api/auth/ldap/route.ts' }).trace({ id: traceId }).log();

            return ApiSuccess.ok(ldapAccount, 'Retrieved LDAP account', traceId);

        } else {
            fluentLogger.error().identify({ ip: clientIP, username }).message('LDAP account not found').data({ username }).service({ type: 'api', name: 'auth/ldap', method: 'POST' }).function({ name: 'POST', path: 'src/app/api/auth/ldap/route.ts' }).trace({ id: traceId }).log();

            return ApiError.notFound('LDAP account not found', ErrorCode.USER_NOT_FOUND, traceId);
        }
    }
    catch (error) {
        fluentLogger.error().identify({ ip: clientIP }).message('[EXCEPTION] LDAP authentication failed').data({ error, ldapAccountSchemaValidated }).service({ type: 'api', name: 'auth/ldap', method: 'POST' }).function({ name: 'POST', path: 'src/app/api/auth/ldap/route.ts' }).trace({ id: traceId }).log();

        return ApiError.internal('Invalid request body', ErrorCode.INTERNAL_ERROR, traceId);
    }

}