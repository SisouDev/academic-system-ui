import { useQuery } from '@tanstack/react-query';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import {BookCheck, BookX, CircleDollarSign, ClipboardList, Bell, BookUp} from 'lucide-react';
import { QuickAccessCard } from './common/QuickAccessCard';
import { GenericEmployeeWidgets } from './common/GenericEmployeeWidgets';
import { getLibrarianDashboardData } from '../../../services/employee/libraryApi';
import type { LibrarianDashboardData } from '../../../types';

export const LibrarianDashboard = () => {
    const { data, isLoading, isError, error } = useQuery<LibrarianDashboardData, Error>({
        queryKey: ['librarianDashboardData'],
        queryFn: getLibrarianDashboardData,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar dashboard: {error.message}</Alert>;
    if (!data) return <Alert variant="warning">Dados do dashboard não encontrados.</Alert>;

    const {
        pendingTasksCount,
        unreadNotifications,
        pendingLoans,
        overdueBooks,
        unpaidFines,
        myOpenTasks,
        recentAnnouncements
    } = data;

    return (
        <Row className="g-4">
            <Col md={6} lg={3}><QuickAccessCard title="Tarefas Pendentes" value={pendingTasksCount} icon={ClipboardList} to="/my-tasks"/></Col>
            <Col md={6} lg={3}><QuickAccessCard title="Notificações" value={`${unreadNotifications} não lidas`} icon={Bell} to="/notifications" variant="info"/></Col>
            <Col md={6} lg={3}><QuickAccessCard title="Gerenciar Acervo" value="Adicionar/Editar" icon={BookUp} to="/library/items" variant="success"/></Col>
            <Col md={6} lg={3}><QuickAccessCard title="Empréstimos Pendentes" value={pendingLoans} icon={BookCheck} to="/library/loans?status=PENDING" variant="warning"/></Col>
            <Col md={6} lg={3}><QuickAccessCard title="Livros Atrasados" value={overdueBooks} icon={BookX} to="/library/loans?status=OVERDUE" variant="danger"/></Col>
            <Col md={6} lg={3}><QuickAccessCard title="Multas Pendentes" value={unpaidFines} icon={CircleDollarSign} to="/library/fines" variant="secondary"/></Col>

            <GenericEmployeeWidgets myOpenTasks={myOpenTasks} recentAnnouncements={recentAnnouncements} />
        </Row>
    );
};