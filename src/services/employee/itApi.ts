import api from '../auth/api.ts';
import type {
    TechnicianDashboardData,
    SupportTicketDetails,
    AssetDetails,
    CreateAssetData,
    AssetDetailsIt
} from '../../types';
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

export const getAssets = async (status?: string): Promise<AssetDetailsIt[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const response = await api.get<PagedModel<AssetDetailsIt>>(`/api/v1/it/assets?${params.toString()}`);
    return extractFromCollection(response.data);
};

export const createAsset = async (data: CreateAssetData): Promise<AssetDetails> => {
    const { data: newAsset } = await api.post('/api/v1/it/assets', data);
    return newAsset.content || newAsset;
};

export const assignAsset = async ({ assetId, employeeId }: { assetId: number; employeeId: number }) => {
    return api.patch(`/api/v1/it/assets/${assetId}/assign/${employeeId}`);
};

export const returnAssetToStock = async (assetId: number) => {
    return api.patch(`/api/v1/it/assets/${assetId}`, { status: 'IN_STOCK', assignedToId: null });
};

