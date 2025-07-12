import { Row, Col, Card, ListGroup, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Award, CalendarCheck, Percent, GraduationCap, Calendar as CalendarIcon, BookOpenCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { StudentDashboardData } from '../../../types';
import type {ElementType} from "react";


interface QuickAccessCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    to: string;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
}

const QuickAccessCard = ({ title, value, icon: Icon, to, variant = "primary" }: QuickAccessCardProps) => (
    <motion.div whileHover={{ y: -5, scale: 1.03 }} className="h-100">
        <Card as={Link} to={to} className="text-decoration-none h-100 shadow-sm text-center">
            <Card.Body className="d-flex flex-column justify-content-center p-3">
                <div className={`text-${variant} mb-2`}>
                    <Icon size={32} />
                </div>
                <Card.Title as="h6" style={{ fontFamily: 'Raleway, sans-serif' }} className="fw-bold">{title}</Card.Title>
                <p className="fs-5 text-body-emphasis mb-0">
                    {value}
                </p>
            </Card.Body>
        </Card>
    </motion.div>
);


export const StudentDashboard = ({ data }: { data: StudentDashboardData }) => {
    if (!data) {
        return <Alert variant="warning">Não foi possível carregar os dados do seu dashboard.</Alert>;
    }

    const { courseInfo, academicSummary, nextAssessment, upcomingEvents } = data;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
    }

    return (
        <Row className="g-4">
            <Col xs={12}>
                <Card className="shadow-sm">
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            <GraduationCap size={40} className="text-primary me-3 flex-shrink-0"/>
                            <div>
                                <Card.Title as="h5" className="mb-0" style={{ fontFamily: 'Raleway, sans-serif' }}>{courseInfo?.courseName}</Card.Title>
                                <Card.Text className="text-muted mb-0">
                                    {courseInfo?.currentSemester}º Semestre | Previsão de Conclusão: {courseInfo?.conclusionForecast}
                                </Card.Text>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Média Geral"
                    value={academicSummary?.overallAverageScore?.toFixed(2) || 'N/A'}
                    icon={Award}
                    to="/academic/grades"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Frequência"
                    value={`${academicSummary?.attendanceRate?.toFixed(1) || '100'}%`}
                    icon={Percent}
                    to="/academic/attendance"
                    variant="success"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Próxima Avaliação"
                    value={formatDate(nextAssessment?.date)}
                    icon={CalendarCheck}
                    to="/academic/assessments"
                    variant="warning"
                />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard
                    title="Calendário Acadêmico"
                    value={`${upcomingEvents?.length || 0} eventos`}
                    icon={CalendarIcon}
                    to="/calendar"
                    variant="info"
                />
            </Col>

            <Col lg={7} className="mt-5">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5">Próximos Eventos</Card.Header>
                        <ListGroup variant="flush">
                            {upcomingEvents?.length > 0 ? (
                                upcomingEvents.map((event, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{event.title}</strong>
                                            <small className="d-block text-muted">{new Date(event.startTime).toLocaleString('pt-BR', {dateStyle: 'short', timeStyle: 'short'})}</small>
                                        </div>
                                        <Badge bg="secondary-subtle" text="dark" pill>{event.type}</Badge>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>Nenhum evento próximo no calendário.</ListGroup.Item>
                            )}
                            <ListGroup.Item className="text-center bg-light">
                                <Link to="/calendar">Ver calendário completo</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </motion.div>
            </Col>

            <Col lg={5} className="mt-5">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <Card className="bg-primary-subtle border-primary shadow-sm h-100">
                        <Card.Header as="h5" className="border-primary"><BookOpenCheck className="me-2"/> Foco da Semana</Card.Header>
                        <Card.Body className="d-flex flex-column justify-content-center">
                            {nextAssessment ? (
                                <>
                                    <Card.Title>{nextAssessment.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{nextAssessment.subject}</Card.Subtitle>
                                    <Card.Text>
                                        Sua próxima avaliação é em <strong>{formatDate(nextAssessment.date)}</strong>. Organize seus estudos!
                                    </Card.Text>
                                </>
                            ) : (
                                <p className="text-center">Parabéns, você está em dia com suas avaliações!</p>
                            )}
                        </Card.Body>
                    </Card>
                </motion.div>
            </Col>
        </Row>
    );
};