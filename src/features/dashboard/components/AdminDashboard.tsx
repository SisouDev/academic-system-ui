import { Row, Col, Alert } from 'react-bootstrap';
import { Users, UserCheck, GraduationCap, BookOpenCheck } from 'lucide-react';

import { QuickAccessCard } from './common/QuickAccessCard';
import { StudentDistributionChart } from './StudentDistributionChart';
import { RecentActivityFeed } from './RecentActivityFeed';
import type { AdminDashboardData } from '../../../types';

export const AdminDashboard = ({ data }: { data: AdminDashboardData }) => {
    if (!data) {
        return <Alert variant="warning">Não foi possível carregar os dados do painel administrativo.</Alert>;
    }

    const { globalStats, studentDistribution, recentActivityFeed } = data;

    return (
        <Row className="g-4">
            <Col md={6} lg={3}>
                <QuickAccessCard title="Alunos Ativos" value={globalStats?.activeStudents || 0} icon={GraduationCap} to="/admin/students" />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Professores Ativos" value={globalStats?.activeTeachers || 0} icon={UserCheck} to="/admin/teachers" variant="success" />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Cursos" value={globalStats?.activeCourses || 0} icon={BookOpenCheck} to="/admin/courses" variant="warning" />
            </Col>
            <Col md={6} lg={3}>
                <QuickAccessCard title="Total de Usuários" value={globalStats?.totalUsers || 0} icon={Users} to="/admin/users" variant="info" />
            </Col>

            <Col lg={7} className="mt-5">
                <StudentDistributionChart data={studentDistribution} />
            </Col>
            <Col lg={5} className="mt-5">
                <RecentActivityFeed activities={recentActivityFeed} />
            </Col>
        </Row>
    );
};