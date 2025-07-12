import api from '../../services/auth/api';

export interface DashboardStats {
    totalInstitutions: number;
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalEmployees: number;
}

export const getDashboardData = async (): Promise<DashboardStats> => {
    const { data } = await api.get('/api/v1/dashboard');
    return data;
};