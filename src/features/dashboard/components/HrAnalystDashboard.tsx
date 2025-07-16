import { useQuery } from '@tanstack/react-query';
import { Row, Col, Card, ListGroup, Badge, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {Briefcase, UserPlus, CalendarX2, Bell} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LeaveRequestSummary } from '../../../types';
import { QuickAccessCard } from './common/QuickAccessCard';
import { getHrDashboardData } from '../../../services/employee/hrApi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const HrAnalystDashboard = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['hrDashboardData'],
        queryFn: getHrDashboardData,
    });

    if (isLoading) {
        return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar dados do dashboard: {(error as Error).message}</Alert>;
    }

    if (!data) {
        return <Alert variant="warning">Não foi possível encontrar os dados do dashboard.</Alert>;
    }

    const { unreadNotifications, pendingLeaveRequestsCount, newHiresThisMonth, recentLeaveRequests } = data;

    return (
        <Row className="g-4">
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Licenças Pendentes"
                    value={pendingLeaveRequestsCount}
                    icon={Briefcase}
                    to="/hr/leave-requests"
                    variant="warning"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Novas Contratações (Mês)"
                    value={newHiresThisMonth}
                    icon={UserPlus}
                    to="/hr/employees"
                    variant="success"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Justificativas de Ausência"
                    value={"Analisar"}
                    icon={CalendarX2}
                    to="/hr/absences"
                    variant="secondary"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Notificações"
                    value={`${unreadNotifications} não lidas`}
                    icon={Bell}
                    to="/notifications"
                    variant="info"
                />
            </Col>

            <Col xs={12} className="mt-5">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Últimas Solicitações de Licença</Card.Header>
                        <ListGroup variant="flush">
                            {recentLeaveRequests.length > 0 ? (
                                recentLeaveRequests.map((req: LeaveRequestSummary) => (
                                    <ListGroup.Item action as={Link} to="/hr/leave-requests" key={req.id}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{req.requesterName}</strong> - <span className="text-muted">{req.type}</span>
                                                <small className="d-block text-muted fw-light">
                                                    {format(new Date(req.startDate), 'dd/MM/yyyy', { locale: ptBR })} até {format(new Date(req.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                                                </small>
                                            </div>
                                            <Badge bg="warning-subtle" text="warning-emphasis" pill>{req.status}</Badge>
                                        </div>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>Nenhuma solicitação de licença pendente.</ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </motion.div>
            </Col>
        </Row>
    );
};