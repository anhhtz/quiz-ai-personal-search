import { prisma } from "@/lib/prisma";
import { ObjectStatus } from "@/types/enums";

export const getUserLoginMethodsByEmail = async (email: string) => {
    if (!email) {
        throw new Error("Email is required");
    }
    return await prisma.users.findUnique({
        where: {
            Email: email,
            IsActive: true,
            ObjectStatus: ObjectStatus.ReadyToUse,
        },
        select: {
            // Users
            Sid: true,
            Fullname: true,
            FirstName: true,
            LastName: true,
            Email: true,

            // UserLoginInfos
            UserLoginInfos: {
                where: {
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
                select: {
                    LoginProvider: true,
                    ProviderKey: true,
                    ProviderUserId: true,
                    Email: true,
                }
            },
        },
    });
}   