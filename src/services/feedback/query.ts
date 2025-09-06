import { Feedback } from "@/types/supports/feedback";
import { ApiResponse } from "@/utils/apis/api-response";
import { useQuery } from '@tanstack/react-query';
import ky from "ky";

const getFeedbacks = async () => {
    return await ky.get('/api/feedbacks')
        .json<ApiResponse<Feedback[]>>()
}

export const useGetFeedbacks = () => {
    return useQuery({
        queryKey: ['feedbacks'],
        queryFn: () => getFeedbacks(),
        enabled: true,
        refetchOnWindowFocus: true, // Enable refetch on window focus
        refetchOnMount: true, // Enable refetch on component mount
    });
};

export const useGetFeedback = (id: string) => {
    return useQuery({
        queryKey: ['feedback', id],
        queryFn: async () => {
            const response = await ky.get(`/api/feedbacks/${id}`, { throwHttpErrors: false }).json<ApiResponse<Feedback>>()
            if (!response.success) {
                throw new Error('Failed to fetch feedback details')
            }
            return response.data
        },
        enabled: !!id
    })
};

export const useGetFeedbackComments = (id: string) => {
    return useQuery({
        queryKey: ['feedback', id, 'comments'],
        queryFn: async () => {
            return await ky.get(`/api/feedbacks/${id}/comments`, { throwHttpErrors: false }).json<ApiResponse<Feedback[]>>()
        },
        enabled: !!id
    })
};