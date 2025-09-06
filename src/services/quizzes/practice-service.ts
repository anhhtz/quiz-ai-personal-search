import { prisma } from "@/lib/prisma";
import { ObjectStatus, UserQuizHistoryStatus } from "@/types/enums";
import { ErrorCode } from "@/types/error-codes";
import { AppError, createDatabaseError, createResourceNotFoundError } from "@/utils/app-error";

export class PracticeService {
    static async getOrCreateUserQuizHistory(userSid: string, quizSid: string) {
        try {
            let userQuizHistory = await prisma.userQuizHistories.findFirst({
                where: {
                    UserSid: userSid,
                    QuizSid: quizSid,
                    UserQuizHistoryStatus: UserQuizHistoryStatus.Doing,
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
                orderBy: {
                    CreatedAt: "desc",
                },
            });

            if (!userQuizHistory) {
                userQuizHistory = await prisma.userQuizHistories.create({
                    data: {
                        Sid: crypto.randomUUID(),
                        UserSid: userSid,
                        QuizSid: quizSid,
                        BeginAt: new Date(),
                        UserQuizHistoryStatus: UserQuizHistoryStatus.Doing,
                        ObjectStatus: ObjectStatus.ReadyToUse,
                        CreatedBy: userSid,
                        CreatedAt: new Date(),
                        UpdatedBy: userSid,
                        UpdatedAt: new Date(),
                        AttemptCount: 1,
                    },
                });
            }

            return userQuizHistory;
        } catch (error) {
            throw createDatabaseError(error);
        }
    }

    static async getQuizQuestions(quizSid: string) {
        try {
            return await prisma.quizQuestions.findMany({
                where: {
                    QuizSid: quizSid,
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
                include: {
                    Questions: true,
                },
                orderBy: {
                    SortOrder: "asc",
                },
            });
        } catch (error) {
            throw createDatabaseError(error);
        }
    }

    static async getUserAnsweredQuestions(userSid: string, quizSid: string) {
        try {
            return await prisma.userQAHistories.findMany({
                where: {
                    UserSid: userSid,
                    QuizSid: quizSid,
                    IsCorrect: true,
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
                select: {
                    QuestionSid: true,
                },
            });
        } catch (error) {
            throw createDatabaseError(error);
        }
    }

    static async getQuestionAnswers(questionSid: string) {
        try {
            return await prisma.answers.findMany({
                where: {
                    QuestionSid: questionSid,
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
                orderBy: {
                    DisplayOrder: "asc",
                },
            });
        } catch (error) {
            throw createDatabaseError(error);
        }
    }

    static async getPracticeQuizData(quizCode: string, userSid: string, blockSize: number) {
        try {
            // Find the quiz by code
            const quizTest = await prisma.quizTests.findUnique({
                where: {
                    Code: quizCode,
                    ObjectStatus: ObjectStatus.ReadyToUse,
                },
            });

            if (!quizTest) {
                throw createResourceNotFoundError(`Không tìm thấy bài quiz với mã: ${quizCode}`);
            }

            // Get or create user quiz history
            const userQuizHistory = await this.getOrCreateUserQuizHistory(userSid, quizTest.Sid);

            // Get all questions for this quiz
            const quizQuestions = await this.getQuizQuestions(quizTest.Sid);

            if (!quizQuestions.length) {
                throw new AppError(
                    ErrorCode.RESOURCE_NOT_FOUND,
                    "Không tìm thấy câu hỏi nào trong bài quiz này",
                    404
                );
            }

            // Get user's answered questions
            const userAnsweredQuestions = await this.getUserAnsweredQuestions(userSid, quizTest.Sid);

            // Filter out correctly answered questions
            const answeredQuestionSids = userAnsweredQuestions.map(q => q.QuestionSid);
            const remainingQuestions = quizQuestions.filter(
                q => !answeredQuestionSids.includes(q.QuestionSid)
            );

            // Randomize the order of remaining questions
            const shuffledQuestions = remainingQuestions
                .sort(() => Math.random() - 0.5)
                .slice(0, blockSize);

            // Get question details with answers
            const questionsWithAnswers = await Promise.all(
                shuffledQuestions.map(async (quizQuestion, index) => {
                    if (!quizQuestion.QuestionSid) {
                        throw new AppError(
                            ErrorCode.INVALID_OPERATION,
                            "Câu hỏi không hợp lệ: thiếu QuestionSid",
                            400
                        );
                    }
                    const answers = await this.getQuestionAnswers(quizQuestion.QuestionSid);
                    return {
                        Sid: quizQuestion.Questions?.Sid,
                        Content: quizQuestion.Questions?.Content,
                        Source: quizQuestion.Questions?.Source,
                        SortOrder: index,
                        Answers: answers.map(answer => ({
                            Sid: answer.Sid,
                            Content: answer.Content,
                            IsCorrect: answer.IsCorrect,
                        })),
                    };
                })
            );

            return {
                quizTest: {
                    Sid: quizTest.Sid,
                    Code: quizTest.Code,
                    Name: quizTest.Name,
                    Description: quizTest.Description,
                    IsPublic: quizTest.IsPublic,
                    ThumbnailUri: quizTest.ThumbnailUri,
                    Tags: quizTest.Tags,
                    CreatedAt: quizTest.CreatedAt,
                },
                userQuizHistory: {
                    Sid: userQuizHistory.Sid,
                    UserSid: userQuizHistory.UserSid,
                    QuizSid: userQuizHistory.QuizSid,
                    BeginAt: userQuizHistory.BeginAt,
                    UserQuizHistoryStatus: userQuizHistory.UserQuizHistoryStatus,
                    TotalQA: quizQuestions.length,
                    RemainingQA: remainingQuestions.length,
                },
                QuestionsCount: quizQuestions.length,
                QAList: questionsWithAnswers,
                isFinished: remainingQuestions.length === 0,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw createDatabaseError(error);
        }
    }
}
