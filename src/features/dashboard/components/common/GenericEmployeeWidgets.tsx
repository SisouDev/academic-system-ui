import { Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import type { TaskSummary, AnnouncementSummary } from '../../../../types';

interface GenericEmployeeWidgetsProps {
    myOpenTasks: TaskSummary[];
    recentAnnouncements: AnnouncementSummary[];
}

export const GenericEmployeeWidgets = ({ myOpenTasks, recentAnnouncements }: GenericEmployeeWidgetsProps) => {
    return (
        <Row className="g-4 mt-1">
            <Col md={7}>
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

            <Col md={5}>
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