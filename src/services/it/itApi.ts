import api from '../auth/api';
import type { TechnicianDashboardData, SupportTicketDetails, AssetDetails } from '../../types';
import type { CollectionModel, PagedModel } from '../../types';


const extractFromCollection = <T>(response: CollectionModel<T> | PagedModel<T>): T[] => {
    if (!response._embedded) {
        return [];
    }
    const listKey = Object.keys(response._embedded)[0];
    return response._embedded[listKey] || [];
};

export const getTechnicianDashboardData = async (): Promise<TechnicianDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/technician');
    return data.content || data;
};


export const getSupportTickets = async (status: string): Promise<SupportTicketDetails[]> => {
    const response = await api.get<PagedModel<SupportTicketDetails>>(`/api/v1/support-tickets?status=${status}&sort=createdAt,desc`);
    return extractFromCollection(response.data);
};

export const getItAssets = async (status: string, assignedToId?: number | 'me'): Promise<AssetDetails[]> => {
    let url = `/api/v1/it/assets?status=${status}&sort=name,asc`;
    if (assignedToId) {
        url += `&assignedToId=${assignedToId}`;
    }
    const response = await api.get<PagedModel<AssetDetails>>(url);
    return extractFromCollection(response.data);
};