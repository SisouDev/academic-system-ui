import { useQuery } from '@tanstack/react-query';
import {Table, Badge, Button, Spinner, Alert, ButtonGroup} from 'react-bootstrap';
import { getSupportTickets } from '../../services/employee/itApi.ts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type {SupportTicketDetails} from "../../types";
import {useState} from "react";
import {TicketDetailsModal} from "../../features/support/components/TicketDetailsModal.tsx";

type TicketStatusFilter = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';

const getStatusVariant = (status: string) => {
    switch(status?.toUpperCase()) {
        case 'OPEN': return 'info';
        case 'IN_PROGRESS': return 'primary';
        case 'WAITING_FOR_USER': return 'warning';
        case 'RESOLVED': return 'success';
        case 'CLOSED': return 'dark';
        default: return 'secondary';
    }
};

const getPriorityVariant = (priority: string) => {
    switch (priority) {
        case 'URGENT': return 'danger';
        case 'HIGH': return 'warning';
        case 'MEDIUM': return 'info';
        default: return 'secondary';
    }
};

const SupportTicketManagementPage = () => {
    const [statusFilter, setStatusFilter] = useState<TicketStatusFilter>('IN_PROGRESS');
    const [selectedTicket, setSelectedTicket] = useState<SupportTicketDetails | null>(null);

    const { data: tickets, isLoading, isError, error } = useQuery<SupportTicketDetails[], Error>({
        queryKey: ['supportTickets', statusFilter],
        queryFn: () => getSupportTickets(statusFilter),
    });

    const filters: { label: string; status: TicketStatusFilter }[] = [
        { label: 'Em Andamento', status: 'IN_PROGRESS' },
        { label: 'Aguardando Usuário', status: 'WAITING_FOR_USER' },
        { label: 'Abertos', status: 'OPEN' },
        { label: 'Resolvidos', status: 'RESOLVED' },
        { label: 'Fechados', status: 'CLOSED' },
    ];

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar chamados: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">Gerenciar Chamados de Suporte</h1>
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

            <Table striped bordered hover responsive className="shadow-sm bg-body align-middle">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Solicitante</th>
                    <th>Prioridade</th>
                    <th>Status</th>
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
                            <td>
                                <Badge bg={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                            </td>
                            <td>{format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                            <td>
                                <Button size="sm" variant="outline-primary" onClick={() => setSelectedTicket(ticket)}>
                                    Ver Detalhes
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr><td colSpan={7} className="text-center text-muted p-4">Nenhum chamado encontrado com este status.</td></tr>
                )}
                </tbody>
            </Table>
            <TicketDetailsModal
                ticketId={selectedTicket?.id}
                show={!!selectedTicket}
                onHide={() => setSelectedTicket(null)}
            />
        </div>
    );
};

export default SupportTicketManagementPage;