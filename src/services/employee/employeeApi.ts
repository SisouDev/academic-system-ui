import api from '../../services/auth/api';
import type {StaffList} from '../../types';
import type { PagedModel } from '../../types';

const extractFromCollection = <T>(response: PagedModel<T>): T[] => {
    if (!response._embedded) return [];
    const listKey = Object.keys(response._embedded)[0];
    return response._embedded[listKey] || [];
};

export const getEmployees = async (searchTerm: string = ''): Promise<StaffList[]> => {
    const url = `/api/v1/employees?searchTerm=${searchTerm}&sort=firstName,asc`;
    const response = await api.get<PagedModel<StaffList>>(url);
    return extractFromCollection(response.data);
};


