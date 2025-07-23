import type {TaskSummary} from "./dashboardEmployee.types.ts";
import type {AnnouncementSummary, PersonSummary} from "./announcement.types.ts";

export interface TechnicianDashboardData {
    unreadNotifications: number;
    pendingTasksCount: number;
    myOpenTasks: TaskSummary[];
    recentAnnouncements: AnnouncementSummary[];
    openSupportTickets: number;
    assignedAssetsCount: number;
}

export interface SupportTicketDetailsIT {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
    requester: { fullName: string };
    assignee?: { fullName: string };
    createdAt: string;
    updatedAt?: string;
}

export interface AssetDetails {
    id: number;
    name: string;
    assetTag: string;
    type: string;
    status: 'IN_USE' | 'IN_STORAGE' | 'IN_REPAIR' | 'RETIRED';
    assignedTo?: { fullName: string };
    purchaseDate: string;
    location: string;
}

export type AssetStatus = 'IN_STOCK' | 'IN_USE' | 'IN_MAINTENANCE' | 'DISPOSED';

export interface AssetDetailsIt {
    id: number;
    name: string;
    assetTag: string;
    serialNumber: string;
    purchaseDate: string;
    purchaseCost: number;
    status: AssetStatus;
    createdAt: string;
    assignedTo: PersonSummary | null;
}

export interface CreateAssetData {
    name: string;
    assetTag: string;
    serialNumber: string;
    purchaseDate: string;
    purchaseCost: number;
}