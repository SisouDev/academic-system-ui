import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Table, Badge, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { getLeaveRequests, reviewLeaveRequest } from '../../services/employee/hrApi';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // O import agora será utilizado

const LeaveRequestManagementPage = () => {
    const queryClient = useQueryClient();

    const { data: requests, isLoading, isError, error } = useQuery({
        queryKey: ['leaveRequests', 'PENDING'],
        queryFn: () => getLeaveRequests('PENDING'),
    });

    const reviewMutation = useMutation({
        mutationFn: reviewLeaveRequest,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
            void queryClient.invalidateQueries({ queryKey: ['hrDashboardData'] });
        },
    });

    const handleReview = (id: number, status: 'APPROVED' | 'REJECTED') => {
        reviewMutation.mutate({ id, status });
    };

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar solicitações: {(error as Error).message}</Alert>;

    return (
        <Container>
            <h1 className="mb-4">Gerenciar Solicitações de Licença</h1>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Solicitante</th>
                    <th>Tipo</th>
                    <th>Período</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {requests && requests.length > 0 ? (
                    requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.requester.fullName}</td>
                            <td>{req.type}</td>
                            <td>
                                {format(new Date(req.startDate), 'dd/MM/yy', { locale: ptBR })} - {format(new Date(req.endDate), 'dd/MM/yy', { locale: ptBR })}
                            </td>
                            <td><Badge bg="warning-subtle" text="warning-emphasis">{req.status}</Badge></td>
                            <td>
                                <ButtonGroup size="sm">
                                    <Button variant="outline-success" onClick={() => handleReview(req.id, 'APPROVED')} disabled={reviewMutation.isPending}>
                                        <Check size={16} /> Aprovar
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => handleReview(req.id, 'REJECTED')} disabled={reviewMutation.isPending}>
                                        <X size={16} /> Rejeitar
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center">Nenhuma solicitação pendente.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default LeaveRequestManagementPage;