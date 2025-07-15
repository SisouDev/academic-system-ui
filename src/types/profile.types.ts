import type {HalCollection} from './api.types';
import type {UserResponse} from './user.types';

export interface ProfileData extends UserResponse {
    _links?: HalCollection<'self' | 'update-profile' | 'change-password' | 'upload-avatar'>;
}

export interface UpdateProfileFormData {
    email: string;
    phone: string;
}

export interface ChangePasswordFormData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}