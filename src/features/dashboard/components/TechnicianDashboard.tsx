import { useQuery } from '@tanstack/react-query';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import { HardDrive, MessageSquareWarning, ClipboardList, Bell } from 'lucide-react';
import { QuickAccessCard } from './common/QuickAccessCard';
import { GenericEmployeeWidgets } from './common/GenericEmployeeWidgets';
import { getTechnicianDashboardData } from '../../../services/it/itApi';

export const TechnicianDashboard = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['technicianDashboardData'],
        queryFn: getTechnicianDashboardData,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar dashboard: {(error as Error).message}</Alert>;
    if (!data) return <Alert variant="warning">Dados do dashboard não encontrados.</Alert>;

    const {
        pendingTasksCount,
        unreadNotifications,
        openSupportTickets,
        assignedAssetsCount,
        myOpenTasks,
        recentAnnouncements
    } = data;

    return (
        <Row className="g-4">
            <Col md={6} lg={3}>
                <QuickAccessCard title="Tarefas Pendentes" value={pendingTasksCount} icon={ClipboardList} to="/my-tasks"/>
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Notificações" value={`${unreadNotifications} não lidas`} icon={Bell} to="/notifications" variant="info"/>
            </Col>

            <Col md={6} lg={3}>
                <QuickAccessCard title="Chamados em Aberto" value={openSupportTickets} icon={MessageSquareWarning} to="/it/support-tickets" variant="danger"/>
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Meus Ativos de TI" value={assignedAssetsCount} icon={HardDrive} to="/it/assets" variant="primary"/>
            </Col>

            <GenericEmployeeWidgets myOpenTasks={myOpenTasks} recentAnnouncements={recentAnnouncements} />
        </Row>
    );
};