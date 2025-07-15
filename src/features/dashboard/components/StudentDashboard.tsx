import { Row, Col, Card, ListGroup, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
    Award,
    CalendarCheck,
    Percent,
    GraduationCap,
    Calendar as CalendarIcon,
    Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { StudentDashboardData, CalendarEventInfo } from '../../../types';
import { QuickAccessCard } from './common/QuickAccessCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const StudentDashboard = ({ data }: { data: StudentDashboardData }) => {
    if (!data) {
        return <Alert variant="warning">Não foi possível carregar os dados do seu dashboard.</Alert>;
    }

    const { courseInfo, academicSummary, nextAssessment, upcomingEvents, unreadNotifications } = data;

    const formattedAttendance = academicSummary?.attendanceRate
        ? `${(academicSummary.attendanceRate * 100).toFixed(1)}%`
        : 'N/A';

    const formattedAverage = academicSummary?.overallAverageScore?.toFixed(2) || 'N/A';

    return (
        <Row className="g-4">
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Meu Curso"
                    value={courseInfo?.courseName || 'N/A'}
                    icon={GraduationCap}
                    to="/my-course"
                    variant="primary"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Minhas Notas"
                    value={`Média ${formattedAverage}`}
                    icon={Award}
                    to="/my-grades"
                    variant="success"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Frequência"
                    value={formattedAttendance}
                    icon={Percent}
                    to="/my-attendance"
                    variant="info"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Notificações"
                    value={`${unreadNotifications || 0} não lidas`}
                    icon={Bell}
                    to="/notifications"
                    variant="warning"
                />
            </Col>

            <Col lg={5} className="mt-5">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="shadow-sm h-100 border-2 border-top-0 border-bottom-0 border-end-0 border-start-danger">
                        <Card.Header as="h5" className="d-flex align-items-center bg-transparent border-danger-subtle">
                            <CalendarCheck className="me-2 text-danger" /> Próxima Avaliação
                        </Card.Header>
                        <Card.Body className="d-flex flex-column justify-content-center text-center">
                            {nextAssessment ? (
                                <>
                                    <Card.Title as="h4">{nextAssessment.title}</Card.Title>
                                    <Card.Text className="text-muted">{nextAssessment.subject}</Card.Text>
                                    <Badge bg="danger-subtle" text="danger-emphasis" className="py-2 fs-6">
                                        {format(new Date(nextAssessment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </Badge>
                                </>
                            ) : (
                                <p className="text-muted mb-0">Nenhuma avaliação agendada em breve.</p>
                            )}
                        </Card.Body>
                    </Card>
                </motion.div>
            </Col>

            <Col lg={7} className="mt-5">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="shadow-sm h-100">
                        <Card.Header as="h5" className="bg-transparent border-primary-subtle"><CalendarIcon className="me-2 text-primary"/> Agenda</Card.Header>
                        <ListGroup variant="flush">
                            {upcomingEvents?.length > 0 ? (
                                upcomingEvents.slice(0, 4).map((event: CalendarEventInfo, index: number) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div>
                                            <strong>{event.title}</strong>
                                            <small className="d-block text-muted fw-light">
                                                {format(new Date(event.startTime), "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })}
                                            </small>
                                        </div>
                                        <Badge bg="primary-subtle" text="primary-emphasis" pill className="mt-2 mt-md-0">{event.type}</Badge>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>Nenhum evento agendado para os próximos dias.</ListGroup.Item>
                            )}
                            <ListGroup.Item className="text-center bg-light">
                                <Link to="/my-schedule">Ver minha agenda completa</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </motion.div>
            </Col>
        </Row>
    );
};