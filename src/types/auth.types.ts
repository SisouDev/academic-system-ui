export type UserRole = 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT' | 'ROLE_EMPLOYEE';

export interface User {
    id: number;
    login: string;
    fullName: string;
    roles: UserRole[];
    institutionId: number;
}

export interface LoginCredentials {
    login: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user?: {
        id: number;
        login: string;
        name: string;
    };
}

export interface AuthTokenPayload {
    sub: string;
    roles: UserRole[];
    userId: number;
    personId: number;
    fullName: string;
    institutionId: number;
    iat: number;
    exp: number;
}