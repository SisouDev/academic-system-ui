import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/auth/api';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_TEACHER' | 'ROLE_STUDENT' | 'ROLE_EMPLOYEE' | 'ROLE_LIBRARIAN' | 'ROLE_TECHNICIAN' | 'ROLE_HR_ANALYST';

interface User {
    id: number;
    login: string;
    fullName: string;
    roles: UserRole[];
    institutionId: number;
}

interface LoginCredentials {
    login: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface AuthTokenPayload {
    sub: string;
    roles: UserRole[];
    userId: number;
    personId: number;
    fullName: string;
    institutionId: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            try {
                const decoded = jwtDecode<AuthTokenPayload>(token);
                setUser({
                    id: decoded.userId,
                    login: decoded.sub,
                    fullName: decoded.fullName,
                    roles: decoded.roles,
                    institutionId: decoded.institutionId
                });
            } catch (error) {
                console.error("Token inválido no localStorage", error);
                localStorage.removeItem('authToken');
            }
        }
        setIsLoading(false);
    }, []);

    const signIn = async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', credentials);
            const { token } = response.data;

            localStorage.setItem('authToken', token);

            const decoded = jwtDecode<AuthTokenPayload>(token);
            const authenticatedUser: User = {
                id: decoded.userId,
                login: decoded.sub,
                fullName: decoded.fullName,
                roles: decoded.roles,
                institutionId: decoded.institutionId,
            };

            setUser(authenticatedUser);

            navigate('/dashboard');
        } catch (error) {
            console.error("Falha no login:", error);
            throw new Error('Login ou senha inválidos.');
        }
    };

    const signOut = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated: !!user,
            signIn,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
    }
    return context;
}