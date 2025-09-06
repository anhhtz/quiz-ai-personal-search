import { useQuery } from "@tanstack/react-query";
import ky from "ky";

interface QuizHistoryResponse {
    data: {
        quizHistories: Array<{
            Sid: string;
            BeginAt: string;
            EndAt: string | null;
            UserQuizHistoryStatus: number;
            QuizTests?: {
                Name: string;
                Description: string;
            };
        }>;
        total: number;
    };
}

interface QuizDetailsResponse {
    data: {
        userQuizHistory: {
            Sid: string;
            BeginAt: string;
            EndAt: string | null;
            UserQuizHistoryStatus: number;
        };
        quizTest: {
            Name: string;
            Description: string;
        };
        qaHistories: Array<{
            Sid: string;
            IsCorrect: boolean;
            Questions?: {
                Content: string;
                Answers?: Array<{
                    Content: string;
                    IsCorrect: boolean;
                }>;
            };
            Answers?: {
                Content: string;
            };
        }>;
    };
}

interface QuizHistoryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const fetchQuizHistories = async (params: QuizHistoryParams = {}): Promise<QuizHistoryResponse> => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams?.set("page", params.page.toString());
    if (params.limit) searchParams?.set("limit", params.limit.toString());
    if (params.sortBy) searchParams?.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams?.set("sortOrder", params.sortOrder);

    const response = await ky
        .get(`/api/quizzes/history?${searchParams.toString()}`)
        .json<QuizHistoryResponse>();
    return response;
};

export const fetchQuizDetails = async (quizHistorySid: string): Promise<QuizDetailsResponse> => {
    const response = await ky
        .get(`/api/quizzes/history/${quizHistorySid}/details`)
        .json<QuizDetailsResponse>();
    return response;
};

export const useQuizHistories = (params: QuizHistoryParams = {}) => {
    return useQuery({
        queryKey: ["quiz-histories", params],
        queryFn: () => fetchQuizHistories(params),
    });
};

export const useQuizDetails = (quizHistorySid: string) => {
    return useQuery({
        queryKey: ["quiz-details", quizHistorySid],
        queryFn: () => fetchQuizDetails(quizHistorySid),
        enabled: !!quizHistorySid,
    });
}; 