import api from '../auth/api';
import type {
    InternalRequestDetails,
    PagedResponse,
    SecretaryDashboardData
} from '../../types';

export const getSecretaryDashboardData = async (): Promise<SecretaryDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/secretary');
    return data.content || data;
};

export const getInternalRequests = async (
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED',
    page = 0,
    size = 10
): Promise<PagedResponse<InternalRequestDetails>> => {
    const params = new URLSearchParams({
        status,
        page: String(page),
        size: String(size),
    });

    params.append('sort', 'urgency,desc');
    params.append('sort', 'createdAt,asc');

    const { data } = await api.get<PagedResponse<InternalRequestDetails>>(
        `/api/v1/internal-requests?${params.toString()}`
    );
    return data;
};

export const reviewInternalRequest = async ({ id, status, resolutionNotes }: { id: number; status: string; resolutionNotes?: string }) => {
    return api.patch(`/api/v1/internal-requests/${id}/status`, { status, resolutionNotes });
};