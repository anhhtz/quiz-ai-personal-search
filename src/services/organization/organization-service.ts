import { prisma } from "@/lib/prisma";
import { ObjectStatus } from "@/types/enums";
import { Prisma } from "@prisma/client";

export const OrganizationService = {
    async getOrganizations({
        search = "",
        page = 1,
        limit = 10,
        sortBy = "CreatedOn",
        sortOrder = "desc",
    }) {
        const skip = (page - 1) * limit;

        const where: Prisma.OrganizationsWhereInput = {
            ObjectStatus: 1,
            OR: [
                { BranchCode: { contains: search, mode: "insensitive" } },
                { BranchName: { contains: search, mode: "insensitive" } },
            ],
        };

        const [organizations, total] = await Promise.all([
            prisma.organizations.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.organizations.count({ where }),
        ]);

        return {
            organizations,
            total,
            page,
            limit,
        };
    },

    async getOrganizationById(id: string) {
        return prisma.organizations.findFirst({
            where: {
                Sid: id,
                ObjectStatus: 1,
            },
        });
    },

    async createOrganization(data: any) {
        return prisma.organizations.create({
            data: {
                ...data,
                Sid: crypto.randomUUID(),
                ObjectStatus: ObjectStatus.ReadyToUse,
                CreatedOn: new Date(),
                UpdatedAt: new Date(),
            },
        });
    },

    async updateOrganization(id: string, data: any) {
        return prisma.organizations.update({
            where: { Sid: id },
            data: {
                ...data,
                UpdatedAt: new Date(),
            },
        });
    },

    async deleteOrganization(id: string) {
        return prisma.organizations.update({
            where: { Sid: id },
            data: {
                ObjectStatus: 0,
                UpdatedAt: new Date(),
            },
        });
    },
};