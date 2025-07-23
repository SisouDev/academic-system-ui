import type {PersonSummary} from './announcement.types';

export type SupportTicketSummary = {
    id: number;
    title: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    requester: {
        fullName: string;
    };
};

export type SupportTicketDetails = {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    requester: PersonSummary;
    assignee?: PersonSummary;
};

export type CreateSupportTicketData = {
    title: string;
    description: string;
    category: string;
    priority: string;
};

export type UpdateTicketData = {
    status: string;
    priority: string;
}