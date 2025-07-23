import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../contexts/auth/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';
import api from '../../services/auth/api';


import { StudentDashboard } from '../../features/dashboard/components/StudentDashboard';
import { AdminDashboard } from '../../features/dashboard/components/AdminDashboard';
import { TeacherDashboard } from '../../features/dashboard/components/TeacherDashboard';
import { EmployeeDashboard } from '../../features/dashboard/components/EmployeeDashboard';
import {LibrarianDashboard} from "../../features/dashboard/components/LibrarianDashboard.tsx";
import {FinanceDashboard} from "../../features/dashboard/components/FinanceDashboard.tsx";
import {HrAnalystDashboard} from "../../features/dashboard/components/HrAnalystDashboard.tsx";
import {TechnicianDashboard} from "../../features/dashboard/components/TechnicianDashboard.tsx";
import {SecretaryDashboard} from "../../features/dashboard/components/SecretaryDashboard.tsx";


const getDashboardData = async () => {
    const { data } = await api.get('/api/v1/dashboard/data');
    return data;
};

export default function DashboardPage() {
    const { user } = useAuthContext();

    console.log("DASHBOARD RENDERIZADO COM ROLES:", user?.roles);


    const useGenericQuery = !user?.roles.includes('ROLE_FINANCE_MANAGER') &&
        !user?.roles.includes('ROLE_FINANCE_ASSISTANT') &&
        !user?.roles.includes('ROLE_LIBRARIAN') &&
        !user?.roles.includes('ROLE_TECHNICIAN') &&
        !user?.roles.includes('ROLE_SECRETARY') &&
        !user?.roles.includes('ROLE_HR_ANALYST');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: getDashboardData,
        enabled: useGenericQuery,
    });

    if (isLoading && useGenericQuery) {
        return <div className="text-center p-5"><Spinner /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar o dashboard: {error.message}</Alert>;
    }

    const renderDashboardByRole = () => {
        if (user?.roles.includes('ROLE_ADMIN')) {
            return <AdminDashboard data={data} />;
        }
        if (user?.roles.includes('ROLE_FINANCE_MANAGER') || user?.roles.includes('ROLE_FINANCE_ASSISTANT')) {
            return <FinanceDashboard />;
        }
        if (user?.roles.includes('ROLE_HR_ANALYST')) {
            return <HrAnalystDashboard />;
        }
        if (user?.roles.includes('ROLE_LIBRARIAN')) {
            return <LibrarianDashboard />;
        }
        if (user?.roles.includes('ROLE_TECHNICIAN')) {
            return <TechnicianDashboard />;
        }
        if (user?.roles.includes('ROLE_TEACHER')) {
            return <TeacherDashboard data={data} />;
        }
        if (user?.roles.includes('ROLE_STUDENT')) {
            return <StudentDashboard data={data} />;
        }
        if (user?.roles.includes('ROLE_SECRETARY')) {
            return <SecretaryDashboard />;
        }
        if (user?.roles.includes('ROLE_EMPLOYEE')) {
            return <EmployeeDashboard data={data} />;
        }

        return <Alert variant="info">Dashboard em construção para o seu perfil.</Alert>;
    };

    return (
        <div>
            <h1 className="mb-1" style={{ fontFamily: 'Raleway, sans-serif' }}>Meu Painel</h1>
            <p className="lead text-muted">
                Olá, <strong>{user?.fullName}</strong>! Aqui está um resumo rápido de suas atividades.
            </p>
            <hr className="my-4"/>

            <div className="mt-4">
                {renderDashboardByRole()}
            </div>
        </div>
    );
}