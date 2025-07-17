import type {TaskSummary} from "./dashboardEmployee.types.ts";
import type {AnnouncementSummary} from "./announcement.types.ts";

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