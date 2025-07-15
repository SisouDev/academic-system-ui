import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchMyProfile,
    updateProfilePicture,
    changePassword,
    updateProfile,
} from '../../services/profile/profileApi.ts';
import { toast } from 'react-toastify';
import type {AxiosError} from "axios";

interface ApiError {
    message: string;
}

export const useProfile = () => {
    const queryClient = useQueryClient();

    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ['myProfile'],
        queryFn: fetchMyProfile,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const onSuccess = (message: string) => {
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    };

    const onError = (error: AxiosError<ApiError>, defaultMessage: string) => {
        const message = error.response?.data?.message || defaultMessage;
        toast.error(message);
    };

    const updateAvatarMutation = useMutation({
        mutationFn: updateProfilePicture,
        onSuccess: () => onSuccess('Foto de perfil atualizada com sucesso!'),
        onError: (error: AxiosError<ApiError>) => onError(error, 'Erro ao atualizar a foto de perfil.'),
    });

    const changePasswordMutation = useMutation({
        mutationFn: changePassword,
        onSuccess: () => onSuccess('Senha alterada com sucesso!'),
        onError: (error: AxiosError<ApiError>) => onError(error, 'Erro ao alterar a senha.'),
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => onSuccess('Perfil atualizado com sucesso!'),
        onError: (error: AxiosError<ApiError>) => onError(error, 'Erro ao atualizar o perfil.'),
    });

    return {
        profile,
        isLoading,
        isError,
        updateAvatar: updateAvatarMutation.mutate,
        isUpdatingAvatar: updateAvatarMutation.isPending,
        changeUserPassword: changePasswordMutation.mutate,
        isChangingPassword: changePasswordMutation.isPending,
        updateUserProfile: updateProfileMutation.mutate,
        isUpdatingProfile: updateProfileMutation.isPending,
    };
};