import { User, UserDetails } from '@/types/api-mappings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const fetchUsersWithRoles = async (
    search: string,
    page: number,
    limit: number
): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
    });

    return ky.get(`/api/users/roles?${searchParams}`).json();
};

export const useUsersWithRoles = (search: string, page: number, limit: number) => {
    return useQuery({
        queryKey: ['users-roles', search, page],
        queryFn: () => fetchUsersWithRoles(search, page, limit),
    });
};

export const useUpdateUserRoles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, roles }: { userId: string; roles: number[] }) => {
            return ky.post('/api/users/roles', { json: { userId, roles } }).json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users-roles'] });
        },
    });
};