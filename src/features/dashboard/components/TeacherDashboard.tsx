import { Row, Col, Card, ListGroup, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {BookCopy, Users, CalendarClock, Bell, ClipboardCheck, BookText} from 'lucide-react';
import { Link } from 'react-router-dom';
import type {ElementType} from "react";
import type { TeacherDashboardData, UpcomingTaskInfo } from '../../../types';


type QuickAccessCardProps = {
    title: string;
    value: string | number;
    icon: ElementType;
    to: string;
    variant?: string;
};

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


export const TeacherDashboard = ({ data }: { data: TeacherDashboardData }) => {
    if (!data) {
        return <Alert variant="warning">Não foi possível carregar os dados do seu dashboard.</Alert>;
    }

    const { workload, upcomingTasks, pendingRequestsCount, unreadNotifications } = data;

    return (
        <Row className="g-4">
            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Minhas Turmas"
                    value={`${workload?.activeClassesCount || 0} ativas`}
                    icon={BookCopy}
                    to="/my-classes"
                />
            </Col>
            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Total de Alunos"
                    value={workload?.totalStudentsCount || 0}
                    icon={Users}
                    to="/my-classes/students"
                    variant="success"
                />
            </Col>

            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Planos de Aula"
                    value="Gerenciar"
                    icon={BookText}
                    to="/lesson-plans"
                    variant="secondary"
                />
            </Col>

            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Requisições"
                    value={`${pendingRequestsCount || 0} pendentes`}
                    icon={ClipboardCheck}
                    to="/internal-requests"
                    variant="warning"
                />
            </Col>
            <Col md={6} lg={4}>
                <QuickAccessCard
                    title="Notificações"
                    value={`${unreadNotifications || 0} não lidas`}
                    icon={Bell}
                    to="/notifications"
                    variant="info"
                />
            </Col>

            {/* --- AGENDA DA SEMANA --- */}
            <Col xs={12} className="mt-5">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="shadow-sm">
                        <Card.Header as="h5"><CalendarClock className="me-2"/>Agenda da Semana</Card.Header>
                        <ListGroup variant="flush">
                            {upcomingTasks?.length > 0 ? (
                                upcomingTasks.map((task: UpcomingTaskInfo, index: number) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div>
                                            <strong>{task.title}</strong>
                                            <span className="text-muted mx-2">-</span>
                                            <small>{task.context}</small>
                                            <small className="d-block text-muted fw-light">{new Date(task.date).toLocaleString('pt-BR', {dateStyle: 'full', timeStyle: 'short'})}</small>
                                        </div>
                                        <Badge bg="primary-subtle" text="primary-emphasis" pill className="mt-2 mt-md-0">{task.type}</Badge>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>Nenhuma tarefa ou evento agendado para os próximos dias.</ListGroup.Item>
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