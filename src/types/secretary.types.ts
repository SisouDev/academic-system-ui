import type { TaskSummary, AnnouncementSummary } from '.';

export interface InternalRequestSummary {
    id: number;
    title: string;
    requesterName: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CalendarEventInfoSec {
    title: string;
    type: string;
    startTime: string;
}

export interface SecretaryDashboardData {
    unreadNotifications: number;
    pendingTasksCount: number;
    myOpenTasks: TaskSummary[];
    recentAnnouncements: AnnouncementSummary[];

    pendingRequestsCount: number;
    recentPendingRequests: InternalRequestSummary[];
    nextEvent: CalendarEventInfoSec | null;
}