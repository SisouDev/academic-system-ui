import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { getPurchaseOrders, updatePurchaseOrderStatus } from '../../services/employee/financeApi';
import { PurchaseOrderTableRow } from '../../components/finance/components/PurchaseOrderTableRow';
import type { PurchaseOrderDetails } from '../../types';

type OrderStatusFilter = 'PENDING_APPROVAL' | 'APPROVED' | 'PAID' | 'REJECTED';

const PurchaseOrderManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('PENDING_APPROVAL');
    const queryClient = useQueryClient();

    const { data: orders, isLoading, isError } = useQuery<PurchaseOrderDetails[], Error>({
        queryKey: ['purchaseOrders', statusFilter],
        queryFn: () => getPurchaseOrders(statusFilter),
    });

    const mutation = useMutation({
        mutationFn: updatePurchaseOrderStatus,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
            void queryClient.invalidateQueries({ queryKey: ['financeDashboardData'] });
        },
    });

    const filters: { label: string; status: OrderStatusFilter }[] = [
        { label: 'Pendentes', status: 'PENDING_APPROVAL' },
        { label: 'Aprovadas', status: 'APPROVED' },
        { label: 'Pagas', status: 'PAID' },
        { label: 'Rejeitadas', status: 'REJECTED' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Ordens de Compra</h1>
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

            {isLoading && <div className="text-center p-5"><Spinner /></div>}
            {isError && <Alert variant="danger">Não foi possível carregar as ordens de compra.</Alert>}
            {orders && (
                <Table striped hover responsive className="shadow-sm bg-body align-middle">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th style={{width: '30%'}}>Fornecedor/Descrição</th>
                        <th>Solicitante</th>
                        <th className="text-end">Valor</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th className="text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <PurchaseOrderTableRow key={order.id} order={order} onUpdateStatus={mutation.mutate} isUpdating={mutation.isPending} />
                        ))
                    ) : (
                        <tr><td colSpan={7} className="text-center text-muted p-4">Nenhuma ordem de compra encontrada.</td></tr>
                    )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default PurchaseOrderManagementPage;