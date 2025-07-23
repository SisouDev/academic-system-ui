import type { TaskSummary, AnnouncementSummary } from '.';

export interface FinanceDashboardData {
    unreadNotifications: number;
    pendingTasksCount: number;
    myOpenTasks: TaskSummary[];
    recentAnnouncements: AnnouncementSummary[];

    totalReceivable: number;
    totalPayable: number;
    pendingPayrollsCount: number;
    pendingPurchaseOrdersCount: number;
}

export interface PayrollRecordDetails {
    id: number;
    personName: string;
    personJobPosition: string;
    referenceMonth: string;
    netPay: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
}

export interface PurchaseOrderDetails {
    id: number;
    requesterName: string;
    supplier: string;
    description: string;
    amount: number;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';
    orderDate: string;
    dueDate: string;
}

export interface SalaryStructure {
    id: number;
    jobPosition: string;
    level: string;
    baseSalary: number;
}

export interface SalaryStructureRequest {
    id?: number;
    jobPosition: string;
    level: string;
    baseSalary: number;
}

export interface CreatePurchaseOrderData {
    supplier: string;
    description: string;
    amount: number;
    dueDate: string;
}

export interface CreatePurchaseRequestData {
    itemName: string;
    quantity: number;
    justification?: string;
}

export interface PurchaseRequest {
    id: number;
    requesterName: string;
    itemName: string;
    quantity: number;
    justification: string;
    status: 'PENDING' | 'APPROVED_BY_ASSISTANT' | 'REJECTED_BY_ASSISTANT' | 'PROCESSED';
    createdAt: string;
}

export interface FinancialTransaction {
    id: number;
    person: {
        id: number;
        fullName: string;
    };
    description: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'COMPLETED';
    type: 'TUITION' | 'FINE' | 'SALARY_PAYMENT' | 'PURCHASE' | 'OTHER';
    transactionDate: string;
}

export interface PayableSummary {
    payableId: string;
    type: string;
    description: string;
    amount: number;
    dueDate: string;
    status: string;
}