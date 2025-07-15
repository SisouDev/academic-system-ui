import api  from '../auth/api.ts';
import type {ChangePasswordFormData, ProfileData, UpdateProfileFormData} from '../../types';
import type {ChangePasswordRequestDto} from '../../types';

const BASE_URL = '/api/v1/users/me';

export const fetchMyProfile = async (): Promise<ProfileData> => {
    const response = await api.get<ProfileData>(BASE_URL);
    return response.data;
};

export const updateProfilePicture = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await api.post(`${BASE_URL}/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const changePassword = async (data: ChangePasswordFormData): Promise<void> => {
    const payload: ChangePasswordRequestDto = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
    };
    await api.put(`${BASE_URL}/password`, payload);
};

export const updateProfile = async (data: UpdateProfileFormData): Promise<void> => {
    await api.patch(BASE_URL, data);
};