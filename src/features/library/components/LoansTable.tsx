import { Table, Alert } from 'react-bootstrap';
import type { LoanDetails } from '../../../types';
import { LoanTableRow } from './LoanTableRow';

interface LoansTableProps {
    loans: LoanDetails[];
    onUpdateStatus: (variables: { id: number; status: string }) => void;
    isUpdating: boolean;
}

export const LoansTable = ({ loans, onUpdateStatus, isUpdating }: LoansTableProps) => {
    if (loans.length === 0) {
        return <Alert variant="secondary" className="text-center m-3">Nenhum empréstimo encontrado com este status.</Alert>;
    }

    return (
        <Table hover responsive className="mb-0">
            <thead>
            <tr>
                <th style={{width: '30%'}}>Item</th>
                <th>Usuário</th>
                <th>Data Empréstimo</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
            </tr>
            </thead>
            <tbody>
            {loans.map(loan => (
                <LoanTableRow key={loan.id} loan={loan} onUpdateStatus={onUpdateStatus} isUpdating={isUpdating} />
            ))}
            </tbody>
        </Table>
    );
};