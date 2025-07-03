import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

type User = {
    id: number;
    login: string;
    fullName: string;
    roles: string[];
    institutionId: number;
};

type LoginResponse = {
    token: string;
    user: {
        id: number;
        login: string;
        fullName: string;
    }
};

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (loginData: LoginResponse) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        if (token && userData) {
            setUser(JSON.parse(userData));
            console.log("TOKEN RECEBIDO DO BACKEND:", token);
            console.log("TOKEN DECODIFICADO:", jwtDecode(token));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setIsLoading(false);
    }, []);

    const login = async (loginData: LoginResponse) => {
        localStorage.setItem('authToken', loginData.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${loginData.token}`;

        const userDetailsResponse = await api.get(`/api/v1/users/${loginData.user.id}`);
        const userDetails = userDetailsResponse.data;

        const formattedUser: User = {
            id: userDetails.id,
            login: userDetails.login,
            fullName: `${userDetails.person.firstName} ${userDetails.person.lastName}`,
            roles: userDetails.roles.map((role: { name: string }) => role.name),
            institutionId: userDetails.person.institution.id
        };

        localStorage.setItem('userData', JSON.stringify(formattedUser));
        setUser(formattedUser);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}