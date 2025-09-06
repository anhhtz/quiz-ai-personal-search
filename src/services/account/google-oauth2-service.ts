import { LoginProvider } from '@/types/enums';
/**
 * Service for Google OAuth2
 */

import { ObjectStatus } from "@/types/enums";
import { prisma } from "@/utils/db";
import { logger } from '@/utils/logger';

/**
 * 
 */
const getUserLoginInfoByProvider = async (providerUserId: string, providerUserEmail: string) => {

    return await prisma.userLoginInfos.findFirst({
        where: {
            ProviderUserId: providerUserId,
            LoginProvider: LoginProvider.Google,
            Email: providerUserEmail,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            UserSid: true,
            ProviderUserId: true,
            Email: true,
            CreatedAt: true,
            UpdatedAt: true,
            ObjectStatus: true
        }
    })
}
/**
 * 
 */
// const createNewAccount = async (user: any, account: any, profile: any) => {
//     // transaction
//     return await prisma.$transaction(async (tx) => {
//         // create new user
//         const newUser = await tx.users.create({
//             data: {
//                 Sid: crypto.randomUUID(),
//                 FirstName: profile.given_name,
//                 LastName: profile.family_name,
//                 Fullname: profile.name,
//                 Gender: 0,
//                 Birthday: new Date(Date.UTC(1980, 1, 1)),

//                 IsActive: true,
//                 IsChangePasswordAtNextLogin: false,
//                 AccessFailedCount: 0,
//                 LatestLoginDate: new Date().toISOString(),

//                 StartDate: new Date().toISOString(),
//                 EndDate: new Date(Date.UTC(9999, 1, 1)),

//                 ObjectStatus: ObjectStatus.ReadyToUse,

//                 CreatedAt: new Date().toISOString(),
//                 UpdatedAt: new Date(1900, 1, 1).toISOString(),
//             }
//         });
//         // if user created
//         if (newUser && newUser.Sid) {
//             // create user Login Info
//             const newUserLoginInfo = await tx.userLoginInfos.create({
//                 data: {
//                     Sid: crypto.randomUUID(),
//                     UserSid: newUser.Sid,
//                     LoginProvider: LoginProvider.Google,
//                     ProviderKey: 'google-oauth2',
//                     ProviderUserId: user.id,
//                     Email: user.email,

//                     ObjectStatus: ObjectStatus.ReadyToUse,
//                     CreatedBy: newUser.Sid,
//                     CreatedAt: new Date().toISOString(),
//                     UpdatedAt: new Date(1900, 1, 1).toISOString(),
//                 }
//             });
//             return { user: newUser, userLoginInfo: newUserLoginInfo };
//         }
//         return null;
//     })
// }



const getLinkedAccountUserSid = async (userSid: string) => {
    const userLoginInfo = await prisma.userLoginInfos.findFirst({
        where: {
            UserSid: userSid,
            LoginProvider: LoginProvider.Google,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            UserSid: true,
            LoginProvider: true,
            ProviderKey: true,
            ProviderUserId: true,
            Email: true
        }
    })
    const user = await prisma.users.findFirst({
        where: {
            Sid: userSid,
            IsActive: true,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            Sid: true,
            Email: true,
        }
    })
    return { userLoginInfo, user }
}

const linkGoogleToAgribank = async (userSid: string, googleUser: any) => {
    if (!googleUser?.id || !googleUser?.email || !userSid)
        throw new Error('Google account details and userSid are required')

    const userAgribank = await prisma.users.findFirst({
        where: {
            Sid: userSid,
            ObjectStatus: ObjectStatus.ReadyToUse,
            IsActive: true
        },
        select: {
            Sid: true,
            Email: true
        }
    })

    if (userAgribank && userAgribank.Sid) {
        // Check if Google account is already linked to another user
        const existingLink = await getUserLoginInfoByProvider(googleUser.id, googleUser.email);
        if (existingLink) {
            throw new Error('This Google account is already linked to another user');
        }

        return await prisma.userLoginInfos.create({
            data: {
                Sid: crypto.randomUUID(),
                UserSid: userAgribank.Sid,
                LoginProvider: LoginProvider.Google,
                ProviderKey: 'google-oauth2',
                ProviderUserId: googleUser.id,
                Email: googleUser.email,
                AccessToken: googleUser.access_token,
                ProfilePictureUrl: googleUser.picture,
                ObjectStatus: ObjectStatus.ReadyToUse,
                CreatedBy: userAgribank.Sid,
                CreatedAt: new Date().toISOString(),
                UpdatedAt: new Date(1900, 1, 1).toISOString(),
            }
        })
    }
    throw new Error('Agribank account not found or inactive');
}



const canLinkGoogleAccount = async (userSid: string, googleEmail: string) => {
    const user = await prisma.users.findFirst({
        where: {
            Sid: userSid,
            IsActive: true,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            Email: true,
            UserLoginInfos: {
                where: {
                    LoginProvider: LoginProvider.Google,
                    ObjectStatus: ObjectStatus.ReadyToUse
                }
            }
        }
    });

    if (!user) return { canLink: false, reason: 'User not found or inactive' };
    if (user.UserLoginInfos?.length > 0) return { canLink: false, reason: 'User already has a linked Google account' };

    return { canLink: true };
}


/**
 * export service
 */
export const GoogleOAuth2Service = {
    // createNewAccount,
    getUserLoginInfoByProvider,
    getLinkedAccountUserSid,
    linkGoogleToAgribank,
    canLinkGoogleAccount
}