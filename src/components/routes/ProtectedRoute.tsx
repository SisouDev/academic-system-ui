
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth/AuthContext';
import type {UserRole} from '../../types';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuthContext();

    if (isLoading) {
        return <div><h2>Carregando...</h2></div>;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    const userHasRequiredRole = allowedRoles
        ? user.roles.some(role => allowedRoles.includes(role))
        : true;

    if (!userHasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};