import type { PersonSummary, DepartmentSummary } from './index';

export type TaskSummaryTask = {
    id: number;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
    dueDate: string;
    assigneeName: string;
    departmentName: string;
};

export type TaskDetails = {
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    createdAt: string;
    completedAt?: string;
    createdBy: PersonSummary;
    assignee?: PersonSummary;
    department: DepartmentSummary;
};