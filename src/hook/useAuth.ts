import { jwtDecode } from 'jwt-decode';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT' | 'ROLE_EMPLOYEE';

interface AuthTokenPayload {
    sub: string;
    roles: UserRole[];
    userId: number;
    personId: number;
    fullName: string;
    institutionId: number;
}

export const useAuth = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return {
            isAuthenticated: false,
            roles: [] as UserRole[],
            id: null,
            personId: null,
            fullName: null,
            institutionId: null
        };
    }

    try {
        const decodedToken = jwtDecode<AuthTokenPayload>(token);

        return {
            isAuthenticated: true,
            roles: decodedToken.roles || [],
            id: decodedToken.userId,
            personId: decodedToken.personId,
            fullName: decodedToken.fullName,
            institutionId: decodedToken.institutionId,
        };
    } catch (error) {
        console.error("Token inválido:", error);
        return { isAuthenticated: false, roles: [], id: null, personId: null, fullName: null, institutionId: null };
    }
};