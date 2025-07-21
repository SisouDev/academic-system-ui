import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getFines, markFineAsPaid } from '../../services/employee/libraryApi';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { FineDetails } from '../../types';

const FineManagementPage = () => {
    const queryClient = useQueryClient();

    const { data: fines, isLoading, isError, error } = useQuery<FineDetails[], Error>({
        queryKey: ['fines', 'PENDING'],
        queryFn: () => getFines('PENDING'),
    });

    const mutation = useMutation({
        mutationFn: markFineAsPaid,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['fines'] });
            void queryClient.invalidateQueries({ queryKey: ['librarianDashboardData'] });
        },
    });

    const handleMarkAsPaid = (id: number) => {
        mutation.mutate(id);
    };

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar multas: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Multas Pendentes</h1>
            </div>

            <Table striped bordered hover responsive className="shadow-sm bg-body">
                <thead>
                <tr>
                    <th>Usuário</th>
                    <th>Descrição</th>
                    <th className="text-end">Valor</th>
                    <th>Data</th>
                    <th className="text-center">Ações</th>
                </tr>
                </thead>
                <tbody>
                {fines && fines.length > 0 ? (
                    fines.map(fine => (
                        <tr key={fine.id}>
                            <td>{fine.student.fullName}</td>
                            <td>{fine.description}</td>
                            <td className="text-end">R$ {fine.amount.toFixed(2)}</td>
                            <td>{format(new Date(fine.transactionDate), 'dd/MM/yyyy', { locale: ptBR })}</td>
                            <td className="text-center">
                                <Button
                                    size="sm"
                                    variant="outline-success"
                                    onClick={() => handleMarkAsPaid(fine.id)}
                                    disabled={mutation.isPending && mutation.variables === fine.id}
                                >
                                    <CheckCircle size={16} className="me-2" />
                                    Marcar como Paga
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={5} className="text-center text-muted p-4">Nenhuma multa pendente.</td></tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default FineManagementPage;