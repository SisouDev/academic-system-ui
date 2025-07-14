import { Modal, Button, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuthContext } from '../../../contexts/auth/AuthContext';
import api from '../../../services/auth/api';
import type { SupportTicketDetails, UpdateTicketData } from '../../../types';
import { formatTicketStatus, formatTicketPriority, formatTicketCategory } from '../../../utils/formatters';
import {useEffect} from "react";

const getTicketDetails = async (ticketId?: number | null): Promise<SupportTicketDetails | null> => {
    if (!ticketId) return null;
    const { data } = await api.get(`/api/v1/support-tickets/${ticketId}`);
    return data;
};

const updateTicketRequest = ({ id, ...data }: { id: number } & UpdateTicketData) => {
    return api.patch(`/api/v1/support-tickets/${id}`, data);
};

interface TicketDetailsModalProps {
    ticketId: number | null | undefined;
    show: boolean;
    onHide: () => void;
}

export const TicketDetailsModal = ({ ticketId, show, onHide }: TicketDetailsModalProps) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient();

    const { data: ticket, isLoading, isError } = useQuery({
        queryKey: ['ticketDetails', ticketId],
        queryFn: () => getTicketDetails(ticketId),
        enabled: !!ticketId && show,
    });

    const { register, handleSubmit, reset } = useForm<UpdateTicketData>();

    const { mutate, isPending, error: mutationError } = useMutation({
        mutationFn: updateTicketRequest,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
            await queryClient.invalidateQueries({ queryKey: ['ticketDetails', ticketId] });
            onHide();
        }
    });

    useEffect(() => {
        if (ticket) {
            reset({
                status: ticket.status,
                priority: ticket.priority,
            });
        }
    }, [ticket, reset]);

    if (!show) {
        return null;
    }

    const isHandler = user?.id === ticket?.assignee?.id;

    const onSubmit: SubmitHandler<UpdateTicketData> = (formData) => {
        if (ticket) {
            mutate({ id: ticket.id, ...formData });
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{isLoading ? 'Carregando...' : ticket?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <div className="text-center p-5"><Spinner /></div>}
                {isError && <Alert variant="danger">Não foi possível carregar os detalhes do chamado.</Alert>}

                {ticket && (
                    <>
                        <p><strong>Requisitante:</strong> {ticket.requester.fullName}</p>
                        <p><strong>Categoria:</strong> {formatTicketCategory(ticket.category)}</p>
                        <p><strong>Descrição:</strong></p>
                        <div className="p-3 bg-light rounded" dangerouslySetInnerHTML={{ __html: ticket.description || '' }} />
                        <hr/>

                        {isHandler ? (
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Atualizar Status</Form.Label>
                                            <Form.Select defaultValue={ticket.status} {...register('status')}>
                                                <option value="OPEN">Aberto</option>
                                                <option value="IN_PROGRESS">Em Andamento</option>
                                                <option value="WAITING_FOR_USER">Aguardando Usuário</option>
                                                <option value="RESOLVED">Resolvido</option>
                                                <option value="CLOSED">Fechado</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Atualizar Prioridade</Form.Label>
                                            <Form.Select defaultValue={ticket.priority} {...register('priority')}>
                                                <option value="LOW">Baixa</option>
                                                <option value="MEDIUM">Média</option>
                                                <option value="HIGH">Alta</option>
                                                <option value="CRITICAL">Crítica</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end">
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? <Spinner size="sm"/> : 'Atualizar Chamado'}
                                    </Button>
                                </div>
                                {mutationError && <Alert variant="danger" className="mt-3">{(mutationError as Error).message}</Alert>}
                            </Form>
                        ) : (
                            <div>
                                <p><strong>Prioridade:</strong> {formatTicketPriority(ticket.priority)}</p>
                                <p><strong>Status:</strong> {formatTicketStatus(ticket.status)}</p>
                                <p><strong>Responsável:</strong> {ticket.assignee?.fullName || 'Aguardando atribuição'}</p>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};