import type {LeaveRequestSummary} from "./dashboardEmployee.types.ts";

export interface HrAnalystDashboardData {
    unreadNotifications: number;
    pendingLeaveRequestsCount: number;
    newHiresThisMonth: number;
    recentLeaveRequests: LeaveRequestSummary[];
}


export interface LeaveRequestDetails {
    id: number;
    requester: { fullName: string };
    reviewer?: { fullName: string };
    type: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    startDate: string;
    endDate: string;
    reason: string;
    createdAt: string;
    reviewedAt?: string;
}

export interface AbsenceDetails {
    id: number;
    requester: {
        id: number;
        fullName: string;
    };
    reviewer?: {
        id: number;
        fullName: string;
    };
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    absenceDate: string;
    reason: string;
    attachmentUrl?: string;
    createdAt: string;
}

export interface EmployeeList {
    id: number;
    profilePictureUrl?: string;
    fullName: string;
    email: string;
    jobPosition: string;
    hiringDate: string;
    baseSalary: number;
}

export interface StaffList {
    id: number;
    profilePictureUrl?: string;
    fullName: string;
    email: string;
    positionOrDegree: string;
    hiringDate?: string;
    baseSalary?: number;
}