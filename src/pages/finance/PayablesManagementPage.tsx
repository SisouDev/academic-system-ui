import { useQuery } from '@tanstack/react-query';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getPendingPayables } from '../../services/employee/financeApi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PayableSummary } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PayablesManagementPage = () => {
    const { data: payables, isLoading, isError, error } = useQuery<PayableSummary[], Error>({
        queryKey: ['pendingPayables'],
        queryFn: getPendingPayables,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar contas a pagar: {error.message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Contas a Pagar</h1>
            </div>

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th style={{width: '15%'}}>Tipo</th>
                    <th style={{width: '40%'}}>Descrição</th>
                    <th>Status</th>
                    <th>Vencimento</th>
                    <th className="text-end">Valor</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {payables && payables.length > 0 ? (
                    payables.map(item => {
                        const [type] = item.payableId.split('-');
                        const linkTo = type === 'payroll'
                            ? '/finance/payroll'
                            : '/finance/purchase-orders';

                        return (
                            <tr key={item.payableId}>
                                <td>{item.type}</td>
                                <td>{item.description}</td>
                                <td>{item.status}</td>
                                <td>{format(new Date(item.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                                <td className="text-end fw-bold text-danger">
                                    {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className="text-center">
                                    <Link to={linkTo}>
                                        <Button size="sm" variant="outline-primary">
                                            Gerenciar <ArrowRight size={16} className="ms-1"/>
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr><td colSpan={6} className="text-center text-muted p-4">Nenhuma conta a pagar pendente.</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default PayablesManagementPage;