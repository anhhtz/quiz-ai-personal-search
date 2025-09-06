import { ObjectStatus } from "@/types/enums";
import { prisma } from "@/utils/db";


/**
 * @param email
 * @param sub : Auth0ProviderSid
 */

// export const exists = async (email: string, sub: string) => {
//     return await prisma.$exists.telegramUsers({
//         where: {
//             AgribankMail: email, Auth0ProviderSid: sub
//         },
//         select: {
//             // Sid: true,
//             Fullname: true,
//             BranchCode: true,
//             AgribankMail: true,
//             AgribankAdminMail: true,
//             MobilePhone: true,

//         }
//     })
// }

// export const getByEmailAndSub = async (email: string, sub: string) => {
//     return await prisma.TelegramUsers.findFirst({
//         where: {
//             AgribankMail: email, Auth0ProviderSid: sub
//         },
//         select: {
//             Sid: true,
//             Fullname: true,
//             BranchCode: true,
//             AgribankMail: true,
//             AgribankAdminMail: true,
//             MobilePhone: true,
//             Status: true
//         }
//     })
// }

export const getUserAuthProviderSidBySub = async (sub: string, providerName: string = 'auth0') => {
    return await prisma.userLoginInfos.findFirst({
        where: {
            ProviderUserId: sub,
            LoginProvider: 1,
            ObjectStatus: 1
        },
        select: {
            UserSid: true,
            // User:true
        }
    })
}

export const getUserByEmailAndSub = async (email: string, sub: string) => {
    const userAuth = await getUserAuthProviderSidBySub(sub, 'auth0');

    if (!userAuth || !userAuth.UserSid) {
        return null;
    }
    // has userAuth here

    const user = await prisma.users.findFirst({
        where: {
            Sid: userAuth.UserSid,
            Email: email,
            ObjectStatus: ObjectStatus.ReadyToUse
        },
        select: {
            Sid: true,
            Email: true,
            Fullname: true,
        }
    });

    return user;
}