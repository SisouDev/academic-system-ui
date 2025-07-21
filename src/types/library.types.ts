export interface LoanDetails {
    id: number;
    studentName: string;
    libraryItemTitle: string;
    libraryItemType: string;
    status: 'PENDING' | 'ACTIVE' | 'RETURNED' | 'LATE' | 'OVERDUE' | 'REJECTED';
    loanDate: string;
    dueDate: string;
    returnDate?: string;
}

export interface FineDetails {
    id: number;
    student: { fullName: string; };
    description: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    transactionDate: string;
}

export interface LoanDetails {
    id: number;
    studentName: string;
    libraryItemTitle: string;
    libraryItemType: string;
    status: 'PENDING' | 'ACTIVE' | 'RETURNED' | 'LATE' | 'OVERDUE' | 'REJECTED';
    loanDate: string;
    dueDate: string;
    returnDate?: string;
}

export interface FineDetails {
    id: number;
    student: { fullName: string; };
    description: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    transactionDate: string;
}

export interface LibraryItemDetails {
    id: number;
    title: string;
    author?: string;
    type: string;
    status: string;
    availableCopies: number;
    totalCopies: number;
}