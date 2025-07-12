export type GlobalStatsData = {
    activeStudents: number;
    activeTeachers: number;
    activeLoans: number;
    openTickets: number;
    activeCourses: number;
    totalUsers: number;
};

export type StudentDistributionData = {
    courseName: string;
    studentCount: number;
};

export type ActivityFeedItem = {
    type: string;
    description: string;
    timestamp: string;
};

export type AdminDashboardData = {
    globalStats: GlobalStatsData;
    studentDistribution: StudentDistributionData[];
    recentActivityFeed: ActivityFeedItem[];
};