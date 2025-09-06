import { UserQuizDetails, UserQuizInformation } from "@/types/api-mappings";
import { ApiResponse } from "@/utils/apis/api-response";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";


//====================
//   QUIZ Details
//====================
/**
 *
 * @param code
 * @returns
 */
const getQuizDetails = async (code: string) => {
    const response = await ky.post(`/api/quizzes/details`,
        { json: { action: 'get_quiz_details', quizCode: code } }
    ).json<{ data: UserQuizDetails }>();

    return response.data;
};

export const useGetQuizDetails = (code: string) => {
    return useQuery({
        queryKey: ['quizDetails'],
        queryFn: () => getQuizDetails(code),
        enabled: !!code,
    });
};
//====================
//   QUIZ Information
//====================
/**
 *
 * @param code
 * @returns
 */
const getQuizInformation = async (code: string) => {
    // try {
    const response = await ky.post(`/api/quizzes/details`,
        {
            json: { action: 'get_quiz_details', quizCode: code },
            throwHttpErrors: false, // Add this to handle HTTP errors as responses
        }).json<ApiResponse<UserQuizInformation>>();

    return response//.success ? response.data : response.error;
    // }
    // catch (error) {
    //     // Ném lại lỗi để react-query xử lý
    //     throw error instanceof Error ? error : new Error('An unexpected error occurred');
    // }
};

export const useGetQuizInformation = (code: string) => {
    return useQuery({
        queryKey: ['quizInfo', code],
        queryFn: () => getQuizInformation(code),
        enabled: !!code,
        staleTime: 1000 * 60 * 60, // Data is considered fresh for 1 hour
        gcTime: 1000 * 60 * 60 * 24, // Cache is kept for 24 hours
        refetchOnWindowFocus: true, // Enable refetch on window focus
        refetchOnMount: true, // Enable refetch on component mount
        // retry: 1, // Only retry once on failure
        // throwOnError: true, // Throw error on failure
    });
};

/**------------------------
 * /quiz => Hottest quizzes
 ------------------------*/
// const getHottestQuizList = async () => {
//     const response = await ky.post('/api/quiz', { json: { action: 'get_hottest' } }).json<{ data: QuizTest[] }>();
//     return response.data;
// };

// export const useGetHottestQuizList = () => {
//     return useQuery({
//         queryKey: ['HottestQuizList'],
//         queryFn: () => getHottestQuizList(),
//         // enabled: true
//     });
// };

/**
 * User Quiz/QA Histories
 */
// const getUserQuizHistoryCount = async (userSid: string, quizSid: string) => {
//  return await ky.post('/api/quiz', { json: { action: 'get_user_history_count', userSid, quizSid } }).json<{ data: number }>();    
// } 