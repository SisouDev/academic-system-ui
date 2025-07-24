import api from '../auth/api';
import type {HrAnalystDashboardData, LeaveRequestDetails, AbsenceDetails, PagedResponse} from '../../types';
import type { CollectionModel, PagedModel } from '../../types';

const extractFromCollection = <T>(response: CollectionModel<T> | PagedModel<T>): T[] => {
    if (!response._embedded) return [];
    const listKey = Object.keys(response._embedded)[0];
    return response._embedded[listKey].map((entity: any) => entity.content || entity);
};


export const getHrDashboardData = async (): Promise<HrAnalystDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/hr-analyst');
    return data.content || data;
};

export const getLeaveRequests = async (
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    page = 0,
    size = 10
): Promise<PagedResponse<LeaveRequestDetails>> => {
    const { data } = await api.get<PagedResponse<LeaveRequestDetails>>('/api/v1/leave-requests', {
        params: {
            page,
            size,
            status,
            sort: 'startDate,asc'
        }
    });
    return data;
};

export const reviewLeaveRequest = async ({ id, status }: { id: number; status: 'APPROVED' | 'REJECTED' }) => {
    return api.patch(`/api/v1/leave-requests/${id}/review`, { status });
};


export const getAbsences = async (status: string): Promise<AbsenceDetails[]> => {
    const response = await api.get<PagedModel<AbsenceDetails>>(`/api/v1/absences?status=${status}&sort=createdAt,desc`);
    return extractFromCollection(response.data);
};

export const reviewAbsence = async ({ id, status }: { id: number; status: 'APPROVED' | 'REJECTED' }) => {
    return api.patch(`/api/v1/absences/${id}/review`, { status });
};