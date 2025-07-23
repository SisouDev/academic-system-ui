import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { getPurchaseRequests, updatePurchaseRequestStatus } from '../../services/employee/financeApi';
import type { PurchaseRequest } from '../../types';
import {PurchaseRequestTableRow} from "../../features/finance/PurchaseRequestTableRow.tsx";

type RequestStatusFilter = 'PENDING' | 'APPROVED_BY_ASSISTANT' | 'REJECTED_BY_ASSISTANT' | 'PROCESSED';

const PurchaseRequestManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<RequestStatusFilter>('PENDING');
    const queryClient = useQueryClient();

    const { data: requests, isLoading, isError } = useQuery<PurchaseRequest[], Error>({
        queryKey: ['purchaseRequests', statusFilter],
        queryFn: () => getPurchaseRequests(statusFilter),
    });

    const mutation = useMutation({
        mutationFn: updatePurchaseRequestStatus,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['purchaseRequests'] });
            // Invalida também as Ordens de Compra, pois uma nova pode ter sido criada
            void queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
        },
    });

    const filters: { label: string; status: RequestStatusFilter }[] = [
        { label: 'Pendentes', status: 'PENDING' },
        { label: 'Aprovadas', status: 'APPROVED_BY_ASSISTANT' },
        { label: 'Processadas', status: 'PROCESSED' },
        { label: 'Rejeitadas', status: 'REJECTED_BY_ASSISTANT' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Analisar Requisições de Compra</h1>
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
            {isError && <Alert variant="danger">Não foi possível carregar as requisições.</Alert>}
            {requests && (
                <Table striped hover responsive className="shadow-sm bg-body align-middle">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th style={{width: '30%'}}>Item Solicitado</th>
                        <th>Solicitante</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th className="text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.length > 0 ? (
                        requests.map(req => (
                            <PurchaseRequestTableRow key={req.id} request={req} onUpdateStatus={mutation.mutate} isUpdating={mutation.isPending} />
                        ))
                    ) : (
                        <tr><td colSpan={6} className="text-center text-muted p-4">Nenhuma requisição encontrada.</td></tr>
                    )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default PurchaseRequestManagementPage;