import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from '../../services/user/userApi';

export const useUser = (userId: string | undefined) => {
    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUserById(userId!),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5,
    });

    return {
        user,
        isLoading,
        isError,
        error,
    };
};