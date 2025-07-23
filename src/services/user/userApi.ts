import api from '../auth/api';
import type {UserResponseDto} from '../../types';

export const fetchUserById = async (userId: string): Promise<UserResponseDto> => {
    const response = await api.get<UserResponseDto>(`/api/v1/users/${userId}`);
    return response.data;
};