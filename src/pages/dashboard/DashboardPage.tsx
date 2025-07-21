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


const getDashboardData = async () => {
    const { data } = await api.get('/api/v1/dashboard/data');
    return data;
};

export default function DashboardPage() {
    const { user } = useAuthContext();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: getDashboardData,
    });

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
            </div>
        );
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar o dashboard: {error.message}</Alert>;
    }

    const renderDashboardByRole = () => {
        if (user?.roles.includes('ROLE_ADMIN')) {
            return <AdminDashboard data={data} />;
        }
        if (user?.roles.includes('ROLE_LIBRARIAN') ||
            user?.roles.includes('ROLE_TECHNICIAN') ||
            user?.roles.includes('ROLE_HR_ANALYST') ||
            user?.roles.includes('ROLE_EMPLOYEE')) {
            return <EmployeeDashboard data={data} />;
        }
        if (user?.roles.includes('ROLE_TEACHER')) {
            return <TeacherDashboard data={data} />;
        }
        /*if(user?.roles.includes('ROLE_TECHNICIAN')){
            return <TechnicianDashboard data={data} />;
        }*/
        if (user?.roles.includes('ROLE_LIBRARIAN')) {
            return <LibrarianDashboard />;
        }
        if (user?.roles.includes('ROLE_STUDENT')) {
            return <StudentDashboard data={data} />;
        }
        if (user?.roles.includes('ROLE_FINANCE')) {
            return <FinanceDashboard />;
        }

        return (
            <div className="text-center">
                <h2>Dashboard em Construção</h2>
                <p>Ainda estamos preparando um painel exclusivo para o seu tipo de acesso.</p>
            </div>
        );
    };

    return (
        <div>
            <h1 className="mb-1" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Meu Painel
            </h1>
            <p className="lead text-muted" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Olá, <strong>{user?.fullName}</strong>! Aqui está um resumo rápido de suas atividades.
            </p>
            <hr className="my-4"/>

            <div className="mt-4">
                {renderDashboardByRole()}
            </div>
        </div>
    );
}