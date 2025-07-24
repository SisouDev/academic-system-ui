import api from '../auth/api';
import type {PersonSummary, UserResponseDto} from '../../types';

export const fetchUserById = async (userId: string): Promise<UserResponseDto> => {
    const response = await api.get<UserResponseDto>(`/api/v1/users/${userId}`);
    return response.data;
};

export const searchPeople = async (query: string): Promise<PersonSummary[]> => {
    if (query.length < 3) {
        return [];
    }
    const { data } = await api.get(`/api/v1/people/search?query=${query}`);
    return data || [];
};