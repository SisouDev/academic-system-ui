import api from '../auth/api';
import type {
    LibrarianDashboardData,
    LoanDetails,
    FineDetails,
    LibraryItemDetails,
    CreateLibraryItemData, UpdateLibraryItemData, CreateLoanData
} from '../../types';
import type { PagedModel } from '../../types';

const extractFromCollection = <T>(response: PagedModel<T>): T[] => {
    if (!response._embedded) return [];
    const listKey = Object.keys(response._embedded)[0];
    return response._embedded[listKey] || [];
};

export const getLibrarianDashboardData = async (): Promise<LibrarianDashboardData> => {
    const { data } = await api.get('/api/v1/dashboard/librarian');
    return data.content || data;
};

export const getLoans = async (status: string): Promise<LoanDetails[]> => {
    const response = await api.get<PagedModel<LoanDetails>>(`/api/v1/loans?status=${status}&sort=loanDate,desc`);
    return extractFromCollection(response.data);
};

export const updateLoanStatus = async ({ id, status }: { id: number; status: string }) => {
    return api.patch(`/api/v1/loans/${id}/status`, { status });
};

export const getFines = async (status: string): Promise<FineDetails[]> => {
    const response = await api.get<PagedModel<FineDetails>>(`/api/v1/financial-transactions?type=FINE&status=${status}&sort=transactionDate,desc`);
    return extractFromCollection(response.data);
};

export const markFineAsPaid = async (id: number) => {
    return api.patch(`/api/v1/financial-transactions/${id}/pay`);
};


export const getLibraryItems = async (page = 0, size = 15): Promise<PagedModel<LibraryItemDetails>> => {
    const response = await api.get<PagedModel<LibraryItemDetails>>(`/api/v1/library/items?page=${page}&size=${size}&sort=title,asc`);
    return response.data;
};

export const createLibraryItem = async (itemData: CreateLibraryItemData): Promise<LibraryItemDetails> => {
    const { data } = await api.post('/api/v1/library/items', itemData);
    return data;
};

export const updateLibraryItem = async ({ id, ...itemData }: { id: number } & UpdateLibraryItemData): Promise<LibraryItemDetails> => {
    const { data } = await api.patch(`/api/v1/library/items/${id}`, itemData);
    return data;
};

export const deleteLibraryItem = async (id: number): Promise<void> => {
    await api.delete(`/api/v1/library/items/${id}`);
};

export const searchLibraryItems = async (query: string): Promise<LibraryItemDetails[]> => {
    if (query.length < 3) return [];
    const response = await api.get<PagedModel<LibraryItemDetails>>(`/api/v1/library/items?title=${query}`);
    return response.data._embedded?.libraryItemDetailsDtoList || [];
};


export const createLoan = async (loanData: CreateLoanData): Promise<LoanDetails> => {
    const { data } = await api.post('/api/v1/loans', loanData);
    return data;
};

export const getLoanById = async (id: number): Promise<LoanDetails> => {
    const { data } = await api.get(`/api/v1/loans/${id}`);
    return data;
};