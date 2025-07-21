import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Badge, ButtonGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { getLoans, updateLoanStatus } from '../../../services/employee/libraryApi';
import { Check, X, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LoanDetails } from '../../../types';

interface LoanListProps {
    status: 'PENDING' | 'ACTIVE' | 'OVERDUE' | 'RETURNED' | 'REJECTED';
}

const getStatusVariant = (status: LoanDetails['status']) => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'ACTIVE': return 'primary';
        case 'OVERDUE': return 'danger';
        case 'RETURNED': return 'success';
        case 'REJECTED': return 'secondary';
        default: return 'light';
    }
};

export const LoanList = ({ status }: LoanListProps) => {
    const queryClient = useQueryClient();

    const { data: loans, isLoading, isError } = useQuery({
        queryKey: ['loans', status],
        queryFn: () => getLoans(status),
    });

    const mutation = useMutation({
        mutationFn: updateLoanStatus,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['loans'] });
            void queryClient.invalidateQueries({ queryKey: ['librarianDashboardData'] });
        },
    });

    const handleUpdateStatus = (id: number, newStatus: string) => {
        mutation.mutate({ id, status: newStatus });
    };

    if (isLoading) return <div className="text-center p-4"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Não foi possível carregar os empréstimos.</Alert>;

    return (
        <Table striped bordered hover responsive size="sm">
            <thead>
            <tr>
                <th>Usuário</th>
                <th>Item da Biblioteca</th>
                <th>Data do Empréstimo</th>
                <th>Data de Devolução</th>
                <th>Status</th>
                <th className="text-center">Ações</th>
            </tr>
            </thead>
            <tbody>
            {loans && loans.length > 0 ? (
                loans.map(loan => (
                    <tr key={loan.id}>
                        <td>{loan.studentName}</td>
                        <td>{loan.libraryItemTitle}</td>
                        <td>{format(new Date(loan.loanDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                        <td>{format(new Date(loan.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                        <td><Badge bg={getStatusVariant(loan.status)}>{loan.status}</Badge></td>
                        <td className="text-center">
                            {loan.status === 'PENDING' && (
                                <ButtonGroup>
                                    <Button size="sm" variant="outline-success" onClick={() => handleUpdateStatus(loan.id, 'ACTIVE')} disabled={mutation.isPending}>
                                        <Check size={16} /> Aprovar
                                    </Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleUpdateStatus(loan.id, 'REJECTED')} disabled={mutation.isPending}>
                                        <X size={16} /> Recusar
                                    </Button>
                                </ButtonGroup>
                            )}
                            {(loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && (
                                <Button size="sm" variant="outline-primary" onClick={() => handleUpdateStatus(loan.id, 'RETURNED')} disabled={mutation.isPending}>
                                    <Undo2 size={16} /> Registrar Devolução
                                </Button>
                            )}
                        </td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan={6} className="text-center text-muted">Nenhum empréstimo encontrado com este status.</td></tr>
            )}
            </tbody>
        </Table>
    );
};