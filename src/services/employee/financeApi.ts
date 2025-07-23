import api from '../../services/auth/api';
import type {
    CreatePurchaseOrderData, CreatePurchaseRequestData,
    FinanceDashboardData, FinancialTransaction, PayableSummary,
    PayrollRecordDetails,
    PurchaseOrderDetails, PurchaseRequest,
    SalaryStructure,
    SalaryStructureRequest
} from '../../types';
import type { PagedModel } from '../../types';

const extractFromCollection = <T>(response: PagedModel<T>): T[] => {
    if (!response._embedded) return [];
    const listKey = Object.keys(response._embedded)[0];
    return response._embedded[listKey] || [];
};

export const getFinanceDashboardData = async (): Promise<FinanceDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/finance');
    return data.content || data; // Lida com a resposta HATEOAS
};

export const getPayrollRecords = async (status: string): Promise<PayrollRecordDetails[]> => {
    const response = await api.get<PagedModel<PayrollRecordDetails>>(`/api/v1/payroll?status=${status}&sort=referenceMonth,desc`);
    return extractFromCollection(response.data);
};

export const markPayrollAsPaid = async (id: number) => {
    return api.post(`/api/v1/payroll/${id}/pay`);
};

export const getPurchaseOrders = async (status: string): Promise<PurchaseOrderDetails[]> => {
    const response = await api.get<PagedModel<PurchaseOrderDetails>>(`/api/v1/purchase-orders?status=${status}&sort=orderDate,desc`);
    return extractFromCollection(response.data);
};

export const updatePurchaseOrderStatus = async ({ id, status }: { id: number; status: string }) => {
    return api.patch(`/api/v1/purchase-orders/${id}/status?status=${status}`);
};

export const getSalaryStructures = async (): Promise<SalaryStructure[]> => {
    const response = await api.get<PagedModel<SalaryStructure>>('/api/v1/salary-structures');
    return extractFromCollection(response.data);
};

export const createSalaryStructure = async (data: SalaryStructureRequest) => {
    return api.post('/api/v1/salary-structures', data);
};

export const updateSalaryStructure = async ({ id, ...data }: SalaryStructureRequest) => {
    return api.put(`/api/v1/salary-structures/${id}`, data);
};

export const deleteSalaryStructure = async (id: number) => {
    return api.delete(`/api/v1/salary-structures/${id}`);
};

export const createPurchaseOrder = async (data: CreatePurchaseOrderData) => {
    return api.post('/api/v1/purchase-orders', data);
};

export const createPurchaseRequest = async (data: CreatePurchaseRequestData) => {
    return api.post('/api/v1/purchase-requests', data);
};

export const getPurchaseRequests = async (status: string): Promise<PurchaseRequest[]> => {
    const response = await api.get<PagedModel<PurchaseRequest>>(`/api/v1/purchase-requests?status=${status}&sort=createdAt,desc`);
    return extractFromCollection(response.data);
};

export const updatePurchaseRequestStatus = async ({ id, newStatus }: { id: number; newStatus: string }) => {
    return api.patch(`/api/v1/purchase-requests/${id}/status?newStatus=${newStatus}`);
};

export const getFinancialTransactions = async (type: string, status: string): Promise<FinancialTransaction[]> => {
    const response = await api.get<PagedModel<FinancialTransaction>>(
        `/api/v1/financial-transactions?type=${type}&status=${status}&sort=transactionDate,desc`
    );
    return extractFromCollection(response.data);
};

export const markTransactionAsPaid = async (id: number) => {
    return api.patch(`/api/v1/financial-transactions/${id}/pay`);
};

export const getPendingPayables = async (): Promise<PayableSummary[]> => {
    const { data } = await api.get('/api/v1/finance/payables');
    return data._embedded?.payableSummaryDtoList || [];
};