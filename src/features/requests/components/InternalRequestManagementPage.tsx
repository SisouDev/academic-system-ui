import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner, Alert, ButtonGroup, Button, Table, Badge } from 'react-bootstrap';
import type { InternalRequestSummary } from '../../../types';
import {getInternalRequests, reviewInternalRequest} from "../../../services/employee/secretaryApi.ts";
import {ReviewInternalRequestModal} from "./ReviewInternalRequestModal.tsx";

type RequestStatusFilter = 'PENDING' | 'APPROVED_BY_ASSISTANT' | 'REJECTED_BY_ASSISTANT' | 'PROCESSED';

const InternalRequestManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<RequestStatusFilter>('PENDING');
    const [selectedRequest, setSelectedRequest] = useState<InternalRequestSummary | null>(null);
    const queryClient = useQueryClient();

    const { data: requests, isLoading, isError } = useQuery<InternalRequestSummary[], Error>({
        queryKey: ['internalRequests', statusFilter],
        queryFn: () => getInternalRequests(statusFilter),
    });

    const mutation = useMutation({
        mutationFn: (data: { id: number; status: string; resolutionNotes?: string; }) => reviewInternalRequest(data),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['internalRequests'] });
            void queryClient.invalidateQueries({ queryKey: ['secretaryDashboardData'] });
            setSelectedRequest(null);
        },
    });

    const handleReview = (reviewData: { status: string; resolutionNotes?: string; }) => {
        if (selectedRequest) {
            mutation.mutate({ id: selectedRequest.id, ...reviewData });
        }
    };

    const filters: { label: string; status: RequestStatusFilter }[] = [
        { label: 'Pendentes', status: 'PENDING' },
        { label: 'Aprovadas', status: 'APPROVED_BY_ASSISTANT' },
        { label: 'Rejeitadas', status: 'REJECTED_BY_ASSISTANT' },
        { label: 'Processadas', status: 'PROCESSED' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Requisições Internas</h1>
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
                        <th style={{width: '40%'}}>Título</th>
                        <th>Solicitante</th>
                        <th>Urgência</th>
                        <th className="text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.length > 0 ? (
                        requests.map(req => (
                            <tr key={req.id}>
                                <td>{req.title}</td>
                                <td>{req.requesterName}</td>
                                <td><Badge pill bg={req.urgency === 'HIGH' ? 'danger' : 'secondary'}>{req.urgency}</Badge></td>
                                <td className="text-center">
                                    <Button size="sm" variant="outline-primary" onClick={() => setSelectedRequest(req)}>
                                        Analisar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={4} className="text-center text-muted p-4">Nenhuma requisição encontrada.</td></tr>
                    )}
                    </tbody>
                </Table>
            )}

            <ReviewInternalRequestModal
                show={!!selectedRequest}
                onHide={() => setSelectedRequest(null)}
                onConfirm={handleReview}
                request={selectedRequest}
                isSubmitting={mutation.isPending}
            />
        </div>
    );
};

export default InternalRequestManagementPage;