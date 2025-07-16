export type TaskSummary = {
    id: number;
    title: string;
    dueDate: string;
    status: string;
};

export type AnnouncementSummaryEmployee = {
    id: number;
    title: string;
    scope: string;
    createdAt: string;
};

export type LibrarianSummary = {
    pendingLoans: number;
    overdueBooks: number;
};

export type TechnicianSummary = {
    openSupportTickets: number;
    assignedAssetsCount: number;
};

export type LeaveRequestSummary = {
    id: number;
    requesterName: string;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
};




export type HrAnalystSummary = {
    pendingLeaveRequestsCount: number;
    newHiresThisMonth: number;
    recentLeaveRequests: LeaveRequestSummary[];
};

export type EmployeeDashboardData = {
    unreadNotifications: number;
    pendingTasksCount: number;
    myOpenTasks: TaskSummary[];
    recentAnnouncements: AnnouncementSummaryEmployee[];

    librarianInfo?: LibrarianSummary;
    technicianInfo?: TechnicianSummary;
    hrAnalystInfo?: HrAnalystSummary;
};