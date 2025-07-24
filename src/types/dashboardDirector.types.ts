import type {GlobalStatsData} from "./dashboardAdmin.types.ts";

export interface FinancialSummary {
    monthlyRevenue: number;
    delinquencyRate: number;
    activeScholarships: number;
    totalScholarshipValue: number;
    operationalExpenses: number;
}

export interface AcademicEfficiency {
    averageStudentGrade: number;
    averageAttendanceRate: number;
    overallApprovalRate: number;
}

export interface OperationalAlerts {
    recentLeaveRequests: number;
    failedOrPendingTransactions: number;
    highPrioritySupportTickets: number;
    pendingInternalRequests: number;
}

export interface ActivityLog {
    description: string;
    userName: string;
    userEmail: string;
    timestamp: string;
}

export interface DirectorDashboardData {
    generalOverview: GlobalStatsData;
    financialSummary: FinancialSummary;
    academicEfficiency: AcademicEfficiency;
    operationalAlerts: OperationalAlerts;
    recentActivities: ActivityLog[];
}