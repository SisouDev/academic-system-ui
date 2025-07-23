import { useQuery } from '@tanstack/react-query';
import { Row, Col, Alert, Spinner, Card, ListGroup, Badge } from 'react-bootstrap';
import { ClipboardList, Bell, FileText, CalendarClock } from 'lucide-react';
import { QuickAccessCard } from './common/QuickAccessCard';
import { GenericEmployeeWidgets } from './common/GenericEmployeeWidgets';
import { getSecretaryDashboardData } from '../../../services/employee/secretaryApi';
import type { SecretaryDashboardData, InternalRequestSummary } from '../../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export const SecretaryDashboard = () => {
    const { data, isLoading, isError, error } = useQuery<SecretaryDashboardData, Error>({
        queryKey: ['secretaryDashboardData'],
        queryFn: getSecretaryDashboardData,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar dashboard: {error.message}</Alert>;
    if (!data) return <Alert variant="warning">Dados do dashboard não encontrados.</Alert>;

    const {
        pendingTasksCount,
        unreadNotifications,
        pendingRequestsCount,
        recentPendingRequests,
        nextEvent,
        myOpenTasks,
        recentAnnouncements
    } = data;

    const getUrgencyVariant = (urgency: string) => {
        if (urgency === 'HIGH') return 'danger';
        if (urgency === 'MEDIUM') return 'warning';
        return 'secondary';
    };

    return (
        <Row className="g-4">
            {/* Cards Comuns */}
            <Col md={6} lg={4}><QuickAccessCard title="Tarefas Pendentes" value={pendingTasksCount} icon={ClipboardList} to="/my-tasks"/></Col>
            <Col md={6} lg={4}><QuickAccessCard title="Notificações" value={`${unreadNotifications} não lidas`} icon={Bell} to="/notifications" variant="info"/></Col>

            {/* Card Específico */}
            <Col md={6} lg={4}><QuickAccessCard title="Requisições a Triar" value={pendingRequestsCount} icon={FileText} to="/requests/internal" variant="warning"/></Col>

            {/* Widgets Específicos */}
            <Col md={7} className="mt-5">
                <Card className="shadow-sm">
                    <Card.Header as="h5">Requisições Internas Pendentes</Card.Header>
                    <ListGroup variant="flush">
                        {recentPendingRequests.length > 0 ? (
                            recentPendingRequests.map((req: InternalRequestSummary) => (
                                <ListGroup.Item key={req.id} as={Link} to={`/requests/internal/${req.id}`} action>
                                    <div className="d-flex justify-content-between">
                                        <span>{req.title} <small className="text-muted">- {req.requesterName}</small></span>
                                        <Badge pill bg={getUrgencyVariant(req.urgency)}>{req.urgency}</Badge>
                                    </div>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>Nenhuma requisição pendente.</ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>

            <Col md={5} className="mt-5">
                <Card className="shadow-sm">
                    <Card.Header as="h5"><CalendarClock className="me-2"/>Próximo Evento</Card.Header>
                    {nextEvent ? (
                        <Card.Body>
                            <Card.Title>{nextEvent.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{nextEvent.type}</Card.Subtitle>
                            <Card.Text>
                                {format(new Date(nextEvent.startTime), "'Dia' dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </Card.Text>
                        </Card.Body>
                    ) : (
                        <Card.Body className="text-center text-muted">Nenhum evento agendado.</Card.Body>
                    )}
                </Card>
            </Col>

            {/* Widgets Comuns */}
            <GenericEmployeeWidgets myOpenTasks={myOpenTasks} recentAnnouncements={recentAnnouncements} />
        </Row>
    );
};