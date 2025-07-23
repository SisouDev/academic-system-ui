import api from '../auth/api';
import type {InternalRequestSummary, PagedModel, SecretaryDashboardData} from '../../types';

export const getSecretaryDashboardData = async (): Promise<SecretaryDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/secretary');
    return data.content || data;
};

export const getInternalRequests = async (status: string): Promise<InternalRequestSummary[]> => {
    const response = await api.get<PagedModel<InternalRequestSummary>>(`/api/v1/internal-requests?status=${status}`);
    if (response.data._embedded) {
        const key = Object.keys(response.data._embedded)[0];
        return response.data._embedded[key];
    }
    return [];
};

export const reviewInternalRequest = async ({ id, status, resolutionNotes }: { id: number; status: string; resolutionNotes?: string }) => {
    return api.patch(`/api/v1/internal-requests/${id}/status`, { status, resolutionNotes });
};