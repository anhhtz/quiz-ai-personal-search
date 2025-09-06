// Example snippet: src/services/leaderboard-service.ts
import { prisma } from '@/utils/db';

export interface LeaderboardEntry {
    userId: string;
    fullName: string;
    totalQuestions: number;
    totalCorrect: number;
    accuracy: number;
    totalQuizzes: number;
    averageQuizTime?: number; // in seconds
}

/**
 * Returns the top 100 leaderboard entries sorted by:
 * 1. Total Quizzes (descending),
 * 2. Average Quiz Time (ascending, where a missing value is treated as worst),
 * 3. Total Correct (descending).
 */
export async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
    // Fetch active users with their quiz histories.
    const users = await prisma.users.findMany({
        where: { IsActive: true },
        select: {
            Sid: true,
            // Fullname: true,
            FirstName: true,
            UserQAHistories: {
                select: { IsCorrect: true },
            },
            UserQuizHistories: {
                select: { BeginAt: true, EndAt: true },
            },
        },
    });

    const leaderboard = users.map((user) => {
        const totalQuestions = user.UserQAHistories.length;
        const totalCorrect = user.UserQAHistories.filter((qa) => qa.IsCorrect).length;
        const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
        const totalQuizzes = user.UserQuizHistories.length;

        // Calculate average quiz duration (in seconds) if available.
        const quizDurations = user.UserQuizHistories
            .filter(
                (quiz) => quiz.BeginAt && quiz.EndAt && quiz.EndAt > quiz.BeginAt
            )
            .map((quiz) => (quiz.EndAt!.getTime() - quiz.BeginAt!.getTime()) / 1000);
        const averageQuizTime =
            quizDurations.length > 0
                ? quizDurations.reduce((sum, current) => sum + current, 0) / quizDurations.length
                : undefined;

        return {
            userId: user.Sid,
            fullName: user.FirstName || 'Anonymous',
            totalQuestions,
            totalCorrect,
            accuracy,
            totalQuizzes,
            averageQuizTime,
        } as LeaderboardEntry;
    });

    // Sort leaderboard by:
    // 1. Total Quizzes descending
    // 2. Average Quiz Time ascending (undefined is treated as Infinity)
    // 3. Total Correct descending
    const sortedLeaderboard = leaderboard.sort((a, b) => {
        if (b.totalQuizzes !== a.totalQuizzes) {
            return b.totalQuizzes - a.totalQuizzes;
        }

        const aAvgTime = a.averageQuizTime ?? Infinity;
        const bAvgTime = b.averageQuizTime ?? Infinity;
        if (aAvgTime !== bAvgTime) {
            return aAvgTime - bAvgTime;
        }

        return b.totalCorrect - a.totalCorrect;
    });

    // Return only top 100 results.
    return sortedLeaderboard.slice(0, 100);
}