import type { TaskSummary, AnnouncementSummary } from '.';

export interface LibrarianDashboardData {
    unreadNotifications: number;
    pendingTasksCount: number;
    myOpenTasks: TaskSummary[];
    recentAnnouncements: AnnouncementSummary[];

    pendingLoans: number;
    overdueBooks: number;
    unpaidFines: number;
}