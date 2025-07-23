import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { getFinancialTransactions, markTransactionAsPaid } from '../../services/employee/financeApi';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { FinancialTransaction } from '../../types';

type ReceivableTypeFilter = 'TUITION' | 'FINE';

const ReceivablesManagementPage = () => {
    const [typeFilter, setTypeFilter] = useState<ReceivableTypeFilter>('TUITION');
    const queryClient = useQueryClient();

    const { data: transactions, isLoading, isError, error } = useQuery<FinancialTransaction[], Error>({
        queryKey: ['financialTransactions', typeFilter, 'PENDING'],
        queryFn: () => getFinancialTransactions(typeFilter, 'PENDING'),
    });

    const mutation = useMutation({
        mutationFn: markTransactionAsPaid,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['financialTransactions'] });
            void queryClient.invalidateQueries({ queryKey: ['financeDashboardData'] });
        },
    });

    const handleMarkAsPaid = (id: number) => {
        mutation.mutate(id);
    };

    const filters: { label: string; type: ReceivableTypeFilter }[] = [
        { label: 'Mensalidades Pendentes', type: 'TUITION' },
        { label: 'Multas Pendentes', type: 'FINE' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Contas a Receber</h1>
                <ButtonGroup>
                    {filters.map(filter => (
                        <Button
                            key={filter.type}
                            variant={typeFilter === filter.type ? 'primary' : 'outline-secondary'}
                            onClick={() => setTypeFilter(filter.type)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th style={{width: '35%'}}>Descrição</th>
                    <th>Pessoa</th>
                    <th>Data</th>
                    <th className="text-end">Valor</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {isLoading && <tr><td colSpan={5} className="text-center p-5"><Spinner /></td></tr>}
                {isError && <tr><td colSpan={5}><Alert variant="danger">Erro ao carregar dados: {error.message}</Alert></td></tr>}

                {!isLoading && transactions && transactions.length > 0 ? (
                    transactions.map(trx => (
                        <tr key={trx.id}>
                            <td>{trx.description}</td>
                            <td>{trx.person.fullName}</td>
                            <td>{format(new Date(trx.transactionDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                            <td className="text-end fw-bold">
                                {trx.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="text-center">
                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleMarkAsPaid(trx.id)}
                                    disabled={mutation.isPending && mutation.variables === trx.id}
                                >
                                    <CheckCircle size={16} className="me-2" />
                                    {mutation.isPending && mutation.variables === trx.id ? 'Processando...' : 'Marcar como Recebido'}
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    !isLoading && <tr><td colSpan={5} className="text-center text-muted p-4">Nenhum item pendente encontrado.</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default ReceivablesManagementPage;