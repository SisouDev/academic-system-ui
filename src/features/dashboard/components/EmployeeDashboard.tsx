import { Row, Col, Card, ListGroup, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { ClipboardList, Bell, Megaphone } from 'lucide-react';

import type { EmployeeDashboardData, TaskSummary, AnnouncementSummary } from '../../../types';
import { QuickAccessCard } from './common/QuickAccessCard';
import { LibrarianWidget } from './widgets/LibrarianWidget';
import { TechnicianWidget } from './widgets/TechnicianWidget';
import { HrAnalystWidget } from './widgets/HrAnalystWidget';

export const EmployeeDashboard = ({ data }: { data: EmployeeDashboardData }) => {
    if (!data) {
        return <Alert variant="warning">Não foi possível carregar os dados do seu dashboard.</Alert>;
    }

    const {
        pendingTasksCount = 0,
        unreadNotifications = 0,
        myOpenTasks = [],
        recentAnnouncements = [],
        librarianInfo,
        technicianInfo,
        hrAnalystInfo
    } = data;

    return (
        <Row className="g-4">
            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Minhas Tarefas Pendentes"
                    value={pendingTasksCount}
                    icon={ClipboardList}
                    to="/my-tasks"
                />
            </Col>
            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Notificações"
                    value={`${unreadNotifications} não lidas`}
                    icon={Bell}
                    to="/notifications"
                    variant="info"
                />
            </Col>

            {librarianInfo && <LibrarianWidget data={librarianInfo} />}
            {technicianInfo && <TechnicianWidget data={technicianInfo} />}
            {hrAnalystInfo && <HrAnalystWidget data={hrAnalystInfo} />}
            
            <Col md={7} className="mt-5">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Minhas Tarefas Abertas</Card.Header>
                        <ListGroup variant="flush">
                            {myOpenTasks.length > 0 ? (
                                myOpenTasks.map((task: TaskSummary) => (
                                    <ListGroup.Item key={task.id}>
                                        {task.title}
                                        <Badge bg="warning" pill className="ms-2">
                                            Vence em: {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                        </Badge>
                                    </ListGroup.Item>
                                ))
                            ) : ( <ListGroup.Item>Nenhuma tarefa pendente.</ListGroup.Item> )}
                        </ListGroup>
                    </Card>
                </motion.div>
            </Col>

            <Col md={5} className="mt-5">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5"><Megaphone className="me-2" />Anúncios Recentes</Card.Header>
                        <ListGroup variant="flush">
                            {recentAnnouncements.length > 0 ? (
                                recentAnnouncements.map((announcement: AnnouncementSummary) => (
                                    <ListGroup.Item key={announcement.id}>
                                        {announcement.title}
                                        <small className="text-muted d-block">{new Date(announcement.createdAt).toLocaleDateString()}</small>
                                    </ListGroup.Item>
                                ))
                            ) : ( <ListGroup.Item>Nenhum anúncio recente.</ListGroup.Item> )}
                        </ListGroup>
                    </Card>
                </motion.div>
            </Col>
        </Row>
    );
};