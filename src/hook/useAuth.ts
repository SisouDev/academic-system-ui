import { jwtDecode } from 'jwt-decode';

interface AuthTokenPayload {
    sub: string;
    roles: string[];
    userId: number;
    personId: number;
    fullName: string;
}

export const useAuth = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return {
            isAuthenticated: false,
            roles: [],
            id: null,
            personId: null,
            fullName: null
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
        };
    } catch (error) {
        console.error("Token inválido:", error);
        return { isAuthenticated: false, roles: [], id: null, personId: null, fullName: null };
    }
};