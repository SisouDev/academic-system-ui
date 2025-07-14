import type { PersonSummary, DepartmentSummary } from './index';

export type InternalRequestDetails = {
    id: number;
    title: string;
    description: string;
    type: string;
    status: string;
    urgency: string;
    createdAt: string;
    resolvedAt?: string;
    resolutionNotes?: string;
    requester: PersonSummary;
    targetDepartment?: DepartmentSummary;
    handler?: PersonSummary;
};
export type CreateInternalRequestData = {
    title: string;
    description: string;
    type: string;
    urgency: string;
    targetDepartmentId: number;
};

export type UpdateRequestData = {
    status: string;
    resolutionNotes: string;
};