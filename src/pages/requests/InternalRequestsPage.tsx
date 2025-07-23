import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Eye, PlusCircle } from 'lucide-react';
import api from '../../services/auth/api';
import type { InternalRequestDetails, HateoasCollection } from '../../types';
import { RequestDetailsModal } from '../../features/requests/components/RequestDetailsModal';
import { formatRequestStatus, formatRequestType, formatUrgencyLevel } from '../../utils/requests/components/formatters.ts';

const getMyRequests = async (): Promise<InternalRequestDetails[]> => {
    const { data } = await api.get<HateoasCollection<InternalRequestDetails>>('/api/v1/internal-requests/my-requests');
    return data._embedded?.internalRequestDetailsDtoList || [];
};

export default function InternalRequestsPage() {
    const [selectedRequest, setSelectedRequest] = useState<InternalRequestDetails | null>(null);

    const { data: requests, isLoading, isError, error } = useQuery({
        queryKey: ['internalRequests'],
        queryFn: getMyRequests,
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar requisições: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Requisições Internas</h1>
                <Link to="/requests/new" className="btn btn-primary d-inline-flex align-items-center">
                    <PlusCircle size={18} className="me-2" />
                    Abrir Nova Requisição
                </Link>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Status</th>
                    <th>Urgência</th>
                    <th>Data</th>
                    <th>Requisitante</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {requests && requests.length > 0 ? (
                    requests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.title}</td>
                            <td>{formatRequestType(request.type)}</td>
                            <td><Badge bg={getBadgeVariant(request.status)}>{formatRequestStatus(request.status)}</Badge></td>
                            <td><Badge bg={getBadgeVariant(request.urgency)}>{formatUrgencyLevel(request.urgency)}</Badge></td>
                            <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                            <td>{request.requester.fullName}</td>
                            <td>
                                <Button variant="outline-primary" size="sm" onClick={() => setSelectedRequest(request)}>
                                    <Eye size={16} /> Detalhes
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={7} className="text-center text-muted py-4">Nenhuma requisição encontrada.</td></tr>
                )}
                </tbody>
            </Table>

            <RequestDetailsModal
                request={selectedRequest}
                show={!!selectedRequest}
                onHide={() => setSelectedRequest(null)}
            />
        </div>
    );
}

const getBadgeVariant = (status: string) => {
    switch(status?.toUpperCase()) {
        case 'PENDING': return 'warning';
        case 'IN_PROGRESS': return 'info';
        case 'COMPLETED': return 'success';
        case 'REJECTED': return 'danger';
        case 'CRITICAL': return 'danger';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return 'primary';
        default: return 'secondary';
    }
}