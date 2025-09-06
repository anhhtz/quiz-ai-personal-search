import { Account } from '@/types/api-mappings';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';

export const getAccount = async () => {
    const res = await ky.get('/api/account').json<{ data: Account }>();

    return res.data;
};

export const useAccount = () =>
    useQuery<Account>({
        queryKey: ['account'],
        queryFn: () => getAccount(),
    });
