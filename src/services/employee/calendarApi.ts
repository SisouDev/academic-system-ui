import api from '../auth/api';
import type { CreateCalendarEventData, DepartmentSelection } from '../../types';
import type { PagedModel } from '../../types';

const extractFromCollection = <T>(response: { data: PagedModel<T> }): T[] => {
    if (!response.data._embedded) return [];
    const listKey = Object.keys(response.data._embedded)[0];
    return response.data._embedded[listKey] || [];
};

export const createCalendarEvent = (data: CreateCalendarEventData) => {
    return api.post('/api/v1/calendar/events', data);
};

export const getDepartmentsForSelection = async (): Promise<DepartmentSelection[]> => {
    const response = await api.get<PagedModel<DepartmentSelection>>('/api/v1/departments/all-for-selection');
    return extractFromCollection(response);
};