'use client'
import { MetaData, UserAvatar, UserDetails, UserMetaData } from '@/types/api-mappings';
import { ApiResponse } from '@/utils/apis/api-response';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';

interface UsersResponse {
    status: string;
    data: {
        users: UserDetails[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export const fetchUsers = async (
    search: string,
    page: number,
    limit: number
): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
    });

    return ky.get(`/api/admin/users?${searchParams}`).json();
};

export const useUsers = (search: string, page: number, limit: number) => {
    return useQuery({
        queryKey: ['users', search, page],
        queryFn: () => fetchUsers(search, page, limit),
    });
};



export const fetchUserDetails = async (sid: string) => {
    return await ky
        .get(`/api/admin/users/details/${sid}`, { throwHttpErrors: false })
        .json<ApiResponse<UserDetails>>();


};

export const useUserDetails = (sid: string) => {
    return useQuery({
        queryKey: ["user", sid],
        queryFn: () => fetchUserDetails(sid),
        enabled: !!sid,
    });
};



export const fetchUserAvatars = async (userSid: string): Promise<UserAvatar[]> => {
    const response = await ky
        .get(`/api/admin/users/${userSid}/avatars`, { throwHttpErrors: false })
        .json<ApiResponse<UserAvatar[]>>();
    return response.data || [];
};

export const useUserAvatars = (userSid: string) => {
    return useQuery({
        queryKey: ['user-avatars', userSid],
        queryFn: () => fetchUserAvatars(userSid),
        enabled: !!userSid, // Only run the query if userSid is available
    });
};

export const uploadUserAvatar = async (userSid: string, file: File): Promise<UserAvatar> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await ky
        .post(`/api/admin/users/${userSid}/avatars`, {
            body: formData,
        })
        .json<{ data: UserAvatar }>();

    return response.data;
};

export const setUserAvatar = async (userSid: string, avatarSid: string): Promise<{ success: boolean }> => {
    const response = await ky
        .put(`/api/admin/users/${userSid}/avatar`, {
            json: { avatarSid },
        })
        .json<{ success: boolean }>();

    return response;
};

const isUMSUserExists = async (userSid: string) => {
    const response = await ky
        .get(`/api/admin/users/${userSid}/sync`, { throwHttpErrors: false })
        .json<ApiResponse>();

    return response.success;
};

export const useGetUMSUser = (userSid: string) => {
    return useQuery({
        queryKey: ['ums_user', userSid],
        queryFn: () => isUMSUserExists(userSid),
        enabled: !!userSid,
    });
};

const fetchUserMeta = async (userSid: string) => {
    const response = await ky
        .get(`/api/admin/users/${userSid}/metas`, { throwHttpErrors: false })
        .json<ApiResponse<UserMetaData[]>>();
    return response.data;
};

export const useUserMeta = (userSid: string) => {
    return useQuery({
        queryKey: ['user-meta', userSid],
        queryFn: () => fetchUserMeta(userSid),
        enabled: !!userSid,
    });
};

const setUserMeta = async (userSid: string, meta: MetaData): Promise<{ success: boolean }> => {
    const response = await ky
        .put(`/api/admin/users/${userSid}/metas`, {
            json: meta,
        })
        .json<{ success: boolean }>();
    return response;
};

export const useSetUserMeta = (userSid: string, meta: MetaData): Promise<{ success: boolean }> => {
    return setUserMeta(userSid, meta);
};