import type {InstitutionSummaryDto} from './institution.types';

export type PersonResponse = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    createdAt: string;
    personType: 'STUDENT' | 'TEACHER' | 'EMPLOYEE' | 'STAFF';
    institution: InstitutionSummaryDto;
};

export type UserResponse = {
    id: number;
    login: string;
    active: boolean;
    person: PersonResponse;
    roles: { id: number; name: string }[];
};