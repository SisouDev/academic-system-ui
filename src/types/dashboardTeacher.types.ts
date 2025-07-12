export type WorkloadSummary = {
    activeClassesCount: number;
    totalStudentsCount: number;
    subjectsTaughtCount: number;
};

export type UpcomingTaskInfo = {
    title: string;
    type: string;
    date: string;
    context: string;
};

export type TeacherDashboardData = {
    unreadNotifications: number;
    workload: WorkloadSummary;
    upcomingTasks: UpcomingTaskInfo[];
    pendingRequestsCount: number;
};
