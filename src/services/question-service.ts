'use server';
import { prisma } from "@/utils/db"; // Adjust the import based on your prisma setup

export const getQuestions = async (createdByUserSid: string) => {
    try {
        if (!createdByUserSid) {
            return {
                status: 'error',
                message: 'Not found',
            };
        }
        const questions = await prisma.questions.findMany({
            where: {
                CreatedBy: createdByUserSid,
                ObjectStatus: 1, // Assuming 1 means active or available
            },
            select: {
                Sid: true,
                Content: true,
                CreatedAt: true,
                CreatedBy: true,
                // This part is already perfect for fetching answers!
                Answers: {
                    select: {
                        Sid: true,
                        Content: true,
                        IsCorrect: true,
                    },
                },
                // Changed from User to Users to match the Prisma model relation name.
                Users: {
                    select: {
                        Fullname: true,
                    },
                },
            },
        });

        // Map the joined relation 'Users' to CreatedByFullName.
        const questionsWithFullName = questions.map((q) => ({
            ...q,
            CreatedByFullName: q.Users?.Fullname || null,
        }));

        return {
            status: 'success',
            data: questionsWithFullName,
        };
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
        };
    }
}; 