import api from '../auth/api';
import type {UserResponse} from '../../types';

export const fetchUserById = async (userId: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/api/v1/users/${userId}`);
    return response.data;
};