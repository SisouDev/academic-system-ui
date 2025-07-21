import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Badge, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { getPayrollRecords, markPayrollAsPaid } from '../../services/employee/financeApi';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PayrollRecordDetails } from '../../types';

type PayrollStatusFilter = 'PENDING' | 'PAID' | 'CANCELLED';

const getStatusVariant = (status: PayrollStatusFilter) => {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'PAID': return 'success';
        case 'CANCELLED': return 'danger';
        default: return 'secondary';
    }
};

const PayrollManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<PayrollStatusFilter>('PENDING');
    const queryClient = useQueryClient();

    const { data: records, isLoading, isError, error } = useQuery<PayrollRecordDetails[], Error>({
        queryKey: ['payrollRecords', statusFilter],
        queryFn: () => getPayrollRecords(statusFilter),
    });

    const mutation = useMutation({
        mutationFn: markPayrollAsPaid,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['payrollRecords'] });
            void queryClient.invalidateQueries({ queryKey: ['financeDashboardData'] });
        },
    });

    const handleMarkAsPaid = (id: number) => {
        mutation.mutate(id);
    };

    const filters: { label: string; status: PayrollStatusFilter }[] = [
        { label: 'Pendentes', status: 'PENDING' },
        { label: 'Pagos', status: 'PAID' },
        { label: 'Cancelados', status: 'CANCELLED' },
    ];

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar folha de pagamento: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Folha de Pagamento</h1>
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
            </div>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th>Funcionário</th>
                    <th>Cargo</th>
                    <th>Mês de Referência</th>
                    <th className="text-end">Salário Líquido</th>
                    <th>Status</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {records && records.length > 0 ? (
                    records.map(record => (
                        <tr key={record.id}>
                            <td>{record.personName}</td>
                            <td>{record.personJobPosition}</td>
                            <td>{format(new Date(record.referenceMonth), 'MMMM/yyyy', { locale: ptBR })}</td>
                            <td className="text-end fw-bold">
                                {record.netPay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td><Badge bg={getStatusVariant(record.status)}>{record.status}</Badge></td>
                            <td className="text-center">
                                {record.status === 'PENDING' && (
                                    <Button
                                        size="sm"
                                        variant="outline-success"
                                        onClick={() => handleMarkAsPaid(record.id)}
                                        disabled={mutation.isPending && mutation.variables === record.id}
                                    >
                                        <CheckCircle size={16} className="me-2" />
                                        {mutation.isPending && mutation.variables === record.id ? 'Processando...' : 'Marcar como Pago'}
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={6} className="text-center text-muted p-4">Nenhum registro encontrado.</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default PayrollManagementPage;