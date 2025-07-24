import * as yup from 'yup';
import type {PersonSummary} from "./announcement.types.ts";

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

export interface LibraryItemSummary {
    id: number;
    title: string;
    type: string;
}

export interface LoanDetails {
    id: number;
    borrower: PersonSummary;
    item: LibraryItemSummary;
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
    isbn?: string;
    publisher?: string;
    publicationYear: number;
    type: 'BOOK' | 'MAGAZINE' | 'JOURNAL' | 'THESIS' | 'OTHER';
    status: string;
    availableCopies: number;
    totalCopies: number;
}

export const createLibraryItemSchema = yup.object({
    title: yup.string().required('O título é obrigatório.'),
    author: yup.string().optional().defined(),
    isbn: yup.string().optional().defined(),
    publisher: yup.string().optional().defined(),
    publicationYear: yup
        .number()
        .typeError('Ano inválido')
        .required('O ano é obrigatório.')
        .min(1500)
        .max(new Date().getFullYear()),
    type: yup
        .mixed<'BOOK' | 'MAGAZINE' | 'JOURNAL' | 'THESIS' | 'OTHER'>()
        .oneOf(['BOOK', 'MAGAZINE', 'JOURNAL', 'THESIS', 'OTHER'])
        .required('O tipo é obrigatório.'),
    totalCopies: yup
        .number()
        .typeError('Número inválido')
        .required('O total de cópias é obrigatório.')
        .min(1),
}).required();


export type CreateLibraryItemData = yup.InferType<typeof createLibraryItemSchema>;

export type UpdateLibraryItemData = Partial<CreateLibraryItemData>;

export interface CreateLoanData {
    itemId: number;
    borrowerId: number;
    dueDate: string;
}