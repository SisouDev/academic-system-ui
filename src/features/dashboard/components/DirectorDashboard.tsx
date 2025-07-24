import { useQuery } from '@tanstack/react-query';
import { Row, Col, Spinner, Alert, ListGroup, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
    DollarSign, BarChart2, AlertTriangle, Activity, Users,
    UserCheck, GraduationCap, Library, TrendingUp, Sliders, BarChart
} from 'lucide-react';

import type { DirectorDashboardData, ActivityLog } from '../../../types';
import {KPI} from "../../common/KPI.tsx";
import {getDirectorDashboardData} from "../../../services/employee/directorApi.ts";
import {Link} from "react-router-dom";


const FinancialSection = ({ summary }: { summary: DirectorDashboardData['financialSummary'] }) => (
    <>
        <KPI title="Faturamento Mensal" value={summary.monthlyRevenue} prefix="R$ " icon={DollarSign} color="#28a745" delay={0.1} />
        <KPI title="Inadimplência" value={summary.delinquencyRate} suffix="%" icon={TrendingUp} color="#dc3545" delay={0.2} />
        <KPI title="Bolsas Ativas" value={summary.activeScholarships} icon={GraduationCap} color="#17a2b8" delay={0.3} />
        <KPI title="Despesas Operacionais" value={summary.operationalExpenses} prefix="R$ " icon={Sliders} color="#ffc107" delay={0.4} />
    </>
);

const AcademicSection = ({ summary }: { summary: DirectorDashboardData['academicEfficiency'] }) => (
    <>
        <KPI title="Média Geral dos Alunos" value={summary.averageStudentGrade} icon={BarChart2} color="#007bff" delay={0.5} />
        <KPI title="Frequência Média" value={summary.averageAttendanceRate} suffix="%" icon={UserCheck} color="#28a745" delay={0.6} />
        <KPI title="Taxa de Aprovação" value={summary.overallApprovalRate} suffix="%" icon={GraduationCap} color="#17a2b8" delay={0.7} />
    </>
);

const AlertsSection = ({ summary }: { summary: DirectorDashboardData['operationalAlerts'] }) => (
    <Card className="shadow-sm h-100">
        <Card.Header as="h5" className="d-flex align-items-center">
            <AlertTriangle className="me-2" color="#dc3545" /> Alertas Gerenciais
        </Card.Header>
        <ListGroup variant="flush">
            <ListGroup.Item
                as={Link}
                to="/hr/leave-requests/pending"
                action
                className="d-flex justify-content-between align-items-center"
            >
                Pedidos de Afastamento Pendentes <span className="badge bg-warning">{summary.recentLeaveRequests}</span>
            </ListGroup.Item>

            <ListGroup.Item
                as={Link}
                to="/finance/transactions/problematic"
                action
                className="d-flex justify-content-between align-items-center"
            >
                Transações com Falha/Pendentes <span className="badge bg-danger">{summary.failedOrPendingTransactions}</span>
            </ListGroup.Item>
            <ListGroup.Item
                as={Link}
                to="/it/support-tickets/high-priority"
                action
                className="d-flex justify-content-between align-items-center"
            >
                Tickets de Suporte (Prioridade Alta) <span className="badge bg-info">{summary.highPrioritySupportTickets}</span>
            </ListGroup.Item>
            <ListGroup.Item
                as={Link}
                to="/requests/internal/pending"
                action
                className="d-flex justify-content-between align-items-center"
            >
                Solicitações Internas Pendentes <span className="badge bg-secondary">{summary.pendingInternalRequests}</span>
            </ListGroup.Item>
        </ListGroup>
    </Card>
);

const ActivityFeed = ({ activities }: { activities: ActivityLog[] }) => (
    <Card className="shadow-sm h-100">
        <Card.Header as="h5" className="d-flex align-items-center">
            <Activity className="me-2" /> Atividades Recentes
        </Card.Header>
        <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {activities.length > 0 ? (
                activities.map((log, index) => (
                    <ListGroup.Item key={index}>
                        <p className="mb-0">{log.description}</p>
                        <small className="text-muted">{log.userName} - {log.timestamp}</small>
                    </ListGroup.Item>
                ))
            ) : (
                <ListGroup.Item>Nenhuma atividade recente.</ListGroup.Item>
            )}
        </ListGroup>
    </Card>
);


export const DirectorDashboard = () => {
    const { data, isLoading, isError, error } = useQuery<DirectorDashboardData, Error>({
        queryKey: ['directorDashboardData'],
        queryFn: getDirectorDashboardData,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">Erro ao carregar o dashboard do diretor: {error.message}</Alert>;
    }

    if (!data) {
        return <Alert variant="warning">Não foram encontrados dados para o dashboard.</Alert>;
    }

    const { generalOverview, financialSummary, academicEfficiency, operationalAlerts, recentActivities } = data;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Row className="g-4">
                <Col xs={12}>
                    <h4 className="mb-3 text-muted">Visão Geral da Instituição</h4>
                </Col>
                <KPI title="Alunos Ativos" value={generalOverview.activeStudents} icon={GraduationCap} color="#007bff" />
                <KPI title="Professores Ativos" value={generalOverview.activeTeachers} icon={UserCheck} color="#28a745" />
                <KPI title="Cursos Ativos" value={generalOverview.activeCourses} icon={Library} color="#ffc107" />
                <KPI title="Total de Usuários" value={generalOverview.totalUsers} icon={Users} color="#17a2b8" />
                <Col lg={12} className="mt-5">
                    <Card as={Link} to="/reports/financial" className="text-decoration-none text-dark shadow-sm">
                        <Card.Body className="d-flex align-items-center">
                            <BarChart size={40} className="me-3 text-primary" />
                            <div>
                                <Card.Title as="h5">Relatórios Financeiros Detalhados</Card.Title>
                                <Card.Text className="text-muted">
                                    Visualize tendências de fluxo de caixa, composição de despesas e mais.
                                </Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} className="mt-5">
                    <h4 className="mb-3 text-muted">Indicadores Financeiros</h4>
                </Col>
                <FinancialSection summary={financialSummary} />

                <Col xs={12} className="mt-5">
                    <h4 className="mb-3 text-muted">Eficiência Acadêmica</h4>
                </Col>
                <AcademicSection summary={academicEfficiency} />

                <Col lg={7} className="mt-5">
                    <ActivityFeed activities={recentActivities} />
                </Col>

                <Col lg={5} className="mt-5">
                    <AlertsSection summary={operationalAlerts} />
                </Col>
            </Row>
        </motion.div>
    );
};