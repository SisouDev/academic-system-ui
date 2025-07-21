import { useQuery } from '@tanstack/react-query';
import { Container, Table, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { getSupportTickets } from '../../services/employee/itApi.ts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getPriorityVariant = (priority: string) => {
    switch (priority) {
        case 'URGENT': return 'danger';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return 'info';
        default: return 'secondary';
    }
};

const SupportTicketManagementPage = () => {
    const { data: tickets, isLoading, isError, error } = useQuery({
        queryKey: ['supportTickets', 'OPEN'],
        queryFn: () => getSupportTickets('OPEN'),
    });

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar chamados: {(error as Error).message}</Alert>;

    return (
        <Container>
            <h1 className="mb-4">Gerenciar Chamados de Suporte</h1>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Solicitante</th>
                    <th>Prioridade</th>
                    <th>Criado em</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {tickets && tickets.length > 0 ? (
                    tickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>#{ticket.id}</td>
                            <td>{ticket.title}</td>
                            <td>{ticket.requester.fullName}</td>
                            <td><Badge bg={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge></td>
                            <td>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                            <td>
                                <Button size="sm" variant="outline-primary">Ver Detalhes</Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center">Nenhum chamado em aberto.</td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default SupportTicketManagementPage;