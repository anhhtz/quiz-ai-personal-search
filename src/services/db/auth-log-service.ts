/**
 * auth-log service
 * Ghi log auth* vào schema LOG
 */
import { prisma } from "@/utils/db";

export const writeLoginLog = async (auth0EventString: any) => {
    const auth0EventObject = JSON.parse(auth0EventString)

    const accountName = auth0EventObject.user?.email || '';
    const userRefSid = auth0EventObject.user?.user_id || '';
    const clientIP = auth0EventObject.request?.ip || '';

    // update Staging.Users => LatestLoginDate ana LatestLoginIP
    if (accountName && userRefSid && clientIP) {
        await prisma.users.update({
            where: {
                Email: accountName // as email
            },
            data: {
                LatestLoginDate: new Date(),
                LatestLoginIP: clientIP
            }
        })
    }

    return await prisma.authenticationLogs.create({
        data: {
            Sid: crypto.randomUUID(),

            UserRefSid: userRefSid,
            UserName: accountName,
            IPAddress: clientIP,

            AuthenticationAction: 1, // Login
            AuthenticationResponse: 1, // Success
            EnvironmentSystem: auth0EventString,
            LoggedOn: new Date(),
        }
    })
}