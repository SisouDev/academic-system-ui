import { useQuery } from '@tanstack/react-query';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import { ArrowDownCircle, ArrowUpCircle, Banknote, ShoppingCart, ClipboardList, Bell } from 'lucide-react';
import { QuickAccessCard } from './common/QuickAccessCard';
import { GenericEmployeeWidgets } from './common/GenericEmployeeWidgets';
import { getFinanceDashboardData } from '../../../services/employee/financeApi';

export const FinanceDashboard = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['financeDashboardData'],
        queryFn: getFinanceDashboardData,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar dashboard: {error.message}</Alert>;
    if (!data) return <Alert variant="warning">Dados do dashboard não encontrados.</Alert>;

    const formatCurrency = (value: number) =>
        (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <Row className="g-4">
            <Col md={6} lg={3}>
                <QuickAccessCard title="A Receber (Mês)" value={formatCurrency(data.totalReceivable)} icon={ArrowUpCircle} to="/finance/receivables" variant="success"/>
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="A Pagar (Mês)" value={formatCurrency(data.totalPayable)} icon={ArrowDownCircle} to="/finance/payables" variant="danger"/>
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Folha de Pagamento" value={`${data.pendingPayrollsCount} pendente(s)`} icon={Banknote} to="/finance/payroll" variant="primary"/>
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Ordens de Compra" value={`${data.pendingPurchaseOrdersCount} pendente(s)`} icon={ShoppingCart} to="/finance/purchase-orders" variant="info"/>
            </Col>

            <Col md={6} lg={3}>
                <QuickAccessCard title="Tarefas Pendentes" value={data.pendingTasksCount} icon={ClipboardList} to="/my-tasks" variant="secondary"/>
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Notificações" value={`${data.unreadNotifications} não lidas`} icon={Bell} to="/notifications" variant="primary"/>
            </Col>

            <GenericEmployeeWidgets myOpenTasks={data.myOpenTasks} recentAnnouncements={data.recentAnnouncements} />
        </Row>
    );
};