import { jwtDecode } from 'jwt-decode';

interface AuthTokenPayload {
    sub: string;
    roles: string[];
}

export const useAuth = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        return { isAuthenticated: false, roles: [] };
    }

    try {
        const decodedToken = jwtDecode<AuthTokenPayload>(token);

        return { isAuthenticated: true, roles: decodedToken.roles || [] };
    } catch (error) {
        console.error("Token inválido:", error);
        return { isAuthenticated: false, roles: [] };
    }
};