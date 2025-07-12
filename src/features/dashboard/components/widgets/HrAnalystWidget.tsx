// src/features/dashboard/components/widgets/HrAnalystWidget.tsx
import { Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { Plane, UserPlus } from 'lucide-react';
import { QuickAccessCard } from '../common/QuickAccessCard';
import { Link } from 'react-router-dom';
import type { HrAnalystSummary, LeaveRequestSummary } from '../../../../types';

export const HrAnalystWidget = ({ data }: { data: HrAnalystSummary }) => {

    const formatDate = (dateString: string) => new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');

    return (
        <>
            <Col md={6} lg={4} className="mt-4">
                <QuickAccessCard
                    title="Licenças Pendentes"
                    value={data.pendingLeaveRequestsCount}
                    icon={Plane}
                    to="/hr/leave-requests"
                    variant="warning"
                />
            </Col>
            <Col md={6} lg={4} className="mt-4">
                <QuickAccessCard
                    title="Novas Contratações (Mês)"
                    value={data.newHiresThisMonth}
                    icon={UserPlus}
                    to="/employees"
                    variant="success"
                />
            </Col>

            <Col lg={8} className="mt-4">
                <Card className="shadow-sm">
                    <Card.Header as="h5">Pedidos de Licença para Revisão</Card.Header>
                    <ListGroup variant="flush">
                        {data.recentLeaveRequests?.length > 0 ? (
                            data.recentLeaveRequests.map((request: LeaveRequestSummary) => (
                                <ListGroup.Item key={request.id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{request.requesterName}</strong>
                                        <small className="d-block text-muted">
                                            Período: {formatDate(request.startDate)} a {formatDate(request.endDate)}
                                        </small>
                                    </div>
                                    <Badge bg="warning-subtle" text="warning-emphasis" pill>{request.status}</Badge>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item>Nenhum pedido de licença pendente.</ListGroup.Item>
                        )}
                        <ListGroup.Item className="text-center bg-light">
                            <Link to="/hr/leave-requests">Ver todos os pedidos</Link>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </>
    );
};