import { ObjectStatus } from "@/types/enums";
import { MetaKey } from "@/types/user-metadata";
import { AppError, createDatabaseError } from "@/utils/app-error";
import { prisma } from "@/utils/db";
import { fluentLogger } from "@/utils/logger";

/**
 * Get user meta data by user Sid
 * @param userSid 
 * @returns 
 */
export const getMeta = async (userSid: string) => {
    if (!userSid) {
        throw new Error("UserSid is required");
    }
    try {
        return await prisma.userMetaDatas.findMany({
            where: {
                UserSid: userSid,
                ObjectStatus: ObjectStatus.ReadyToUse
            },
            select: {
                Sid: true,
                UserSid: true,
                Key: true,
                Value: true,
                Group: true,
                IsActive: true,
                StartDate: true,
                EndDate: true,
            }
        });
    } catch (error) {
        fluentLogger.error().message(`Error fetching user meta. UserSid: ${userSid}`).data({ userSid }).function({ name: "getUserMeta", path: "src/services/account/user-services.ts" }).log();
        if (error instanceof AppError) {
            throw error; // Re-throw known AppError
        }
        throw createDatabaseError(error);
    }
};

/**
 * Get user meta data by user Sid and Key
 * @param userSid 
 * @param key 
 * @returns 
 */
export const getMetaByKey = async (userSid: string, key: MetaKey) => {
    if (!userSid) {
        throw new Error("UserSid is required");
    }
    if (!key) {
        throw new Error("Key is required");
    }
    try {
        return await prisma.userMetaDatas.findFirst({
            where: {
                UserSid: userSid,
                Key: key,
                IsActive: true,
                ObjectStatus: ObjectStatus.ReadyToUse
            },
            select: {
                Sid: true,
                UserSid: true,
                Key: true,
                Value: true,
                Group: true,
                IsActive: true,
                StartDate: true,
                EndDate: true,
            }
        });
    } catch (error) {
        fluentLogger.error().message(`Error fetching user meta. UserSid: [${userSid}] | MetaKey: ${key}`).data({ userSid, key }).function({ name: "getUserMeta", path: "src/services/account/user-services.ts" }).log();
        if (error instanceof AppError) {
            throw error; // Re-throw known AppError
        }
        throw createDatabaseError(error);
    }
};

/**
 * Deactivate user meta by user Sid and Key
 * @param userSid 
 * @param key 
 * @returns 
 */
export const unsetMeta = async (userSid: string, key: MetaKey) => {
    if (!userSid) {
        throw new Error("UserSid is required");
    }
    if (!key) {
        throw new Error("Key is required");
    }
    try {
        return await prisma.userMetaDatas.updateMany({
            where: {
                UserSid: userSid,
                Key: key,
                IsActive: true,
                ObjectStatus: ObjectStatus.ReadyToUse
            },
            data: {
                IsActive: false,
                EndDate: new Date(),
                UpdatedAt: new Date()
            }
        });
    } catch (error) {
        fluentLogger.error().message(`Error deactivate user meta. UserSid: [${userSid}] | MetaKey: ${key}`).data({ userSid, key }).function({ name: "deactivateUserMeta", path: "src/services/account/user-services.ts" }).log();
        if (error instanceof AppError) {
            throw error; // Re-throw known AppError
        }
        throw createDatabaseError(error);
    }
};

// export const setSingleMeta = async (userSid: string, key: MetaKey, value: string, group?: string) => {
//     if (!userSid) {
//         throw new Error("UserSid is required");
//     }
//     if (!key) {
//         throw new Error("Key is required");
//     }
//     if (!value) {
//         throw new Error("Value is required");
//     }

//     try {
//         await prisma.$transaction(async (tx) => {
//             // 1. Deactivate all user meta
//             await tx.userMetaDatas.updateMany({
//                 where: {
//                     UserSid: userSid,
//                     Key: key,
//                     IsActive: true,
//                     ObjectStatus: ObjectStatus.ReadyToUse
//                 },
//                 data: {
//                     IsActive: false,
//                     EndDate: new Date(),
//                     UpdatedAt: new Date()
//                 }
//             });

//             // 2. Create new user meta
//             await tx.userMetaDatas.create({
//                 data: {
//                     UserSid: userSid,
//                     Key: key,
//                     Value: value,
//                     Group: group,
//                     IsActive: true,
//                     ObjectStatus: ObjectStatus.ReadyToUse
//                 },
//                 select: {
//                     Sid: true,
//                     UserSid: true,
//                     Key: true,
//                     Value: true,
//                     Group: true,
//                     IsActive: true,
//                     StartDate: true,
//                     EndDate: true,
//                 }
//             });
//         })

//     } catch (error) {
//         fluentLogger.error().message(`Error creating user meta. UserSid: [${userSid}] | Group: [${group}] | MetaKey: ${key} | Value: [${value}]`).data({ userSid, group, key, value }).function({ name: "createUserMeta", path: "src/services/account/user-services.ts" }).log();
//         if (error instanceof AppError) {
//             throw error; // Re-throw known AppError
//         }
//         throw createDatabaseError(error);
//     }
// };

export const addMultipleMeta = async (userSid: string, key: MetaKey, value: string, group?: string) => {
    if (!userSid) {
        throw new Error("UserSid is required");
    }
    if (!key) {
        throw new Error("Key is required");
    }
    if (!value) {
        throw new Error("Value is required");
    }
    try {
        return await prisma.userMetaDatas.create({
            data: {
                UserSid: userSid,
                Key: key,
                Value: value,
                Group: group || null,
                IsActive: true,
                ObjectStatus: ObjectStatus.ReadyToUse
            },
            select: {
                Sid: true,
                UserSid: true,
                Key: true,
                Value: true,
                Group: true,
                IsActive: true,
                StartDate: true,
                EndDate: true,
            }
        });
    } catch (error) {
        fluentLogger.error().message(`Error creating user meta. UserSid: [${userSid}] | Group: [${group}] | MetaKey: [${key}] | Value: [${value}]`).data({ userSid, group, key, value }).function({ name: "createUserMeta", path: "src/services/account/user-services.ts" }).log();
        if (error instanceof AppError) {
            throw error; // Re-throw known AppError
        }
    }
}