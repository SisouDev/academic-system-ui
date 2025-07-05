import { useState, useEffect } from 'react';
import axios from 'axios';
import { StatsCard } from '../../components/admin/StatsCard';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaBuilding } from 'react-icons/fa';
import '../Dashboard.scss';
import {StudentDistributionChart} from "../../components/admin/student/StudentDistributionChart.tsx";
import {RecentActivityFeed} from "../../components/admin/RecentActivityFeed.tsx";

interface DashboardStats {
    studentCount: number;
    teacherCount: number;
    courseCount: number;
    membersCount: number;
}

export function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await axios.get<DashboardStats>('/api/v1/admin/dashboard-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("DADOS RECEBIDOS DA API:", response.data);
                setStats(response.data);
            } catch (err) {
                setError('Falha ao carregar as estatísticas do painel.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="uk-text-center uk-padding-large"><div data-uk-spinner="ratio: 2"></div></div>;
    if (error) return <div className="uk-alert-danger" data-uk-alert><p>{error}</p></div>;

    return (
        <div className="page-container">
            <header className="page-header">
                <h1 className="uk-heading-medium">Dashboard Administrativo</h1>
            </header>

            {stats && (
                <div className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-4@m" data-uk-grid>
                    <div>
                        <StatsCard icon={<FaUserGraduate size={40} />} label="Total de Alunos" value={stats.studentCount} color="#1e87f0" />
                    </div>
                    <div>
                        <StatsCard icon={<FaChalkboardTeacher size={40} />} label="Total de Professores" value={stats.teacherCount} color="#32d296" />
                    </div>
                    <div>
                        <StatsCard icon={<FaBook size={40} />} label="Total de Cursos" value={stats.courseCount} color="#faa05a" />
                    </div>
                    <div>
                        <StatsCard icon={<FaBuilding size={40} />} label="Total de Membros" value={stats.membersCount} color="#8a5aed" />
                    </div>
                </div>
            )}

            <div className="page-content-card uk-margin-large-top">
                <h3 className="uk-card-title uk-text-bold">Distribuição de Alunos por Curso</h3>
                <StudentDistributionChart />
            </div>
            <div className="page-content-card uk-margin-large-top">
                <RecentActivityFeed />
            </div>
        </div>
    );
}