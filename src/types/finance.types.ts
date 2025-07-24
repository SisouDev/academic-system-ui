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

export const TransactionStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
    IN_DISPUTE: 'IN_DISPUTE',
} as const;
export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];


export const TransactionType = {
    TUITION: 'TUITION',
    FEE: 'FEE',
    FINE: 'FINE',
    SALARY: 'SALARY',
    PURCHASE: 'PURCHASE',
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];


export interface TransactionDetail {
    transactionId: number;
    personName: string;
    personEmail: string;
    description: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    createdAt: string; // ISO-8601 date string
}

export interface PagedResponse<T> {
    _embedded?: {
        [key: string]: T[];
    };
    _links: {
        first?: { href: string };
        prev?: { href: string };
        self: { href: string };
        next?: { href: string };
        last?: { href: string };
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

export interface FinancialOverview {
    totalRevenueYTD: number;
    totalExpensesYTD: number;
    netIncomeYTD: number;
    accountsReceivable: number;
    profitMargin: number;
}

export interface CashFlowTrend {
    period: string;
    revenue: number;
    expenses: number;
    netFlow: number;
}

export interface ExpenseBreakdown {
    category: string;
    totalAmount: number;
    percentage: number;
}

export interface ReceivablesAging {
    current: number;
    overdue30Days: number;
    overdue60Days: number;
    overdue90Days: number;
    overdueOver90Days: number;
}

export interface DirectorFinancialReport {
    overview: FinancialOverview;
    cashFlowTrend: CashFlowTrend[];
    expenseBreakdown: ExpenseBreakdown[];
    receivablesAging: ReceivablesAging;
}