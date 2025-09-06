/**
 * Thêm tạm để thử `ldap_credentials` trong NextAuth
 */

import { prisma } from "@/lib/prisma";
import { ObjectStatus } from "@/types/enums";
import { AppError, createDatabaseError } from "@/utils/app-error";
import { fluentLogger } from "@/utils/logger";

export const getUserByEmail = async (email: string) => {
    if (!email) {
        throw new Error("Email is required");
    }
    try {
        return await prisma.users.findFirst({
            where: {
                Email: email,
                ObjectStatus: ObjectStatus.ReadyToUse
            },
            select: {
                Sid: true,
                Email: true,
                FirstName: true,
                LastName: true,
                Fullname: true,
                Phone: true,
                AvatarUrl: true,
                IsActive: true,
            }
        });


    } catch (error) {
        fluentLogger.error().message("Error fetching user by email").log();
        if (error instanceof AppError) {
            throw error; // Re-throw known AppError
        }
        throw createDatabaseError(error);
    }
};

