import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Table, Badge, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { getAbsences, reviewAbsence } from '../../services/employee/hrApi';
import { Check, X, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AbsenceDetails } from '../../types';

const AbsenceManagementPage = () => {
    const queryClient = useQueryClient();

    const { data: absences, isLoading, isError, error } = useQuery<AbsenceDetails[], Error>({
        queryKey: ['absences', 'PENDING'],
        queryFn: () => getAbsences('PENDING'),
    });

    const reviewMutation = useMutation({
        mutationFn: reviewAbsence,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['absences'] });
        },
    });

    const handleReview = (id: number, status: 'APPROVED' | 'REJECTED') => {
        reviewMutation.mutate({ id, status });
    };

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar justificativas: {(error as Error).message}</Alert>;

    return (
        <Container>
            <h1 className="mb-4">Gerenciar Justificativas de Ausência</h1>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Solicitante</th>
                    <th>Data da Ausência</th>
                    <th>Status</th>
                    <th>Anexo</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {absences && absences.length > 0 ? (
                    absences.map(absence => (
                        <tr key={absence.id}>
                            <td>{absence.requester.fullName}</td>
                            <td>{format(new Date(absence.absenceDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                            <td>
                                {/* 2. Adicionamos a coluna e o Badge para o Status */}
                                <Badge bg="warning-subtle" text="warning-emphasis">{absence.status}</Badge>
                            </td>
                            <td>
                                {absence.attachmentUrl && (
                                    <a href={absence.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                        <Paperclip size={16} /> Ver
                                    </a>
                                )}
                            </td>
                            <td>
                                <ButtonGroup size="sm">
                                    <Button variant="outline-success" onClick={() => handleReview(absence.id, 'APPROVED')} disabled={reviewMutation.isPending}>
                                        <Check size={16} /> Aprovar
                                    </Button>
                                    <Button variant="outline-danger" onClick={() => handleReview(absence.id, 'REJECTED')} disabled={reviewMutation.isPending}>
                                        <X size={16} /> Rejeitar
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center">Nenhuma justificativa pendente.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AbsenceManagementPage;