import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spinner, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Eye, PlusCircle } from 'lucide-react';
import api from '../../services/auth/api';
import type { SupportTicketSummary, HateoasCollection } from '../../types';
import { TicketDetailsModal } from '../../features/support/components/TicketDetailsModal';

import { formatTicketStatus, formatTicketPriority, formatTicketCategory } from '../../utils/formatters';

const getTickets = async (): Promise<SupportTicketSummary[]> => {
    const { data } = await api.get<HateoasCollection<SupportTicketSummary>>('/api/v1/support-tickets');
    return data._embedded?.supportTicketSummaryDtoList || [];
};

export default function MySupportTicketsPage() {
    const [selectedTicket, setSelectedTicket] = useState<SupportTicketSummary | null>(null);

    const { data: tickets, isLoading, isError, error } = useQuery({
        queryKey: ['supportTickets'],
        queryFn: getTickets,
    });

    const getPriorityBadgeVariant = (priority: string) => {
        switch(priority?.toUpperCase()) {
            case 'CRITICAL': return 'danger';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'primary';
            default: return 'secondary';
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch(status?.toUpperCase()) {
            case 'OPEN': return 'info';
            case 'IN_PROGRESS': return 'primary';
            case 'WAITING_FOR_USER': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'dark';
            default: return 'secondary';
        }
    }

    if (isLoading) return <div className="text-center p-5"><Spinner /></div>;
    if (isError) return <Alert variant="danger">Erro ao carregar chamados: {(error as Error).message}</Alert>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontFamily: 'Raleway, sans-serif' }}>Chamados de Suporte</h1>
                <Link to="/support/new" className="btn btn-primary">
                    <PlusCircle size={18} className="me-2" />
                    Abrir Novo Chamado
                </Link>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Título</th>
                    <th>Status</th>
                    <th>Prioridade</th>
                    <th>Categoria</th>
                    <th>Aberto em</th>
                    <th>Requisitante</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {tickets?.map((ticket) => (
                    <tr key={ticket.id}>
                        <td>{ticket.title}</td>
                        <td><Badge bg={getStatusBadgeVariant(ticket.status)}>{formatTicketStatus(ticket.status)}</Badge></td>
                        <td><Badge bg={getPriorityBadgeVariant(ticket.priority)}>{formatTicketPriority(ticket.priority)}</Badge></td>
                        <td>{formatTicketCategory(ticket.category)}</td>
                        <td>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td>{ticket.requesterName}</td>
                        <td>
                            <Button variant="outline-primary" size="sm" onClick={() => setSelectedTicket(ticket)}>
                                <Eye size={16} /> Detalhes
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <TicketDetailsModal
                ticketId={selectedTicket?.id}
                show={!!selectedTicket}
                onHide={() => setSelectedTicket(null)}
            />
        </div>
    );
}