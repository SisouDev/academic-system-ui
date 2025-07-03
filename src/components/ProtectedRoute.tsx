import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from '../hook/useAuth';


interface ProtectedRouteProps {
    requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
    const { isAuthenticated, roles } = useAuth();
    console.log("ROLES VERIFICADAS PELO PROTECTEDROUTE:", roles);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !roles.includes(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};