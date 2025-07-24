import api from '../auth/api';
import type { DirectorDashboardData } from '../../types';


export const getDirectorDashboardData = async (): Promise<DirectorDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/director');
    return data.content || data;
};