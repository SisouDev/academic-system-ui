import {ButtonGroup, Button, Spinner, Alert, Table} from 'react-bootstrap';
import type {LoanDetails} from "../../types";
import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getLoans, updateLoanStatus} from "../../services/employee/libraryApi.ts";
import {LoanTableRow} from "../../features/library/components/LoanTableRow.tsx";
import { LinkContainer } from 'react-router-bootstrap';

import {PlusCircle} from "lucide-react";
type LoanStatusFilter = 'PENDING' | 'ACTIVE' | 'OVERDUE' | 'RETURNED' | 'REJECTED';

const LoanManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<LoanStatusFilter>('PENDING');
    const queryClient = useQueryClient();

    const { data: loans, isLoading, isError } = useQuery<LoanDetails[], Error>({
        queryKey: ['loans', statusFilter],
        queryFn: () => getLoans(statusFilter),
    });

    const mutation = useMutation({
        mutationFn: updateLoanStatus,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['loans', statusFilter] });
            void queryClient.invalidateQueries({ queryKey: ['librarianDashboardData'] });
        },
    });

    const filters: { label: string; status: LoanStatusFilter }[] = [
        { label: 'Pendentes', status: 'PENDING' },
        { label: 'Ativos', status: 'ACTIVE' },
        { label: 'Atrasados', status: 'OVERDUE' },
        { label: 'Devolvidos', status: 'RETURNED' },
        { label: 'Recusados', status: 'REJECTED' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Empréstimos</h1>
                <ButtonGroup>
                    {filters.map(filter => (
                        <Button
                            key={filter.status}
                            variant={statusFilter === filter.status ? 'primary' : 'outline-secondary'}
                            onClick={() => setStatusFilter(filter.status)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </ButtonGroup>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <LinkContainer to="/library/loans/new">
                        <Button>
                            <PlusCircle size={18} className="me-2" /> Registrar Novo Empréstimo
                        </Button>
                    </LinkContainer>
                </div>
            </div>

            {isLoading && <div className="text-center p-5"><Spinner /></div>}
            {isError && <Alert variant="danger" className="m-3">Não foi possível carregar os empréstimos.</Alert>}
            {loans && (
                <Table striped bordered hover responsive className="shadow-sm bg-body">
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
                    {loans.length > 0 ? (
                        loans.map(loan => (
                            <LoanTableRow key={loan.id} loan={loan} onUpdateStatus={mutation.mutate} isUpdating={mutation.isPending} />
                        ))
                    ) : (
                        <tr><td colSpan={6} className="text-center text-muted p-4">Nenhum empréstimo encontrado.</td></tr>
                    )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default LoanManagementPage;